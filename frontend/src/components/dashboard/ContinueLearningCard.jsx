import { Play } from 'lucide-react'
import ContinueLearningPanel from '@/components/common/ContinueLearningPanel'
import SectionCard from '@/components/common/SectionCard'
import SummaryGate from '@/components/common/SummaryGate'
import { cx } from '@/utils/classNames'

function ContinueLearningCard({ className }) {
    return (
        <SectionCard
            icon={Play}
            title="Continue Learning"
            iconClassName="fill-brand-orange text-brand-orange"
            className={cx('bg-linear-to-b from-[#eefbe9] to-white', className)}
        >
            <SummaryGate>
                {(summary) => <ContinueLearningPanel item={summary.continueItem} />}
            </SummaryGate>
        </SectionCard>
    )
}

export default ContinueLearningCard