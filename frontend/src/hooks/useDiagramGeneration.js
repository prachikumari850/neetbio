import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { findDiagramTemplate } from '@/utils/aiSimulator'

const GENERATION_DELAY_MS = 1200
const DEFAULT_PROMPT = 'Generate a labelled diagram of human respiratory system for NEET.'

export function useDiagramGeneration() {
    const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
    const [pendingPrompt, setPendingPrompt] = useState(null)
    const [template, setTemplate] = useState(null)

    useEffect(() => {
        if (!pendingPrompt) {
            return
        }

        const timer = setTimeout(() => {
            setTemplate(findDiagramTemplate(pendingPrompt))
            setPendingPrompt(null)
        }, GENERATION_DELAY_MS)

        return () => clearTimeout(timer)
    }, [pendingPrompt])

    const generate = () => {
        if (!prompt.trim()) {
            toast.error('Describe the diagram you want first.')
            return false
        }

        setPendingPrompt(prompt)
        return true
    }

    return {
        prompt,
        setPrompt,
        template,
        isGenerating: Boolean(pendingPrompt),
        generate,
    }
}