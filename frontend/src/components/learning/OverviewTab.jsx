import {
    Bookmark,
    BookOpen,
    ChartColumn,
    ChevronRight,
    FileText,
    Flame,
    History,
    Layers,
    Microscope,
    Play,
    Target,
    Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import ContinueLearningPanel from '@/components/common/ContinueLearningPanel'
import ProgressBar from '@/components/common/ProgressBar'
import ProgressRing from '@/components/common/ProgressRing'
import SectionCard from '@/components/common/SectionCard'
import { activityVisuals, unitVisuals } from '@/data/learningConfig'
import { useBookmarkStore } from '@/store/useBookmarkStore'
import { cx } from '@/utils/classNames'
import { formatDuration, formatRelativeTime, formatShortDate } from '@/utils/formatters'

function ProgressRows({ stats }) {
    const rows = [
        { id: 'chapters', label: 'Chapters Studied', value: `${stats.chaptersStudied} / ${stats.chaptersTotal}`, icon: BookOpen, tone: 'text-success' },
        { id: 'mastered', label: 'Questions Mastered', value: `${stats.questionsMastered} / ${stats.questionsTotal}`, icon: Target, tone: 'text-danger' },
        { id: 'tests', label: 'Tests Taken', value: stats.testsCompleted, icon: Trophy, tone: 'text-accent-pink' },
        { id: 'time', label: 'Practice Time', value: formatDuration(stats.practiceTimeSec), icon: History, tone: 'text-info' },
    ]

    return (
        <ul className="min-w-44 flex-1 space-y-2.5">
            {rows.map(({ id, label, value, icon: Icon, tone }) => (
                <li key={id} className="flex items-center gap-2 text-sm">
                    <Icon className={cx('size-5 shrink-0', tone)} />
                    <span className="flex-1">{label}</span>
                    <span className="font-bold">{value}</span>
                </li>
            ))}
        </ul>
    )
}

function OverviewTab({ summary, notes, onTabChange }) {
    const bookmarks = useBookmarkStore((state) => state.items)
    const savedDiagrams = bookmarks.filter((item) => item.type === 'diagram').slice(0, 3)
    const { stats, streak } = summary

    const achievements = [
        { id: 'chapters', value: stats.chaptersCompleted, label: 'Chapters', icon: BookOpen, tint: 'bg-[#ece3ff] text-brand-purple' },
        { id: 'tests', value: stats.testsCompleted, label: 'Tests', icon: Target, tint: 'bg-[#fff0d6] text-brand-orange' },
        { id: 'streak', value: streak.current, label: 'Day Streak', icon: Flame, tint: 'bg-[#dcf5e3] text-success' },
    ]

    return (
        <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5">
                <SectionCard
                    icon={Play}
                    title="Continue Learning"
                    iconClassName="fill-brand-orange text-brand-orange"
                    className="bg-linear-to-b from-[#eefbe9] to-white"
                >
                    <ContinueLearningPanel item={summary.continueItem} metaClassName="text-info" />
                </SectionCard>

                <SectionCard
                    icon={Layers}
                    title="My Subjects / Chapters"
                    action={{ label: 'View All', to: '/analytics' }}
                >
                    {summary.units.length === 0 ? (
                        <p className="text-ink-500 text-sm">Subjects appear once the question bank has questions.</p>
                    ) : (
                        <ul className="space-y-3">
                            {summary.units.map(({ id, label, progress }) => {
                                const { icon: Icon, tone } = unitVisuals[id] ?? { icon: BookOpen, tone: 'text-brand-purple' }

                                return (
                                    <li key={id}>
                                        <Link
                                            to="/analytics"
                                            className="hover:bg-page flex items-center gap-3 rounded-lg px-1 py-1.5"
                                        >
                                            <Icon className={cx('size-6 shrink-0', tone)} />
                                            <span className="w-36 shrink-0 text-sm font-bold">{label}</span>
                                            <ProgressBar value={progress} className="flex-1" />
                                            <span className="w-10 text-right text-sm font-bold">{progress}%</span>
                                            <ChevronRight className="size-4 shrink-0" />
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </SectionCard>
            </div>

            <div className="space-y-5">
                <SectionCard icon={ChartColumn} title="Your Learning Progress">
                    <div className="flex flex-wrap items-center gap-5">
                        <ProgressRing value={stats.progress} size={120} strokeWidth={12}>
                            <span className="text-2xl font-extrabold">{stats.progress}%</span>
                            <span className="text-ink-700 text-xs">Questions Mastered</span>
                        </ProgressRing>
                        <ProgressRows stats={stats} />
                    </div>
                </SectionCard>

                <SectionCard
                    icon={FileText}
                    title="My Notes"
                    action={{ label: 'View All', onClick: () => onTabChange('notes') }}
                >
                    {notes.items.length === 0 ? (
                        <p className="text-ink-500 text-sm">
                            {notes.status === 'loading' ? 'Loading notes...' : 'No notes yet.'}
                        </p>
                    ) : (
                        <ul className="divide-line divide-y">
                            {notes.items.slice(0, 3).map((note) => (
                                <li key={note.id} className="flex items-center gap-3 py-2 text-sm">
                                    <FileText className="text-brand-purple size-5 shrink-0" />
                                    <span className="flex-1 truncate font-medium">{note.title}</span>
                                    <span className="text-ink-500 text-xs">{formatShortDate(note.updatedAt)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </SectionCard>

                <SectionCard icon={Bookmark} title="Bookmarks" action={{ label: 'View All', to: '/bookmarks' }}>
                    {savedDiagrams.length === 0 ? (
                        <p className="text-ink-500 text-sm">No saved diagrams yet.</p>
                    ) : (
                        <ul className="grid grid-cols-3 gap-3">
                            {savedDiagrams.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        to={item.link}
                                        className="border-line flex h-full flex-col items-center gap-1 rounded-xl border bg-white p-2 text-center"
                                    >
                                        <span className="flex h-16 items-center justify-center">
                                            <AssetImage
                                                src={item.image}
                                                alt=""
                                                className="max-h-full object-contain"
                                                fallback={<Microscope className="text-brand-purple/40 size-8" />}
                                            />
                                        </span>
                                        <span className="text-xs leading-tight font-bold">{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </SectionCard>
            </div>

            <div className="space-y-5">
                <SectionCard
                    icon={Flame}
                    title="Learning Streak"
                    iconClassName="fill-brand-orange text-brand-orange"
                    className="bg-linear-to-b from-[#fff0e0] to-white"
                >
                    <p className="bg-brand-orange-soft text-brand-orange rounded-pill mx-auto w-fit px-6 py-2 text-2xl font-extrabold">
                        {streak.current} {streak.current === 1 ? 'Day' : 'Days'}
                    </p>
                    <p className="text-ink-700 mt-3 text-center text-sm">
                        {streak.current === 0
                            ? 'Study today to start a streak!'
                            : 'Keep learning daily to build a strong habit!'}
                    </p>
                </SectionCard>

                <SectionCard icon={History} title="Recent Activity">
                    {summary.activity.length === 0 ? (
                        <p className="text-ink-500 text-sm">Your tests, diagrams, notes and chats appear here.</p>
                    ) : (
                        <ul className="space-y-2.5">
                            {summary.activity.map(({ id, kind, label, at }) => {
                                const { icon: Icon, tone } = activityVisuals[kind]

                                return (
                                    <li key={id} className="flex items-center gap-2 text-sm">
                                        <Icon className={cx('size-5 shrink-0', tone)} />
                                        <span className="flex-1 truncate font-medium">{label}</span>
                                        <span className="text-ink-500 shrink-0 text-xs">{formatRelativeTime(at)}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </SectionCard>

                <SectionCard
                    icon={Trophy}
                    title="Achievements"
                    iconClassName="fill-brand-orange text-brand-orange"
                    action={{ label: 'View All', to: '/analytics' }}
                >
                    <ul className="grid grid-cols-3 gap-3">
                        {achievements.map(({ id, value, label, icon: Icon, tint }) => (
                            <li
                                key={id}
                                className={cx('flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center', tint)}
                            >
                                <Icon className="size-8" />
                                <span className="text-ink-900 text-lg leading-none font-extrabold">{value}</span>
                                <span className="text-ink-700 text-xs">{label}</span>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            </div>
        </div>
    )
}

export default OverviewTab