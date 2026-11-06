import { useState } from 'react'
import {
    Bell,
    BookOpen,
    Download,
    Info,
    Languages,
    Palette,
    Settings as SettingsIcon,
    ShieldCheck,
    User,
} from 'lucide-react'
import Card from '@/components/common/Card'
import FeatureChecklist from '@/components/common/FeatureChecklist'
import PageHeader from '@/components/common/PageHeader'
import AboutCard from '@/components/settings/AboutCard'
import AccountCard from '@/components/settings/AccountCard'
import AppearanceCard from '@/components/settings/AppearanceCard'
import EditProfileModal from '@/components/settings/EditProfileModal'
import LanguageCard from '@/components/settings/LanguageCard'
import LearningPreferencesCard from '@/components/settings/LearningPreferencesCard'
import NotificationsCard from '@/components/settings/NotificationsCard'
import PrivacyCard from '@/components/settings/PrivacyCard'
import StorageCard from '@/components/settings/StorageCard'
import { cx } from '@/utils/classNames'

const sections = [
    { id: 'account', label: 'Account Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'learning', label: 'Learning Preferences', icon: BookOpen },
    { id: 'storage', label: 'Downloads & Storage', icon: Download },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
    { id: 'language', label: 'Language', icon: Languages },
    { id: 'about', label: 'About', icon: Info },
]

function Settings() {
    const [activeSection, setActiveSection] = useState('account')
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    return (
        <>
            <PageHeader
                icon={SettingsIcon}
                title="Settings"
                subtitle="Manage your account, preferences and learning experience."
            >
                <FeatureChecklist
                    items={['Customize your learning', 'Keep your account secure', 'Personalize your experience']}
                />
            </PageHeader>

            <div className="grid gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[16rem_1fr] lg:px-8">
                <Card as="nav" aria-label="Settings sections" className="h-fit p-3">
                    <ul className="space-y-1">
                        {sections.map(({ id, label, icon: Icon }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    aria-current={activeSection === id}
                                    onClick={() => setActiveSection(id)}
                                    className={cx(
                                        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold',
                                        activeSection === id ? 'bg-brand-purple-soft text-brand-purple' : 'hover:bg-page',
                                    )}
                                >
                                    <Icon className="size-5 shrink-0" />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>

                <div className="space-y-5">
                    {activeSection === 'account' && (
                        <>
                            <AccountCard onEditProfile={() => setIsProfileOpen(true)} />
                            <div className="grid gap-5 xl:grid-cols-2">
                                <NotificationsCard />
                                <div className="space-y-5">
                                    <AppearanceCard />
                                    <LearningPreferencesCard />
                                </div>
                            </div>
                        </>
                    )}
                    {activeSection === 'notifications' && <NotificationsCard />}
                    {activeSection === 'appearance' && <AppearanceCard />}
                    {activeSection === 'learning' && <LearningPreferencesCard />}
                    {activeSection === 'storage' && <StorageCard />}
                    {activeSection === 'privacy' && <PrivacyCard />}
                    {activeSection === 'language' && <LanguageCard />}
                    {activeSection === 'about' && <AboutCard />}
                </div>
            </div>

            <EditProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    )
}

export default Settings