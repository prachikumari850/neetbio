import { Languages } from 'lucide-react'
import Card from '@/components/common/Card'
import SelectField from '@/components/common/SelectField'
import { useSettingsStore } from '@/store/useSettingsStore'

const LANGUAGES = ['English', 'हिन्दी (Hindi)']

function LanguageCard() {
    const language = useSettingsStore((state) => state.language)
    const setLanguage = useSettingsStore((state) => state.setLanguage)

    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <Languages className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">Language</h2>
                    <p className="text-ink-700 text-sm">Choose your preferred language.</p>
                </div>
            </div>

            <SelectField
                id="language"
                value={language}
                onChange={setLanguage}
                options={LANGUAGES}
                className="mt-4 max-w-xs"
            />
            <p className="text-ink-500 mt-2 text-xs">
                Your choice is saved. The interface is English-only for now.
            </p>
        </Card>
    )
}

export default LanguageCard