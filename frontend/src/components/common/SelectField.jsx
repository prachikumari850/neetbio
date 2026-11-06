import { ChevronDown } from 'lucide-react'

function normalizeOption(option) {
    return typeof option === 'string' ? { value: option, label: option } : option
}

function SelectField({ id, label, icon: Icon, value, onChange, options, className }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="mb-1 flex items-center gap-2 text-sm font-bold">
                    {Icon && <Icon className="text-ink-700 size-4" />}
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="rounded-pill border-line shadow-card w-full appearance-none border bg-white py-2.5 pr-10 pl-4 text-sm font-semibold outline-none"
                >
                    {options.map((option) => {
                        const { value: optionValue, label: optionLabel } = normalizeOption(option)

                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        )
                    })}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            </div>
        </div>
    )
}

export default SelectField