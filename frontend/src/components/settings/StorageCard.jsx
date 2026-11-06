import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ToggleRow from '@/components/settings/ToggleRow'
import { useSettingsStore } from '@/store/useSettingsStore'

function StorageCard() {
    const storage = useSettingsStore((state) => state.storage)
    const updateSection = useSettingsStore((state) => state.updateSection)

    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <Download className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">Downloads & Storage</h2>
                    <p className="text-ink-700 text-sm">Manage offline content on this device.</p>
                </div>
            </div>

            <ul className="mt-2">
                <ToggleRow
                    label="Save diagrams for offline use"
                    description="Offline downloads work once the backend is connected."
                    checked={storage.offlineDiagrams}
                    onChange={(checked) => updateSection('storage', { offlineDiagrams: checked })}
                />
            </ul>

            <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => toast.success('Cached data cleared (simulated).')}
            >
                Clear cached data
            </Button>
        </Card>
    )
}

export default StorageCard