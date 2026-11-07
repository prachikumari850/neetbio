import { FileText } from 'lucide-react'
import Badge from '@/components/common/Badge'
import SectionCard from '@/components/common/SectionCard'
import { accuracyTone, formatAccuracy } from '@/utils/analyticsFormat'

const VISIBLE_TESTS = 3

function RecentTestsCard({ tests, className }) {
    const recent = [...tests].reverse().slice(0, VISIBLE_TESTS)

    return (
        <SectionCard
            icon={FileText}
            title="Recent Test Performance"
            action={{ label: 'View All', to: '/my-learning?tab=tests' }}
            className={className}
        >
            {recent.length === 0 ? (
                <p className="text-ink-500 py-2 text-sm">Finish a test and it appears here.</p>
            ) : (
                <>
                    <div className="text-ink-700 mb-2 grid grid-cols-[1fr_6rem_4rem] gap-3 text-xs font-semibold">
                        <span>Test Name</span>
                        <span>Score</span>
                        <span>Accuracy</span>
                    </div>
                    <ul className="space-y-2">
                        {recent.map(({ id, title, score, maxScore, accuracy }) => (
                            <li key={id} className="grid grid-cols-[1fr_6rem_4rem] items-center gap-3 text-sm">
                                <span className="truncate font-medium">{title}</span>
                                <Badge tone={accuracyTone(accuracy)} className="justify-center">
                                    {score} / {maxScore}
                                </Badge>
                                <Badge tone={accuracyTone(accuracy)} className="justify-center">
                                    {formatAccuracy(accuracy)}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </SectionCard>
    )
}

export default RecentTestsCard