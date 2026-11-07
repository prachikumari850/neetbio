import { apiClient } from '@/services/apiClient'
import { useAuthStore } from '@/store/useAuthStore'

function toSource(apiSource) {
    return { diagramId: apiSource.diagram_id, title: apiSource.title }
}

function toMessage(apiMessage) {
    return {
        id: apiMessage.id,
        role: apiMessage.role,
        content: apiMessage.content,
        sources: (apiMessage.sources ?? []).map(toSource),
    }
}

function toEvent(event) {
    if (event.type === 'meta') {
        return {
            type: 'meta',
            conversationId: event.conversation_id,
            sources: event.sources.map(toSource),
        }
    }

    return event
}

async function readEvents(body, onEvent) {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    const handleLines = (lines) => {
        lines
            .filter((line) => line.trim())
            .forEach((line) => onEvent(toEvent(JSON.parse(line))))
    }

    let result = await reader.read()

    while (!result.done) {
        buffer += decoder.decode(result.value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        handleLines(lines)
        result = await reader.read()
    }

    handleLines([buffer])
}

async function postStream(path, { body, headers, signal, onEvent }) {
    const { token } = useAuthStore.getState()
    let response

    try {
        response = await fetch(`${apiClient.defaults.baseURL}${path}`, {
            method: 'POST',
            signal,
            headers: { ...headers, Authorization: `Bearer ${token}` },
            body,
        })
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error
        }

        throw new Error(
            'Cannot reach the server. Make sure the backend is running.',
            { cause: error }
        )
    }

    if (!response.ok) {
        if (response.status === 401) {
            useAuthStore.getState().clearSession()
        }

        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.error?.message ?? 'Something went wrong. Please try again.')
    }

    await readEvents(response.body, onEvent)
}

export async function getAiStatus() {
    const { data } = await apiClient.get('/ai/status')

    return {
        isOnline: data.ollama === 'up',
        chatModel: data.chat_model,
        isChatModelInstalled: data.chat_model_installed,
        embedModel: data.embed_model,
        isEmbedModelInstalled: data.embed_model_installed,
        knowledgeChunks: data.knowledge_chunks,
    }
}

export async function getVisionStatus() {
    const { data } = await apiClient.get('/ai/vision-status')

    return {
        isOnline: data.ollama === 'up',
        visionModel: data.vision_model,
        isVisionModelInstalled: data.vision_model_installed,
    }
}

export async function listConversations() {
    const { data } = await apiClient.get('/ai/conversations')

    return data.items.map(({ id, title, updated_at: updatedAt }) => ({
        id,
        title,
        updatedAt,
    }))
}

export async function getConversation(conversationId) {
    const { data } = await apiClient.get(
        `/ai/conversations/${encodeURIComponent(conversationId)}`,
    )

    return { id: data.id, title: data.title, messages: data.messages.map(toMessage) }
}

export async function deleteConversation(conversationId) {
    await apiClient.delete(`/ai/conversations/${encodeURIComponent(conversationId)}`)
}

export function streamChat({ message, conversationId, diagramId, signal, onEvent }) {
    return postStream('/ai/chat', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            conversation_id: conversationId ?? null,
            diagram_id: diagramId ?? null,
        }),
        signal,
        onEvent,
    })
}

export function streamAnalysis({ image, question, signal, onEvent }) {
    const form = new FormData()
    form.append('image', image)
    form.append('question', question)

    return postStream('/ai/analyze', { body: form, signal, onEvent })
}