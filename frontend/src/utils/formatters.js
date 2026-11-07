const shortDateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
})

const longDateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
})

export function formatShortDate(isoString) {
    return shortDateFormat.format(new Date(isoString))
}

export function formatLongDate(isoString) {
    return isoString ? longDateFormat.format(new Date(isoString)) : ''
}

export function formatPhone(digits) {
    return digits ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : ''
}

export function formatTimer(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function toMinutes(seconds) {
    return Math.max(1, Math.round(seconds / 60))
}