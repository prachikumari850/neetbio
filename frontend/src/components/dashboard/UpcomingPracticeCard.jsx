import { ClipboardList, Target } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'
import { useLearningStore } from '@/store/useLearningStore'
import { chapterStartPath } from '@/utils/analyticsFormat'

const FALLBACK_START_PATH = '/practice?start=mock-10'

function UpcomingPracticeCard() {
    const practice = useLearningStore((state) => state.summary?.recommendations.practice)

    return (
        <SectionCard
            icon={Target}
            title="Upcoming Practice"
            iconClassName="text-accent-pink"
            action={{
                label: 'Start Now',
                to: practice ? chapterStartPath(practice.chapter) : FALLBACK_START_PATH,
            }}
            className="bg-linear-to-b from-[#ffe9ef] to-white"
        >
            <div className="border-line flex items-center gap-3 rounded-2xl border bg-white/80 p-3">
                <ClipboardList className="text-accent-pink size-10 shrink-0" />
                <div>
                    <p className="font-bold">{practice ? `${practice.chapter} – Chapter Test` : 'Mini Mock Test'}</p>
                    <p className="text-ink-700 text-xs">
                        {practice ? practice.reason : '10 Questions • Mixed Topics'}
                    </p>
                </div>
            </div>
        </SectionCard>
    )
}

export default UpcomingPracticeCard