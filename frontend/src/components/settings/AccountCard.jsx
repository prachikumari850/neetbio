import { Calendar, Camera, GraduationCap, Mail, Pencil, Phone, Target, Trophy, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '@/components/common/Avatar'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import SelectField from '@/components/common/SelectField'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useUserStore } from '@/store/useUserStore'
import { formatLongDate, formatPhone } from '@/utils/formatters'

const LEARNING_GOALS = ['NEET 2026', 'NEET 2027', 'NEET 2028']
const TARGET_SCORES = ['550+', '600+', '650+', '700+']

function AccountCard({ onEditProfile }) {
    const user = useUserStore((state) => state.user)
    const profile = useSettingsStore((state) => state.profile)
    const updateSection = useSettingsStore((state) => state.updateSection)

    const contactDetails = [
        { icon: Mail, text: user.email },
        { icon: Phone, text: formatPhone(user.mobile) },
        { icon: Calendar, text: `Joined: ${formatLongDate(user.joinedAt)}` },
    ]

    return (
        <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <User className="text-brand-purple size-9 shrink-0" />
                    <div>
                        <h2 className="text-xl font-extrabold">Account Settings</h2>
                        <p className="text-ink-700 text-sm">Update your personal details and account information.</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onEditProfile}>
                    <Pencil className="size-4" />
                    Edit Profile
                </Button>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1fr]">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar name={user.name} src={user.avatar} className="size-24 text-3xl" />
                        <button
                            type="button"
                            aria-label="Change photo"
                            onClick={() => toast('Photo upload is not available yet.')}
                            className="border-line absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border bg-white shadow"
                        >
                            <Camera className="size-4" />
                        </button>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold">{user.fullName || user.name}</p>
                        <p className="text-ink-700 text-sm">{user.role}</p>
                        <Badge className="mt-2">
                            <GraduationCap className="mr-1 size-4" />
                            Student
                        </Badge>
                    </div>
                </div>

                <ul className="border-line space-y-3 sm:border-l sm:pl-5">
                    {contactDetails.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3 text-sm font-semibold">
                            <Icon className="text-brand-purple size-5 shrink-0" />
                            {text}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-line mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                    <Target className="text-danger size-7 shrink-0" />
                    <SelectField
                        id="learning-goal"
                        label="Learning Goal"
                        value={profile.learningGoal}
                        onChange={(learningGoal) => updateSection('profile', { learningGoal })}
                        options={LEARNING_GOALS}
                        className="flex-1"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Trophy className="text-brand-orange size-7 shrink-0" />
                    <SelectField
                        id="target-score"
                        label="Target Score"
                        value={profile.targetScore}
                        onChange={(targetScore) => updateSection('profile', { targetScore })}
                        options={TARGET_SCORES}
                        className="flex-1"
                    />
                </div>
            </div>
        </Card>
    )
}

export default AccountCard