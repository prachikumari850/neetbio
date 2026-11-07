import { useEffect, useState } from 'react'
import { deleteConversation, listConversations } from '@/services/aiService'

export function useConversations() {
    const [reloadKey, setReloadKey] = useState(0)
    const [state, setState] = useState({ items: [], status: 'loading' })

    useEffect(() => {
        let isCancelled = false

        listConversations()
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

    const remove = async (conversationId) => {
        await deleteConversation(conversationId)
        setState((current) => ({
            ...current,
            items: current.items.filter((item) => item.id !== conversationId),
        }))
    }

    return { items: state.items, status: state.status, refresh, remove }
}