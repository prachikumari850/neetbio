const STOP_WORDS = new Set([
    'the', 'and', 'that', 'with', 'this', 'from', 'are', 'for', 'was', 'were',
    'which', 'their', 'have', 'has', 'into', 'also', 'such', 'can', 'its', 'but',
    'not', 'these', 'those', 'than', 'then', 'they', 'when', 'where', 'while',
])

export function createMessage(role, content) {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        content,
    }
}

function getWords(text) {
    return text.toLowerCase().match(/[a-z]{4,}/g) ?? []
}

export function summarizeNotes(text) {
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 20)

    const frequency = new Map()
    getWords(text)
        .filter((word) => !STOP_WORDS.has(word))
        .forEach((word) => frequency.set(word, (frequency.get(word) ?? 0) + 1))

    const keyPoints = sentences
        .map((sentence, index) => ({
            sentence,
            index,
            score: getWords(sentence).reduce(
                (total, word) => total + (frequency.get(word) ?? 0),
                0,
            ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .sort((a, b) => a.index - b.index)
        .map(({ sentence }) => sentence)

    const keyTerms = [...frequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([word]) => word)

    return { keyPoints, keyTerms }
}