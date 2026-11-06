import Toggle from '@/components/common/Toggle'

function ToggleRow({ icon: Icon, label, description, checked, onChange }) {
    return (
        <li className="flex items-center gap-3 py-3">
            {Icon && <Icon className="text-brand-purple size-6 shrink-0" />}
            <span className="flex-1">
                <span className="block font-semibold">{label}</span>
                {description && <span className="text-ink-500 text-xs">{description}</span>}
            </span>
            <Toggle checked={checked} onChange={onChange} label={label} />
        </li>
    )
}

export default ToggleRow