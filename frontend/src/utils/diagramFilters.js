export function filterDiagrams(diagrams, filters) {
    const { query, classLevel, chapter, topic, types, features } = filters
    const normalizedQuery = query.trim().toLowerCase()

    return diagrams.filter((diagram) => {
        const matchesQuery =
            !normalizedQuery ||
            [diagram.title, diagram.topic, diagram.chapter].some((text) =>
                text.toLowerCase().includes(normalizedQuery),
            )

        return (
            matchesQuery &&
            (classLevel === 'all' || diagram.classLevel === classLevel) &&
            (chapter === 'all' || diagram.chapter === chapter) &&
            (topic === 'all' || diagram.topic === topic) &&
            (types.length === 0 || types.includes(diagram.type)) &&
            features.every((feature) => diagram.features.includes(feature))
        )
    })
}

export function sortDiagrams(diagrams, sort) {
    if (sort === 'az') {
        return [...diagrams].sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sort === 'za') {
        return [...diagrams].sort((a, b) => b.title.localeCompare(a.title))
    }

    return diagrams
}

export function getDiagramBadges(diagram) {
    const badges = []

    if (diagram.features.includes('interactive')) {
        badges.push({ label: 'Interactive', tone: 'success' })
    }

    if (diagram.features.includes('practice')) {
        badges.push({ label: 'Practice', tone: 'info' })
    }

    if (diagram.neet) {
        badges.push({ label: 'NEET', tone: 'danger' })
    }

    return badges
}