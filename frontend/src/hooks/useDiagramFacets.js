import { useEffect, useState } from 'react'
import { getDiagramFacets } from '@/services/diagramService'

const emptyFacets = { chapters: [], topics: [], types: {}, features: {} }

export function useDiagramFacets() {
    const [facets, setFacets] = useState(emptyFacets)

    useEffect(() => {
        let isCancelled = false

        getDiagramFacets()
            .then((data) => {
                if (!isCancelled) {
                    setFacets(data)
                }
            })
            .catch(() => {
                // The diagram list reports connection problems; empty filters are fine meanwhile.
            })

        return () => {
            isCancelled = true
        }
    }, [])

    return facets
}