import Badge from '@/components/common/Badge'
import Card from '@/components/common/Card'
import ProgressBar from '@/components/common/ProgressBar'
import { overviewStats } from '@/data/mockAnalytics'

function OverviewStats() {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewStats.map(({ id, label, value, delta, progress, tone, icon: Icon }) => (
                <li key={id}>
                    <Card className="h-full p-5">
                        <div className="flex items-center gap-4">
                            <span className="bg-brand-purple-soft text-brand-purple flex size-14 shrink-0 items-center justify-center rounded-full">
                                <Icon className="size-7" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-ink-700 text-sm font-semibold">{label}</p>
                                <p className="text-2xl font-extrabold">{value}</p>
                            </div>
                            {delta && <Badge tone="success">↑ {delta}</Badge>}
                        </div>
                        {progress !== undefined && <ProgressBar value={progress} tone={tone} className="mt-4" />}
                    </Card>
                </li>
            ))}
        </ul>
    )
}

export default OverviewStats