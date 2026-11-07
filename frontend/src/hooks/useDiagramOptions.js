import { useEffect, useState } from 'react'
import { listDiagrams } from '@/services/diagramService'

const MAX_DIAGRAMS = 50

export function useDiagramOptions() {
    const [options, setOptions] = useState([])

    useEffect(() => {
        let isCancelled = false

        listDiagrams({ sort: 'az', pageSize: MAX_DIAGRAMS })
            .then(({ items }) => {
                if (!isCancelled) {
                    setOptions(items.map((diagram) => ({ value: diagram.id, label: diagram.title })))
                }
            })
            .catch(() => {
                // Without the list, the chat simply has no topic picker options.
            })

        return () => {
            isCancelled = true
        }
    }, [])

    return options
}