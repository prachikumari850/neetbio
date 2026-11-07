import { Microscope, Play } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import ProgressBar from '@/components/common/ProgressBar'
import { useDiagram } from '@/hooks/useDiagram'
import { chapterStartPath } from '@/utils/analyticsFormat'
import { cx } from '@/utils/classNames'
import { capitalize } from '@/utils/formatters'

function ContinueLearningPanel({ item, metaClassName = 'text-ink-700' }) {
    const { diagram } = useDiagram(item?.diagramId)

    if (!item) {
        return (
            <EmptyState
                icon={Play}
                title="Nothing in progress yet"
                description="Take a chapter test and your unfinished chapters show up here."
            >
                <Button to="/practice?tab=chapter" variant="soft" size="sm">
                    Browse chapter tests
                </Button>
            </EmptyState>
        )
    }

    const placeholder = <Microscope className="text-brand-purple/40 size-12" />

    return (
        <div className="border-line flex items-center gap-4 rounded-2xl border bg-white/80 p-4">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center">
                {diagram ? (
                    <AssetImage
                        src={diagram.image}
                        alt=""
                        className="max-h-full object-contain"
                        fallback={placeholder}
                    />
                ) : (
                    placeholder
                )}
            </span>
            <div className="min-w-0 flex-1">
                <h3 className="text-lg leading-tight font-extrabold">{item.name}</h3>
                <p className={cx('mt-1 text-xs', metaClassName)}>
                    {capitalize(item.subject)} • {item.mastered} of {item.total} questions mastered
                </p>
                <ProgressBar value={item.progress} className="mt-3" />
                <p className="text-ink-700 mt-1 text-right text-xs font-semibold">
                    {item.progress}% Completed
                </p>
                <Button to={chapterStartPath(item.name)} size="sm">
                    <Play className="size-4 fill-white" />
                    Continue
                </Button>
            </div>
        </div>
    )
}

export default ContinueLearningPanel