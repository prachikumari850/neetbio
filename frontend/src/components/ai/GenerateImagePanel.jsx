import { LoaderCircle, Sparkles } from 'lucide-react'
import SimulatedDiagram from '@/components/ai/SimulatedDiagram'
import Button from '@/components/common/Button'

function GenerateImagePanel({ generation }) {
    const { prompt, setPrompt, template, isGenerating, generate } = generation

    return (
        <div className="space-y-4">
            <label htmlFor="generate-prompt" className="block text-sm font-bold">
                Describe the diagram you need
            </label>
            <textarea
                id="generate-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={3}
                className="border-line w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-purple/40"
            />
            <Button onClick={generate} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                    <LoaderCircle className="size-5 animate-spin" />
                ) : (
                    <Sparkles className="size-5" />
                )}
                {isGenerating ? 'Generating...' : 'Generate'}
            </Button>

            {template && !isGenerating && (
                <SimulatedDiagram title={template.title} labels={template.labels} />
            )}
        </div>
    )
}

export default GenerateImagePanel