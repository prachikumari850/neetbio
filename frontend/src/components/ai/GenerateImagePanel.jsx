import { LoaderCircle, Sparkles } from 'lucide-react'
import AiStatusNotice from '@/components/ai/AiStatusNotice'
import GeneratedDiagramView from '@/components/ai/GeneratedDiagramView'
import SavedDiagramList from '@/components/ai/SavedDiagramList'
import Button from '@/components/common/Button'

function GenerateImagePanel({ generation }) {
    const {
        prompt,
        setPrompt,
        diagram,
        isGenerating,
        error,
        generate,
        saved,
        openSaved,
        removeSaved,
    } = generation

    return (
        <div className="space-y-4">
            <AiStatusNotice feature="generate" />

            <label htmlFor="generate-prompt" className="block text-sm font-bold">
                Describe the diagram you need
            </label>
            <textarea
                id="generate-prompt"
                value={prompt}
                maxLength={300}
                disabled={isGenerating}
                onChange={(event) => setPrompt(event.target.value)}
                rows={3}
                className="border-line focus:ring-brand-purple/40 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
            />
            <Button onClick={generate} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                    <LoaderCircle className="size-5 animate-spin" />
                ) : (
                    <Sparkles className="size-5" />
                )}
                {isGenerating ? 'Generating...' : 'Generate'}
            </Button>

            {isGenerating && (
                <p className="text-ink-500 text-center text-sm">
                    Planning your diagram. On a laptop without a graphics card this can take a minute or
                    more. You can leave this page and find the result under “Your generated diagrams”.
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    className="bg-danger-soft text-danger rounded-xl px-4 py-3 text-sm font-semibold"
                >
                    {error}
                </p>
            )}

            {diagram && !isGenerating && <GeneratedDiagramView key={diagram.id} diagram={diagram} />}

            <SavedDiagramList
                items={saved.items}
                status={saved.status}
                onOpen={openSaved}
                onRemove={removeSaved}
            />
        </div>
    )
}

export default GenerateImagePanel