import { useEffect, useRef, useState } from 'react'
import { BookOpen, Mic, Paperclip, Send, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import AiStatusNotice from '@/components/ai/AiStatusNotice'
import ChatMessage from '@/components/ai/ChatMessage'
import SelectField from '@/components/common/SelectField'
import { useDiagramOptions } from '@/hooks/useDiagramOptions'
import { streamChat } from '@/services/aiService'
import { createMessage } from '@/utils/aiSimulator'

const ANY_TOPIC = ''

function ChatPanel({
    initialMessages,
    initialConversationId,
    initialDraft,
    initialDiagramId,
    onSaved,
    onAttach,
}) {
    const [messages, setMessages] = useState(initialMessages)
    const [draft, setDraft] = useState(initialDraft)
    const [diagramId, setDiagramId] = useState(initialDiagramId)
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState('')
    const conversationIdRef = useRef(initialConversationId)
    const abortRef = useRef(null)
    const containerRef = useRef(null)
    const diagramOptions = useDiagramOptions()

    useEffect(() => () => abortRef.current?.abort(), [])

    useEffect(() => {
        const container = containerRef.current

        if (container) {
            container.scrollTop = container.scrollHeight
        }
    }, [messages])

    const send = async (text) => {
        const question = text.trim()

        if (!question || isStreaming) {
            return
        }

        const userMessage = createMessage('user', question)
        const replyMessage = { ...createMessage('assistant', ''), sources: [] }
        const controller = new AbortController()

        const updateReply = (change) =>
            setMessages((current) =>
                current.map((message) =>
                    message.id === replyMessage.id ? { ...message, ...change(message) } : message,
                ),
            )

        const discardExchange = () => {
            setMessages((current) =>
                current.filter(
                    (message) => message.id !== userMessage.id && message.id !== replyMessage.id,
                ),
            )
            setDraft(question)
        }

        abortRef.current = controller
        setMessages((current) => [...current, userMessage, replyMessage])
        setDraft('')
        setError('')
        setIsStreaming(true)

        let pendingConversationId = null
        let isDone = false

        try {
            await streamChat({
                message: question,
                conversationId: conversationIdRef.current,
                diagramId: diagramId || undefined,
                signal: controller.signal,
                onEvent: (event) => {
                    if (event.type === 'meta') {
                        pendingConversationId = event.conversationId
                        updateReply(() => ({ sources: event.sources }))
                    } else if (event.type === 'token') {
                        updateReply((message) => ({ content: message.content + event.text }))
                    } else if (event.type === 'error') {
                        throw new Error(event.message)
                    } else if (event.type === 'done') {
                        isDone = true
                    }
                },
            })

            if (!isDone) {
                throw new Error('The reply was interrupted. Please try again.')
            }

            conversationIdRef.current = pendingConversationId
            onSaved(pendingConversationId)
        } catch (streamError) {
            discardExchange()

            if (!controller.signal.aborted) {
                setError(streamError.message)
            }
        } finally {
            abortRef.current = null
            setIsStreaming(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        send(draft)
    }

    return (
        <div className="flex flex-col gap-4">
            <AiStatusNotice />

            <SelectField
                id="chat-topic"
                label="Ask about"
                icon={BookOpen}
                value={diagramId}
                onChange={setDiagramId}
                options={[{ value: ANY_TOPIC, label: 'Any Biology topic' }, ...diagramOptions]}
                className="max-w-xs"
            />

            <div ref={containerRef} className="h-[28rem] space-y-4 overflow-y-auto pr-1">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </div>

            {error && (
                <p
                    role="alert"
                    className="bg-danger-soft text-danger rounded-xl px-4 py-3 text-sm font-semibold"
                >
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-pill border-line shadow-card flex items-center gap-3 border bg-white py-2 pr-2 pl-4"
            >
                <button
                    type="button"
                    aria-label="Attach an image"
                    onClick={onAttach}
                    className="text-brand-purple hover:bg-brand-purple-soft rounded-full p-1.5"
                >
                    <Paperclip className="size-5" />
                </button>
                <input
                    type="text"
                    value={draft}
                    maxLength={2000}
                    disabled={isStreaming}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask a biology question, upload an image, or generate a diagram..."
                    aria-label="Message"
                    className="placeholder:text-ink-500 min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                    type="button"
                    aria-label="Voice input"
                    onClick={() => toast('Voice input is not available yet.')}
                    className="text-ink-700 hover:bg-brand-purple-soft rounded-full p-1.5"
                >
                    <Mic className="size-5" />
                </button>
                {isStreaming ? (
                    <button
                        type="button"
                        aria-label="Stop reply"
                        onClick={() => abortRef.current?.abort()}
                        className="bg-ink-900 flex size-10 items-center justify-center rounded-full text-white"
                    >
                        <Square className="size-4 fill-white" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        aria-label="Send message"
                        className="bg-action-orange flex size-10 items-center justify-center rounded-full text-white"
                    >
                        <Send className="size-5" />
                    </button>
                )}
            </form>

            <p className="text-ink-500 text-center text-xs">
                Answers come from a small AI model running on your computer and can contain mistakes.
                Check important facts in your NCERT textbook.
            </p>
        </div>
    )
}

export default ChatPanel