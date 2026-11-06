import { CircleCheck } from 'lucide-react'

function FeatureChecklist({ items }) {
    return (
        <ul className="shadow-card space-y-2 rounded-2xl bg-white/85 px-5 py-4">
            {items.map((item) => (
                <li
                    key={item}
                    className="text-ink-900 flex items-center gap-2 text-sm font-medium"
                >
                    <CircleCheck className="fill-success size-5 shrink-0 text-white" />
                    {item}
                </li>
            ))}
        </ul>
    )
}

export default FeatureChecklist