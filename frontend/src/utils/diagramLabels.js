const MAX_LINES = 2

export function wrapLabel(label, maxChars) {
    const lines = []
    let current = ''

    label.split(' ').forEach((word) => {
        const candidate = current ? `${current} ${word}` : word

        if (!current || candidate.length <= maxChars) {
            current = candidate
        } else {
            lines.push(current)
            current = word
        }
    })

    lines.push(current)

    if (lines.length <= MAX_LINES) {
        return lines
    }

    const kept = lines.slice(0, MAX_LINES)
    kept[MAX_LINES - 1] = `${kept[MAX_LINES - 1].slice(0, maxChars - 1)}…`
    return kept
}

export function toFileName(title) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    return `${slug || 'diagram'}.svg`
}