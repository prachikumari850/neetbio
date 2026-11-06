import { Check, Laptop, Moon, Palette, Sun } from 'lucide-react'
import Card from '@/components/common/Card'
import { useSettingsStore } from '@/store/useSettingsStore'
import { cx } from '@/utils/classNames'

const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
]

function AppearanceCard() {
    const appearance = useSettingsStore((state) => state.appearance)
    const setAppearance = useSettingsStore((state) => state.setAppearance)

    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <Palette className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">Appearance</h2>
                    <p className="text-ink-700 text-sm">Choose your preferred theme.</p>
                </div>
            </div>

            <div role="radiogroup" aria-label="Theme" className="mt-4 grid grid-cols-3 gap-3">
                {themeOptions.map(({ id, label, icon: Icon }) => {
                    const isSelected = appearance === id

                    return (
                        <button
                            key={id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setAppearance(id)}
                            className={cx(
                                'relative flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-4 text-sm font-semibold',
                                isSelected ? 'border-brand-purple bg-brand-purple-soft' : 'border-line bg-white',
                            )}
                        >
                            {isSelected && (
                                <span className="bg-brand-purple absolute top-2 right-2 flex size-5 items-center justify-center rounded-full text-white">
                                    <Check className="size-3" strokeWidth={3} />
                                </span>
                            )}
                            <Icon className="size-6" />
                            {label}
                        </button>
                    )
                })}
            </div>

            <p className="text-ink-500 mt-3 text-xs">
                Your choice is saved. Only the light theme is designed so far, so Dark and System will take effect in a later update.
            </p>
        </Card>
    )
}

export default AppearanceCard