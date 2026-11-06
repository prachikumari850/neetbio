import { useState } from 'react'
import { ListChecks } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import { summarizeNotes } from '@/utils/aiSimulator'

const MIN_WORDS = 25

function SummarizePanel() {
    const [notes, setNotes] = useState('')
    const [summary, setSummary] = useState(null)

    const handleSummarize = () => {
        const wordCount = notes.trim().split(/\s+/).filter(Boolean).length

        if (wordCount < MIN_WORDS) {
            toast.error(`Paste at least ${MIN_WORDS} words of notes.`)
            return
        }

        setSummary(summarizeNotes(notes))
    }

    return (
        <div className="space-y-4">
            <label htmlFor="notes-input" className="block text-sm font-bold">
                Paste your notes
            </label>
            <textarea
                id="notes-input"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={7}
                placeholder="Paste a few paragraphs of Biology notes here..."
                className="border-line w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/40"
            />
            <Button onClick={handleSummarize} className="w-full">
                <ListChecks className="size-5" />
                Summarize Notes
            </Button>

            {summary && (
                <div className="bg-brand-purple-soft/60 space-y-3 rounded-2xl px-4 py-3 text-sm">
                    <h3 className="font-bold">Key points</h3>
                    <ul className="list-disc space-y-1 pl-5">
                        {summary.keyPoints.map((point) => (
                            <li key={point}>{point}</li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                        {summary.keyTerms.map((term) => (
                            <Badge key={term}>{term}</Badge>
                        ))}
                    </div>
                    <p className="text-ink-500 text-xs">
                        Basic on-device summary. AI-quality summaries arrive with the backend.
                    </p>
                </div>
            )}
        </div>
    )
}

export default SummarizePanel