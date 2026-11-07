import { BookOpen, CircleCheck } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import ProgressBar from '@/components/common/ProgressBar'
import { chapterStartPath } from '@/utils/analyticsFormat'
import { capitalize, formatShortDate } from '@/utils/formatters'

const emptyText = {
    progress: {
        title: 'Nothing in progress',
        description: 'Take a chapter test and your unfinished chapters appear here.',
    },
    completed: {
        title: 'No completed chapters yet',
        description: 'A chapter is completed once you have answered every one of its questions correctly.',
    },
}

function LearningItemList({ items, variant }) {
    if (items.length === 0) {
        return (
            <Card>
                <EmptyState icon={BookOpen} {...emptyText[variant]}>
                    <Button to="/practice?tab=chapter" variant="soft" size="sm">
                        Browse chapter tests
                    </Button>
                </EmptyState>
            </Card>
        )
    }

    return (
        <ul className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
                <li key={item.name}>
                    <Card className="flex h-full flex-col gap-3 p-5">
                        <div className="flex items-start gap-3">
                            {variant === 'completed' && (
                                <CircleCheck className="fill-success mt-0.5 size-6 shrink-0 text-white" />
                            )}
                            <div>
                                <h3 className="leading-tight font-extrabold">{item.name}</h3>
                                <p className="text-ink-700 text-xs">
                                    {capitalize(item.subject)} • {item.mastered} of {item.total} questions mastered
                                </p>
                            </div>
                        </div>

                        <div>
                            <ProgressBar value={item.progress} />
                            <p className="text-ink-700 mt-1 text-right text-xs font-semibold">
                                {item.progress}% Completed
                            </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-3">
                            <span className="text-ink-500 text-xs">
                                Last practised {formatShortDate(item.lastPracticed)}
                            </span>
                            <Button
                                to={chapterStartPath(item.name)}
                                size="sm"
                                variant={variant === 'progress' ? 'orange' : 'outline'}
                            >
                                {variant === 'progress' ? 'Continue' : 'Practise again'}
                            </Button>
                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    )
}

export default LearningItemList