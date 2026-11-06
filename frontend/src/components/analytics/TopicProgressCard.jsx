import { Target } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import { topicProgress } from '@/data/mockAnalytics'

function getTone(progress) {
    if (progress >= 75) {
        return 'success'
    }

    return progress >= 55 ? 'orange' : 'purple'
}

function TopicProgressCard() {
    return (
        <SectionCard icon={Target} title="Topic Wise Progress" iconClassName="text-danger">
            <ul className="space-y-4">
                {topicProgress.map(({ id, topic, progress }) => (
                    <li key={id} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 text-sm sm:grid-cols-[14rem_1fr_3rem]">
                        <span className="font-semibold">{topic}</span>
                        <ProgressBar value={progress} tone={getTone(progress)} />
                        <span className="text-right font-bold">{progress}%</span>
                    </li>
                ))}
            </ul>
        </SectionCard>
    )
}

export default TopicProgressCard