import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { getAiStatus, getVisionStatus } from '@/services/aiService'

const OFFLINE_PROBLEM = {
    text: 'The AI engine (Ollama) is not running. Start Ollama, then check again.',
}

function getChatProblem(status) {
    if (!status.isChatModelInstalled) {
        return {
            text: `The chat model “${status.chatModel}” is not installed. Run: ollama pull ${status.chatModel}`,
        }
    }

    if (!status.isEmbedModelInstalled || status.knowledgeChunks === 0) {
        return {
            text: `Answers will not use NEETBIO diagram notes yet. Run: ollama pull ${status.embedModel} and then python -m app.database.index_knowledge`,
        }
    }

    return null
}

function getVisionProblem(status) {
    if (!status.isVisionModelInstalled) {
        return {
            text: `The image model “${status.visionModel}” is not installed. Run: ollama pull ${status.visionModel}`,
        }
    }

    return null
}

const features = {
    chat: { fetchStatus: getAiStatus, getProblem: getChatProblem },
    vision: { fetchStatus: getVisionStatus, getProblem: getVisionProblem },
}

function findProblem(status, getFeatureProblem) {
    if (status.unreachable) {
        return { text: 'Cannot reach the NEETBIO server. Make sure the backend is running.' }
    }

    if (!status.isOnline) {
        return OFFLINE_PROBLEM
    }

    return getFeatureProblem(status)
}

function AiStatusNotice({ feature = 'chat' }) {
    const [attempt, setAttempt] = useState(0)
    const [status, setStatus] = useState(null)
    const { fetchStatus, getProblem } = features[feature]

    useEffect(() => {
        let isCancelled = false

        fetchStatus()
            .then((result) => {
                if (!isCancelled) {
                    setStatus(result)
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setStatus({ unreachable: true })
                }
            })

        return () => {
            isCancelled = true
        }
    }, [attempt, fetchStatus])

    const problem = status ? findProblem(status, getProblem) : null

    if (!problem) {
        return null
    }

    return (
        <div
            role="status"
            className="bg-brand-orange-soft flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 text-sm"
        >
            <TriangleAlert className="text-brand-orange size-5 shrink-0" />
            <p className="min-w-0 flex-1 font-medium break-words">{problem.text}</p>
            <button
                type="button"
                onClick={() => setAttempt((current) => current + 1)}
                className="text-brand-orange font-bold hover:underline"
            >
                Check again
            </button>
        </div>
    )
}

export default AiStatusNotice