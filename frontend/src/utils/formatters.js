const shortDateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
})

const longDateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
})

const MS_PER_MINUTE = 60000
const HOURS_PER_DAY = 24

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

export function formatDuration(totalSeconds) {
    const totalMinutes = Math.round(totalSeconds / 60)
    const hours = Math.floor(totalMinutes / 60)

    if (hours === 0) {
        return `${totalMinutes}m`
    }

    return `${hours}h ${String(totalMinutes % 60).padStart(2, '0')}m`
}

export function formatRelativeTime(isoString) {
    const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / MS_PER_MINUTE)

    if (minutes < 1) {
        return 'Just now'
    }

    if (minutes < 60) {
        return `${minutes} min ago`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < HOURS_PER_DAY) {
        return `${hours}h ago`
    }

    return hours < HOURS_PER_DAY * 2 ? 'Yesterday' : formatShortDate(isoString)
}

export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}