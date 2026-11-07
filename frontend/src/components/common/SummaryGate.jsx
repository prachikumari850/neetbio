import Button from '@/components/common/Button'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useLearningStore } from '@/store/useLearningStore'

function SummaryGate({ children }) {
    const summary = useLearningStore((state) => state.summary)
    const status = useLearningStore((state) => state.status)
    const load = useLearningStore((state) => state.load)

    if (summary) {
        return children(summary)
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
                <p className="text-ink-500 text-sm">Couldn’t load your progress.</p>
                <Button variant="soft" size="sm" onClick={() => load()}>
                    Try again
                </Button>
            </div>
        )
    }

    return <LoadingSpinner label="Loading..." />
}

export default SummaryGate