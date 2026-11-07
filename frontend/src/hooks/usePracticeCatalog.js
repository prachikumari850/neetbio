import { useEffect, useState } from 'react'
import { getCatalog } from '@/services/practiceService'

export function usePracticeCatalog() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({ data: null, status: 'loading' })

    useEffect(() => {
        let isCancelled = false

        getCatalog()
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

    return { ...state, retry: () => setAttempt((current) => current + 1) }
}