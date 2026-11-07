import { CircleCheck, Sparkles } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'

function AiInsightsCard({ insights, className }) {
    return (
        <SectionCard icon={Sparkles} title="AI Insights" className={className}>
            <ul className="space-y-3">
                {insights.map((insight) => (
                    <li key={insight} className="flex items-start gap-2 text-sm font-medium">
                        <CircleCheck className="fill-success mt-0.5 size-5 shrink-0 text-white" />
                        {insight}
                    </li>
                ))}
            </ul>
            <p className="text-ink-500 mt-3 text-xs">
                Worked out from your own results with fixed rules, not written by an AI model.
            </p>
        </SectionCard>
    )
}

export default AiInsightsCard