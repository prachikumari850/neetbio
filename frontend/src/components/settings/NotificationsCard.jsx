import { Bell, Calendar, FlaskConical, Megaphone, Star } from 'lucide-react'
import Card from '@/components/common/Card'
import ToggleRow from '@/components/settings/ToggleRow'
import { useSettingsStore } from '@/store/useSettingsStore'

const notificationOptions = [
    { key: 'studyReminders', label: 'Study reminders', icon: Megaphone },
    { key: 'newContent', label: 'New diagrams & content', icon: FlaskConical },
    { key: 'testResults', label: 'Test & result notifications', icon: Calendar },
    { key: 'achievements', label: 'Streak & achievement alerts', icon: Star },
]

function NotificationsCard() {
    const notifications = useSettingsStore((state) => state.notifications)
    const updateSection = useSettingsStore((state) => state.updateSection)

    return (
        <Card className="p-5">
            <div className="flex items-start gap-3">
                <Bell className="text-brand-purple size-8 shrink-0" />
                <div>
                    <h2 className="text-lg font-extrabold">Notifications</h2>
                    <p className="text-ink-700 text-sm">Choose what updates you want to receive.</p>
                </div>
            </div>

            <ul className="divide-line mt-2 divide-y">
                {notificationOptions.map(({ key, label, icon }) => (
                    <ToggleRow
                        key={key}
                        icon={icon}
                        label={label}
                        checked={notifications[key]}
                        onChange={(checked) => updateSection('notifications', { [key]: checked })}
                    />
                ))}
            </ul>
        </Card>
    )
}

export default NotificationsCard