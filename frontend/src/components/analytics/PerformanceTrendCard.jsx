import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { performanceTrend } from '@/data/mockAnalytics'
import { chartColors } from '@/utils/chartColors'

const axisTick = { fontSize: 12, fill: chartColors.muted }

function PerformanceTrendCard({ className }) {
    return (
        <SectionCard icon={TrendingUp} title="Overall Performance Trend" className={className}>
            <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={performanceTrend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.line} vertical={false} />
                    <XAxis dataKey="week" tick={axisTick} tickLine={false} axisLine={false} />
                    <YAxis
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={axisTick}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke={chartColors.purple}
                        strokeWidth={2.5}
                        fill={chartColors.purple}
                        fillOpacity={0.15}
                        dot={{ r: 5, fill: '#fff', stroke: chartColors.purple, strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </SectionCard>
    )
}

export default PerformanceTrendCard