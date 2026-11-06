import { Image as ImageIcon, Sparkles } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'

function GenerateSideCard({ generation, onGenerate }) {
    return (
        <Card className="p-5">
            <h2 className="text-brand-orange mb-3 flex items-center gap-2.5 text-lg font-extrabold">
                <ImageIcon className="size-6" />
                <span className="text-ink-900">Generate Biology Image</span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                <div>
                    <textarea
                        aria-label="Diagram description"
                        value={generation.prompt}
                        onChange={(event) => generation.setPrompt(event.target.value)}
                        rows={3}
                        className="border-line w-full resize-none rounded-2xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-purple/40"
                    />
                    <Button onClick={onGenerate} className="mt-3 w-full">
                        Generate
                        <Sparkles className="size-4" />
                    </Button>
                </div>
                <AssetImage
                    src="/images/ai/lungs.png"
                    className="hidden h-32 self-center object-contain sm:block"
                />
            </div>
        </Card>
    )
}

export default GenerateSideCard