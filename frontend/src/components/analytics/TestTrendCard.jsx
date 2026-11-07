import { Trophy } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { chartColors } from '@/utils/chartColors'

const axisTick = { fontSize: 12, fill: chartColors.muted }

function TestTrendCard({ tests }) {
    const points = tests.map((test, index) => ({
        label: `Test ${index + 1}`,
        accuracy: test.accuracy,
    }))

    return (
        <SectionCard icon={Trophy} title="Score Accuracy Across Recent Tests" iconClassName="text-brand-orange">
            {points.length === 0 ? (
                <p className="text-ink-500 py-16 text-center text-sm">Finish a test to see it here.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.line} vertical={false} />
                            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                                tick={axisTick}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip formatter={(value) => [`${value}%`, 'Score accuracy']} />
                            <Bar dataKey="accuracy" fill={chartColors.info} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-ink-500 text-center text-xs">
                        Correct answers out of all questions in the test, oldest on the left.
                    </p>
                </>
            )}
        </SectionCard>
    )
}

export default TestTrendCard