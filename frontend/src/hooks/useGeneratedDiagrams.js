import { useEffect, useState } from 'react'
import { deleteGeneratedDiagram, listGeneratedDiagrams } from '@/services/generatedDiagramService'

export function useGeneratedDiagrams() {
    const [reloadKey, setReloadKey] = useState(0)
    const [state, setState] = useState({ items: [], status: 'loading' })

    useEffect(() => {
        let isCancelled = false

        listGeneratedDiagrams()
            .then((items) => {
                if (!isCancelled) {
                    setState({ items, status: 'ready' })
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setState((current) => ({ ...current, status: 'error' }))
                }
            })

        return () => {
            isCancelled = true
        }
    }, [reloadKey])

    const refresh = () => setReloadKey((current) => current + 1)

    const remove = async (diagramId) => {
        await deleteGeneratedDiagram(diagramId)
        setState((current) => ({
            ...current,
            items: current.items.filter((item) => item.id !== diagramId),
        }))
    }

    return { items: state.items, status: state.status, refresh, remove }
}