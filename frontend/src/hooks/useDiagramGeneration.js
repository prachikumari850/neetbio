import { useState } from 'react'
import toast from 'react-hot-toast'
import { useGeneratedDiagrams } from '@/hooks/useGeneratedDiagrams'
import { generateDiagram, getGeneratedDiagram } from '@/services/generatedDiagramService'

const DEFAULT_PROMPT = 'Generate a labelled diagram of human respiratory system for NEET.'

export function useDiagramGeneration() {
    const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
    const [diagram, setDiagram] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState('')
    const saved = useGeneratedDiagrams()

    const generate = () => {
        const text = prompt.trim()

        if (!text) {
            toast.error('Describe the diagram you want first.')
            return false
        }

        if (isGenerating) {
            return true
        }

        setIsGenerating(true)
        setError('')

        generateDiagram(text)
            .then((result) => {
                setDiagram(result)
                saved.refresh()
            })
            .catch((generationError) => setError(generationError.message))
            .finally(() => setIsGenerating(false))

        return true
    }

    const openSaved = async (item) => {
        try {
            setDiagram(await getGeneratedDiagram(item.id))
            setError('')
        } catch (openError) {
            toast.error(openError.message)
        }
    }

    const removeSaved = async (item) => {
        try {
            await saved.remove(item.id)
            setDiagram((current) => (current?.id === item.id ? null : current))
            toast.success('Diagram deleted')
        } catch (removeError) {
            toast.error(removeError.message)
        }
    }

    return {
        prompt,
        setPrompt,
        diagram,
        isGenerating,
        error,
        generate,
        saved,
        openSaved,
        removeSaved,
    }
}