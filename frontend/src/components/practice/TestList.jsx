import { Play } from 'lucide-react'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'

function TestList({
    tests,
    onStart,
    emptyTitle = 'No tests available yet',
    emptyDescription,
}) {
    if (tests.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />
    }

    return (
        <ul className="space-y-3">
            {tests.map((test) => (
                <li
                    key={test.id}
                    className="border-line flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-3"
                >
                    <span className="bg-brand-orange-soft text-brand-orange flex size-12 shrink-0 items-center justify-center rounded-xl">
                        <test.icon className="size-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold">{test.title}</p>
                        <p className="text-ink-700 text-xs">{test.meta}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onStart(test.request)}>
                        <Play className="size-4" />
                        Start Test
                    </Button>
                </li>
            ))}
        </ul>
    )
}

export default TestList