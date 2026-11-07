import { useEffect, useState } from 'react'
import { createNote, deleteNote, listNotes, updateNote } from '@/services/learningService'

export function useNotes() {
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState({ items: [], status: 'loading' })

    useEffect(() => {
        let isCancelled = false

        listNotes()
            .then((items) => {
                if (!isCancelled) {
                    setState({ items, status: 'ready' })
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setState({ items: [], status: 'error' })
                }
            })

        return () => {
            isCancelled = true
        }
    }, [attempt])

    const retry = () => {
        setState((current) => ({ ...current, status: 'loading' }))
        setAttempt((current) => current + 1)
    }

    const create = async (note) => {
        const saved = await createNote(note)
        setState((current) => ({ ...current, items: [saved, ...current.items] }))
    }

    const update = async (noteId, note) => {
        const saved = await updateNote(noteId, note)
        setState((current) => ({
            ...current,
            items: [saved, ...current.items.filter((item) => item.id !== noteId)],
        }))
    }

    const remove = async (noteId) => {
        await deleteNote(noteId)
        setState((current) => ({
            ...current,
            items: current.items.filter((item) => item.id !== noteId),
        }))
    }

    return { items: state.items, status: state.status, retry, create, update, remove }
}