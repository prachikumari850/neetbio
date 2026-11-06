import { CircleAlert, CircleCheck, Target, Trophy } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'
import { strengths, weaknesses } from '@/data/mockAnalytics'

function StrengthsCard({ className }) {
    return (
        <SectionCard
            icon={Trophy}
            title="Strengths & Weaknesses"
            iconClassName="fill-brand-orange text-brand-orange"
            className={className}
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-success-soft rounded-2xl p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-extrabold">
                        Your Strengths
                        <CircleCheck className="fill-success size-5 text-white" />
                    </h3>
                    <ul className="space-y-2 text-sm font-medium">
                        {strengths.map((topic) => (
                            <li key={topic} className="flex items-center gap-2">
                                <CircleCheck className="fill-success size-5 shrink-0 text-white" />
                                {topic}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-danger-soft rounded-2xl p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-extrabold">
                        Areas to Improve
                        <CircleAlert className="text-danger size-5" />
                    </h3>
                    <ul className="space-y-2 text-sm font-medium">
                        {weaknesses.map((topic) => (
                            <li key={topic} className="flex items-center gap-2">
                                <Target className="text-danger size-5 shrink-0" />
                                {topic}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </SectionCard>
    )
}

export default StrengthsCard