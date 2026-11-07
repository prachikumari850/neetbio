import { useEffect, useState } from 'react'
import { getAnalytics } from '@/services/learningService'

export function useAnalytics() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({ data: null, status: 'loading' })

    useEffect(() => {
        let isCancelled = false

        getAnalytics()
            .then((data) => {
                if (!isCancelled) {
                    setState({ data, status: 'ready' })
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setState({ data: null, status: 'error' })
                }
            })

        return () => {
            isCancelled = true
        }
    }, [attempt])

    const retry = () => {
        setState({ data: null, status: 'loading' })
        setAttempt((current) => current + 1)
    }

    return { ...state, retry }
}