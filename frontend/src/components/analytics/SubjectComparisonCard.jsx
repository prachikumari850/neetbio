import { Layers } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionCard from '@/components/common/SectionCard'
import { chartColors } from '@/utils/chartColors'

const axisTick = { fontSize: 12, fill: chartColors.muted }

function SubjectComparisonCard({ areas }) {
    const points = areas.map((area) => ({
        label: area.label,
        progress: area.progress,
        accuracy: area.accuracy ?? undefined,
    }))

    return (
        <SectionCard icon={Layers} title="Progress vs Accuracy by Subject">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.line} vertical={false} />
                    <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} interval={0} />
                    <YAxis domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="progress" name="Progress" fill={chartColors.success} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="accuracy" name="Accuracy" fill={chartColors.purple} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </SectionCard>
    )
}

export default SubjectComparisonCard