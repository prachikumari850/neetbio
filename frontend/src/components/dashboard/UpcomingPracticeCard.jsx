import { ClipboardList, Target } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'

function UpcomingPracticeCard() {
    return (
        <SectionCard
            icon={Target}
            title="Upcoming Practice"
            iconClassName="text-accent-pink"
            action={{ label: 'Start Now', to: '/practice?start=mock-10' }}
            className="bg-linear-to-b from-[#ffe9ef] to-white"
        >
            <div className="border-line flex items-center gap-3 rounded-2xl border bg-white/80 p-3">
                <ClipboardList className="text-accent-pink size-10 shrink-0" />
                <div>
                    <p className="font-bold">Mini Mock Test</p>
                    <p className="text-ink-700 text-xs">10 Questions • Mixed Topics</p>
                </div>
            </div>
        </SectionCard>
    )
}

export default UpcomingPracticeCard