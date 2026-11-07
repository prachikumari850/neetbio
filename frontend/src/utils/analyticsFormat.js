const STRONG_ACCURACY = 75
const OK_ACCURACY = 60

export function formatAccuracy(accuracy) {
    return accuracy === null ? '—' : `${accuracy}%`
}

export function accuracyTone(accuracy) {
    if (accuracy === null) {
        return 'neutral'
    }

    if (accuracy >= STRONG_ACCURACY) {
        return 'success'
    }

    return accuracy >= OK_ACCURACY ? 'info' : 'danger'
}

export function chapterStartPath(chapterName) {
    return `/practice?start=chapter-${encodeURIComponent(chapterName)}`
}