import { Microscope, Play } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import { continueLearning } from '@/data/mockDashboard'
import { diagrams } from '@/data/mockDiagrams'
import { cx } from '@/utils/classNames'

function ContinueLearningCard({ className }) {
    const diagram = diagrams.find((item) => item.id === continueLearning.diagramId)

    return (
        <SectionCard
            icon={Play}
            title="Continue Learning"
            iconClassName="fill-brand-orange text-brand-orange"
            className={cx('bg-linear-to-b from-[#eefbe9] to-white', className)}
        >
            <div className="border-line flex items-center gap-4 rounded-2xl border bg-white/80 p-4">
                <span className="flex h-24 w-24 shrink-0 items-center justify-center">
                    <AssetImage
                        src={diagram.image}
                        alt=""
                        className="max-h-full object-contain"
                        fallback={<Microscope className="text-brand-purple/40 size-12" />}
                    />
                </span>
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg leading-tight font-extrabold">
                        {continueLearning.title}
                    </h3>
                    <p className="text-ink-700 mt-1 text-xs">{continueLearning.chapter}</p>
                    <ProgressBar value={continueLearning.progress} className="mt-3" />
                    <p className="text-ink-700 mt-1 text-right text-xs font-semibold">
                        {continueLearning.progress}% Completed
                    </p>
                    <Button to={`/diagrams?open=${diagram.id}`} size="sm">
                        <Play className="size-4 fill-white" />
                        Continue
                    </Button>
                </div>
            </div>
        </SectionCard>
    )
}

export default ContinueLearningCard