import { ChevronRight, History, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from '@/components/common/SectionCard'
import { practiceSubjects } from '@/data/mockPractice'
import { useTestStore } from '@/store/useTestStore'

const VISIBLE_RESULTS = 3

function RecentResultsCard() {
    const results = useTestStore((state) => state.results)

    return (
        <SectionCard
            icon={History}
            title="Recent Test Results"
            iconClassName="text-brand-purple"
            action={{ label: 'View All', to: '/my-learning?tab=tests' }}
        >
            <ul className="divide-line divide-y">
                {results.slice(0, VISIBLE_RESULTS).map((result) => {
                    const Icon = practiceSubjects.find((subject) => subject.id === result.subjectId)?.icon ?? Trophy

                    return (
                        <li key={result.id}>
                            <Link
                                to="/my-learning?tab=tests"
                                className="hover:bg-page flex items-center gap-3 rounded-lg px-1 py-2.5"
                            >
                                <span className="bg-success-soft text-success flex size-10 shrink-0 items-center justify-center rounded-xl">
                                    <Icon className="size-5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-bold">{result.title}</span>
                                    <span className="text-ink-500 text-xs">
                                        {result.total} Questions | {result.minutes} Min
                                    </span>
                                </span>
                                <span className="text-right text-sm font-bold">
                                    {result.correct} / {result.total}
                                    <span className="text-success block text-xs">({result.accuracy}%)</span>
                                </span>
                                <ChevronRight className="size-5 shrink-0" />
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </SectionCard>
    )
}

export default RecentResultsCard