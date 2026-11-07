import { CircleAlert, CircleCheck, Target, Trophy } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'
import { formatAccuracy } from '@/utils/analyticsFormat'

function StrengthsCard({ strengths, weaknesses, minSample, className }) {
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
                    {strengths.length === 0 ? (
                        <p className="text-ink-700 text-xs">
                            Answer at least {minSample} questions in a chapter with 75% accuracy or better.
                        </p>
                    ) : (
                        <ul className="space-y-2 text-sm font-medium">
                            {strengths.map(({ name, accuracy }) => (
                                <li key={name} className="flex items-center gap-2">
                                    <CircleCheck className="fill-success size-5 shrink-0 text-white" />
                                    <span className="flex-1">{name}</span>
                                    <span className="text-xs font-bold">{formatAccuracy(accuracy)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-danger-soft rounded-2xl p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-extrabold">
                        Areas to Improve
                        <CircleAlert className="text-danger size-5" />
                    </h3>
                    {weaknesses.length === 0 ? (
                        <p className="text-ink-700 text-xs">
                            Chapters with {minSample}+ answers and accuracy below 60% appear here.
                        </p>
                    ) : (
                        <ul className="space-y-2 text-sm font-medium">
                            {weaknesses.map(({ name, accuracy }) => (
                                <li key={name} className="flex items-center gap-2">
                                    <Target className="text-danger size-5 shrink-0" />
                                    <span className="flex-1">{name}</span>
                                    <span className="text-xs font-bold">{formatAccuracy(accuracy)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </SectionCard>
    )
}

export default StrengthsCard