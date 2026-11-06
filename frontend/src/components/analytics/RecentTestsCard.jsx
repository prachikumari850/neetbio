import { FileText } from 'lucide-react'
import Badge from '@/components/common/Badge'
import SectionCard from '@/components/common/SectionCard'
import { recentTests } from '@/data/mockAnalytics'

function RecentTestsCard({ className }) {
    return (
        <SectionCard
            icon={FileText}
            title="Recent Test Performance"
            action={{ label: 'View All', to: '/my-learning?tab=tests' }}
            className={className}
        >
            <div className="text-ink-700 mb-2 grid grid-cols-[1fr_6rem_4rem] gap-3 text-xs font-semibold">
                <span>Test Name</span>
                <span>Score</span>
                <span>Accuracy</span>
            </div>
            <ul className="space-y-2">
                {recentTests.map(({ id, name, score, accuracy }) => (
                    <li key={id} className="grid grid-cols-[1fr_6rem_4rem] items-center gap-3 text-sm">
                        <span className="font-medium">{name}</span>
                        <Badge tone="success" className="justify-center">
                            {score}
                        </Badge>
                        <Badge tone="success" className="justify-center">
                            {accuracy}%
                        </Badge>
                    </li>
                ))}
            </ul>
        </SectionCard>
    )
}

export default RecentTestsCard