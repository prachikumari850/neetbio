import { Play } from 'lucide-react'
import ContinueLearningPanel from '@/components/common/ContinueLearningPanel'
import SectionCard from '@/components/common/SectionCard'
import { continueLearning } from '@/data/mockDashboard'
import { cx } from '@/utils/classNames'

function ContinueLearningCard({ className }) {
    return (
        <SectionCard
            icon={Play}
            title="Continue Learning"
            iconClassName="fill-brand-orange text-brand-orange"
            className={cx('bg-linear-to-b from-[#eefbe9] to-white', className)}
        >
            <ContinueLearningPanel
                diagramId={continueLearning.diagramId}
                title={continueLearning.title}
                meta={continueLearning.chapter}
                progress={continueLearning.progress}
            />
        </SectionCard>
    )
}

export default ContinueLearningCard