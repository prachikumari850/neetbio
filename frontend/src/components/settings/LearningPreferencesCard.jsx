import { BookOpen } from 'lucide-react'
import Card from '@/components/common/Card'
import SelectField from '@/components/common/SelectField'
import { useSettingsStore } from '@/store/useSettingsStore'

const preferenceFields = [
    { key: 'classLevel', label: 'Class Level', options: ['NEET (Class 11–12)', 'Class 11', 'Class 12'] },
    { key: 'preferredMode', label: 'Preferred Mode', options: ['Text + Visual', 'Text', 'Visual'] },
    { key: 'difficulty', label: 'Difficulty Level', options: ['Mixed', 'Easy', 'Medium', 'Hard'] },
]

function LearningPreferencesCard() {
    const learning = useSettingsStore((state) => state.learning)
    const updateSection = useSettingsStore((state) => state.updateSection)

    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <BookOpen className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">Learning Preferences</h2>
                    <p className="text-ink-700 text-sm">Personalize your learning experience.</p>
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {preferenceFields.map(({ key, label, options }) => (
                    <SelectField
                        key={key}
                        id={`pref-${key}`}
                        label={label}
                        value={learning[key]}
                        onChange={(value) => updateSection('learning', { [key]: value })}
                        options={options}
                    />
                ))}
            </div>
        </Card>
    )
}

export default LearningPreferencesCard