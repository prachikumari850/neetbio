import { useEffect, useState } from 'react'
import { listDiagrams } from '@/services/diagramService'

export function useDiagramSearch(params) {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({ id: null, data: null, error: null })

    const requestKey = JSON.stringify(params)
    const requestId = `${requestKey}#${attempt}`

    useEffect(() => {
        let isCancelled = false

        listDiagrams(JSON.parse(requestKey))
            .then((data) => {
                if (!isCancelled) {
                    setState({ id: requestId, data, error: null })
                }
            })
            .catch((error) => {
                if (!isCancelled) {
                    setState({ id: requestId, data: null, error: error.message })
                }
            })

        return () => {
            isCancelled = true
        }
    }, [requestKey, requestId])

    const isCurrent = state.id === requestId

    return {
        items: state.data?.items ?? [],
        total: state.data?.total ?? 0,
        totalPages: state.data?.totalPages ?? 1,
        isLoading: !isCurrent,
        error: isCurrent ? state.error : null,
        retry: () => setAttempt((current) => current + 1),
    }
}