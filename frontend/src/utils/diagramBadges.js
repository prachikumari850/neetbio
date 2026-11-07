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