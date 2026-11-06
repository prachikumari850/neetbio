import { Trophy } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { testTrend } from '@/data/mockAnalytics'
import { chartColors } from '@/utils/chartColors'

const axisTick = { fontSize: 12, fill: chartColors.muted }

function TestTrendCard() {
    return (
        <SectionCard icon={Trophy} title="Accuracy Across Recent Tests" iconClassName="text-brand-orange">
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={testTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.line} vertical={false} />
                    <XAxis dataKey="test" tick={axisTick} tickLine={false} axisLine={false} />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={axisTick}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                    <Bar dataKey="accuracy" fill={chartColors.info} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </SectionCard>
    )
}

export default TestTrendCard