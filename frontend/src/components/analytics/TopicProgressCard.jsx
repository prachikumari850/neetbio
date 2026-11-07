import { Target } from 'lucide-react'
import Badge from '@/components/common/Badge'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import { accuracyTone, formatAccuracy } from '@/utils/analyticsFormat'
import { capitalize } from '@/utils/formatters'

function getTone(progress) {
    if (progress >= 75) {
        return 'success'
    }

    return progress >= 40 ? 'orange' : 'purple'
}

function TopicProgressCard({ chapters }) {
    return (
        <SectionCard icon={Target} title="Topic Wise Progress" iconClassName="text-danger">
            {chapters.length === 0 ? (
                <p className="text-ink-500 py-6 text-center text-sm">
                    Chapters appear once the question bank has reviewed questions.
                </p>
            ) : (
                <ul className="max-h-[32rem] space-y-5 overflow-y-auto pr-1">
                    {chapters.map((chapter) => (
                        <li key={chapter.name}>
                            <div className="grid grid-cols-[1fr_8rem_3rem_3.5rem] items-center gap-3 text-sm">
                                <span className="min-w-0">
                                    <span className="block truncate font-extrabold">{chapter.name}</span>
                                    <span className="text-ink-500 text-xs">
                                        {capitalize(chapter.subject)} • {chapter.attempted === 0 ? 'Not started' : `${chapter.attempted} answers`}
                                    </span>
                                </span>
                                <ProgressBar value={chapter.progress} tone={getTone(chapter.progress)} />
                                <span className="text-right font-bold">{chapter.progress}%</span>
                                <Badge tone={accuracyTone(chapter.accuracy)} className="justify-center">
                                    {formatAccuracy(chapter.accuracy)}
                                </Badge>
                            </div>

                            <ul className="border-line mt-2 ml-3 space-y-1.5 border-l pl-4">
                                {chapter.topics.map((topic) => (
                                    <li
                                        key={topic.topic}
                                        className="text-ink-700 grid grid-cols-[1fr_3rem_3.5rem] items-center gap-3 text-xs"
                                    >
                                        <span className="truncate">{topic.topic}</span>
                                        <span className="text-right font-semibold">{topic.progress}%</span>
                                        <span className="text-right">{formatAccuracy(topic.accuracy)}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </SectionCard>
    )
}

export default TopicProgressCard