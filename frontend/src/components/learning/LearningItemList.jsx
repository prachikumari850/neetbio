import { BookOpen, CircleCheck } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import ProgressBar from '@/components/common/ProgressBar'
import { formatShortDate } from '@/utils/formatters'

function LearningItemList({ items, variant }) {
    if (items.length === 0) {
        return (
            <Card>
                <EmptyState icon={BookOpen} title="Nothing here yet" />
            </Card>
        )
    }

    return (
        <ul className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
                <li key={item.id}>
                    <Card className="flex h-full flex-col gap-3 p-5">
                        <div className="flex items-start gap-3">
                            {variant === 'completed' && (
                                <CircleCheck className="fill-success mt-0.5 size-6 shrink-0 text-white" />
                            )}
                            <div>
                                <h3 className="leading-tight font-extrabold">{item.title}</h3>
                                <p className="text-ink-700 text-xs">{item.meta}</p>
                            </div>
                        </div>

                        {variant === 'progress' && (
                            <div>
                                <ProgressBar value={item.progress} />
                                <p className="text-ink-700 mt-1 text-right text-xs font-semibold">
                                    {item.progress}% Completed
                                </p>
                            </div>
                        )}

                        <div className="mt-auto flex items-center justify-between gap-3">
                            {variant === 'completed' && (
                                <span className="text-ink-500 text-xs">
                                    Completed {formatShortDate(item.completedOn)}
                                </span>
                            )}
                            <Button
                                to={item.to}
                                size="sm"
                                variant={variant === 'progress' ? 'orange' : 'outline'}
                                className="ml-auto"
                            >
                                {variant === 'progress' ? 'Continue' : 'Review'}
                            </Button>
                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    )
}

export default LearningItemList