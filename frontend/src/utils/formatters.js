const shortDateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
})

export function formatShortDate(isoString) {
    return shortDateFormat.format(new Date(isoString))
}

export function formatTimer(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function toMinutes(seconds) {
    return Math.max(1, Math.round(seconds / 60))
}