export function describeSource(source) {
    if (source.type === 'pyq') {
        return `Previous-year question – NEET ${source.year}${source.paper ? ` (${source.paper})` : ''}`
    }

    if (source.type === 'open_licensed') {
        return source.name
    }

    if (source.type === 'ai_drafted') {
        return 'AI-drafted, reviewed by a person before publishing'
    }

    return 'Original NEETBIO question'
}