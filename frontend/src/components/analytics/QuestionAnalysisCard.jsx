import { CircleHelp } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { questionAnalysis } from '@/data/mockAnalytics'
import { chartColors } from '@/utils/chartColors'

function QuestionAnalysisCard({ className }) {
    const { total, segments } = questionAnalysis

    return (
        <SectionCard icon={CircleHelp} title="Question Analysis" className={className}>
            <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="relative size-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={segments}
                                dataKey="value"
                                innerRadius={58}
                                outerRadius={82}
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                {segments.map((segment) => (
                                    <Cell key={segment.name} fill={chartColors[segment.color]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold">{total.toLocaleString()}</span>
                        <span className="text-ink-700 text-xs">Questions</span>
                    </div>
                </div>

                <ul className="space-y-3 text-sm">
                    {segments.map(({ name, value, percent, color }) => (
                        <li key={name} className="flex items-center gap-3">
                            <span className="size-3 rounded" style={{ backgroundColor: chartColors[color] }} />
                            <span className="w-28 font-medium">{name}</span>
                            <span className="font-bold">
                                {value.toLocaleString()} ({percent}%)
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </SectionCard>
    )
}

export default QuestionAnalysisCard