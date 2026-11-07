import { apiClient } from '@/services/apiClient'

const GENERATION_TIMEOUT_MS = 330000

function toDiagram(apiDiagram) {
    return {
        id: apiDiagram.id,
        prompt: apiDiagram.prompt,
        title: apiDiagram.title,
        kind: apiDiagram.kind,
        createdAt: apiDiagram.created_at,
        parts: apiDiagram.parts,
        scene: apiDiagram.scene,
    }
}

function diagramPath(diagramId) {
    return `/ai/diagrams/${encodeURIComponent(diagramId)}`
}

export async function generateDiagram(prompt) {
    const { data } = await apiClient.post(
        '/ai/diagrams',
        { prompt },
        { timeout: GENERATION_TIMEOUT_MS },
    )
    return toDiagram(data)
}

export async function listGeneratedDiagrams() {
    const { data } = await apiClient.get('/ai/diagrams')

    return data.items.map(({ id, title, kind, created_at: createdAt }) => ({
        id,
        title,
        kind,
        createdAt,
    }))
}

export async function getGeneratedDiagram(diagramId) {
    const { data } = await apiClient.get(diagramPath(diagramId))
    return toDiagram(data)
}

export async function deleteGeneratedDiagram(diagramId) {
    await apiClient.delete(diagramPath(diagramId))
}