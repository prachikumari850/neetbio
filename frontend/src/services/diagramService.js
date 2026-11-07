import { apiClient } from '@/services/apiClient'

const ALL = 'all'

function toDiagram(apiDiagram) {
    return {
        id: apiDiagram.id,
        title: apiDiagram.title,
        topic: apiDiagram.topic,
        chapter: apiDiagram.chapter,
        classLevel: apiDiagram.class_level,
        type: apiDiagram.type,
        features: apiDiagram.features,
        neet: apiDiagram.neet,
        image: apiDiagram.image,
        summary: apiDiagram.summary,
        structures: apiDiagram.structures,
    }
}

function toOptionalValue(value) {
    return value && value !== ALL ? value : undefined
}

function toQueryParams({
    query,
    classLevel,
    chapter,
    topic,
    types,
    features,
    ids,
    sort,
    page,
    pageSize,
}) {
    return {
        q: query?.trim() || undefined,
        class_level: toOptionalValue(classLevel),
        chapter: toOptionalValue(chapter),
        topic: toOptionalValue(topic),
        type: types,
        feature: features,
        ids,
        sort,
        page,
        page_size: pageSize,
    }
}

export async function listDiagrams(filters) {
    const { data } = await apiClient.get('/diagrams', {
        params: toQueryParams(filters),
    })

    return {
        items: data.items.map(toDiagram),
        total: data.total,
        page: data.page,
        totalPages: data.total_pages,
    }
}

export async function getDiagram(diagramId) {
    const { data } = await apiClient.get(`/diagrams/${encodeURIComponent(diagramId)}`)
    return toDiagram(data)
}

export async function getDiagramFacets() {
    const { data } = await apiClient.get('/diagrams/facets')

    return {
        chapters: data.chapters.map(({ name, class_level: classLevel }) => ({
            name,
            classLevel,
        })),
        topics: data.topics.map(({ name, chapter, class_level: classLevel }) => ({
            name,
            chapter,
            classLevel,
        })),
        types: data.types,
        features: data.features,
    }
}