import { useEffect, useState } from 'react'
import { getDiagram } from '@/services/diagramService'

export function useDiagram(diagramId) {
    const [result, setResult] = useState({ id: null, diagram: null })

    useEffect(() => {
        if (!diagramId) {
            return undefined
        }

        let isCancelled = false

        getDiagram(diagramId)
            .then((diagram) => {
                if (!isCancelled) {
                    setResult({ id: diagramId, diagram })
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setResult({ id: diagramId, diagram: null })
                }
            })

        return () => {
            isCancelled = true
        }
    }, [diagramId])

    const isCurrent = result.id === diagramId

    return {
        diagram: isCurrent ? result.diagram : null,
        isLoading: Boolean(diagramId) && !isCurrent,
    }
}