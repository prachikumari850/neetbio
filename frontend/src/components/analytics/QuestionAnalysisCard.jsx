import { CircleHelp } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { chartColors } from '@/utils/chartColors'

function QuestionAnalysisCard({ analysis, className }) {
    const segments = [
        { name: 'Correct', value: analysis.correct, color: 'success' },
        { name: 'Incorrect', value: analysis.incorrect, color: 'danger' },
        { name: 'Not Attempted', value: analysis.skipped, color: 'muted' },
    ]
    const chartData = analysis.total === 0 ? [{ name: 'No data', value: 1, color: 'line' }] : segments

    return (
        <SectionCard icon={CircleHelp} title="Question Analysis" className={className}>
            <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="relative size-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                innerRadius={58}
                                outerRadius={82}
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                {chartData.map((segment) => (
                                    <Cell key={segment.name} fill={chartColors[segment.color]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold">{analysis.total.toLocaleString()}</span>
                        <span className="text-ink-700 text-xs">Questions</span>
                    </div>
                </div>

                <ul className="space-y-3 text-sm">
                    {segments.map(({ name, value, color }) => (
                        <li key={name} className="flex items-center gap-3">
                            <span className="size-3 rounded" style={{ backgroundColor: chartColors[color] }} />
                            <span className="w-28 font-medium">{name}</span>
                            <span className="font-bold">
                                {value.toLocaleString()} (
                                {analysis.total ? Math.round((value / analysis.total) * 100) : 0}%)
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </SectionCard>
    )
}

export default QuestionAnalysisCard