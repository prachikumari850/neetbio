import { ListFilter, RotateCcw } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import { diagramFeatures, diagramTypes, diagrams } from '@/data/mockDiagrams'

function CheckboxRow({ label, count, icon: Icon, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="accent-brand-purple size-4"
            />
            {Icon && <Icon className="text-brand-purple size-4" />}
            <span className="flex-1">{label}</span>
            <span className="text-ink-500">({count})</span>
        </label>
    )
}

function DiagramFilters({ filters, onToggle, onReset }) {
    return (
        <Card as="aside" className="space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <ListFilter className="size-5" />
                Filter Diagrams
            </h2>

            <fieldset className="border-line border-t pt-3">
                <legend className="sr-only">Diagram type</legend>
                <p className="mb-1 font-bold">Diagram Type</p>
                {diagramTypes.map(({ id, label }) => (
                    <CheckboxRow
                        key={id}
                        label={label}
                        count={diagrams.filter((diagram) => diagram.type === id).length}
                        checked={filters.types.includes(id)}
                        onChange={() => onToggle('types', id)}
                    />
                ))}
            </fieldset>

            <fieldset className="border-line border-t pt-3">
                <legend className="sr-only">Features</legend>
                <p className="mb-1 font-bold">Features</p>
                {diagramFeatures.map(({ id, label, icon }) => (
                    <CheckboxRow
                        key={id}
                        label={label}
                        icon={icon}
                        count={diagrams.filter((diagram) => diagram.features.includes(id)).length}
                        checked={filters.features.includes(id)}
                        onChange={() => onToggle('features', id)}
                    />
                ))}
            </fieldset>

            <Button variant="soft" className="w-full" onClick={onReset}>
                <RotateCcw className="size-4" />
                Reset Filters
            </Button>
        </Card>
    )
}

export default DiagramFilters