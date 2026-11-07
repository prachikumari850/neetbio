import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { chartColors } from '@/utils/chartColors'
import { formatShortDate } from '@/utils/formatters'

const axisTick = { fontSize: 12, fill: chartColors.muted }

function PerformanceTrendCard({ weeks, className }) {
    const points = weeks.map((week) => ({
        week: formatShortDate(`${week.weekStart}T00:00:00`),
        score: week.accuracy,
    }))

    return (
        <SectionCard icon={TrendingUp} title="Overall Performance Trend" className={className}>
            {points.length === 0 ? (
                <p className="text-ink-500 py-16 text-center text-sm">
                    Complete a test to see your weekly accuracy trend.
                </p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={230}>
                        <AreaChart data={points} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
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
                            <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
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
                    <p className="text-ink-500 text-center text-xs">Accuracy per week (weeks start on Monday)</p>
                </>
            )}
        </SectionCard>
    )
}

export default PerformanceTrendCard