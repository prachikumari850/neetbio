import { ShieldCheck } from 'lucide-react'
import Card from '@/components/common/Card'
import ToggleRow from '@/components/settings/ToggleRow'
import { useSettingsStore } from '@/store/useSettingsStore'

function PrivacyCard() {
    const privacy = useSettingsStore((state) => state.privacy)
    const updateSection = useSettingsStore((state) => state.updateSection)

    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <ShieldCheck className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">Privacy & Security</h2>
                    <p className="text-ink-700 text-sm">Control how your data is used.</p>
                </div>
            </div>

            <ul className="divide-line mt-2 divide-y">
                <ToggleRow
                    label="Share anonymous usage analytics"
                    description="Helps improve NEETBIO."
                    checked={privacy.shareAnalytics}
                    onChange={(checked) => updateSection('privacy', { shareAnalytics: checked })}
                />
                <ToggleRow
                    label="Two-step verification"
                    description="Preference is saved now and enforced once accounts are on the backend."
                    checked={privacy.twoStep}
                    onChange={(checked) => updateSection('privacy', { twoStep: checked })}
                />
            </ul>
        </Card>
    )
}

export default PrivacyCard