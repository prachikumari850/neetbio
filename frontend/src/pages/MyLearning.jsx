import { useEffect } from 'react'
import { BookOpen, Clock, Target } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import HeaderStat from '@/components/common/HeaderStat'
import PageHeader from '@/components/common/PageHeader'
import SummaryGate from '@/components/common/SummaryGate'
import Tabs from '@/components/common/Tabs'
import LearningItemList from '@/components/learning/LearningItemList'
import NotesTab from '@/components/learning/NotesTab'
import OverviewTab from '@/components/learning/OverviewTab'
import SavedItemsTab from '@/components/learning/SavedItemsTab'
import TestHistoryTab from '@/components/learning/TestHistoryTab'
import { learningTabs } from '@/data/learningConfig'
import { useNotes } from '@/hooks/useNotes'
import { useLearningStore } from '@/store/useLearningStore'
import { formatDuration } from '@/utils/formatters'

function MyLearning() {
    const [searchParams, setSearchParams] = useSearchParams()
    const notes = useNotes()
    const loadSummary = useLearningStore((state) => state.load)
    const stats = useLearningStore((state) => state.summary?.stats)

    useEffect(() => {
        loadSummary()
    }, [loadSummary])

    const requestedTab = searchParams.get('tab')
    const activeTab = learningTabs.some((tab) => tab.id === requestedTab)
        ? requestedTab
        : 'overview'

    const setActiveTab = (tabId) => setSearchParams({ tab: tabId })

    const headerStats = [
        { id: 'chapters', icon: BookOpen, value: stats?.chaptersStudied ?? '—', label: 'Chapters Studied', tone: 'text-brand-purple' },
        { id: 'progress', icon: Target, value: stats ? `${stats.progress}%` : '—', label: 'Overall Progress', tone: 'text-danger' },
        { id: 'time', icon: Clock, value: stats ? formatDuration(stats.practiceTimeSec) : '—', label: 'Practice Time', tone: 'text-info' },
    ]

    const renderTab = (summary) => {
        if (activeTab === 'overview') {
            return <OverviewTab summary={summary} notes={notes} onTabChange={setActiveTab} />
        }

        if (activeTab === 'progress') {
            return <LearningItemList items={summary.inProgress} variant="progress" />
        }

        return <LearningItemList items={summary.completed} variant="completed" />
    }

    return (
        <>
            <PageHeader
                icon={BookOpen}
                title="My"
                highlight="Learning"
                subtitle="Track, continue and manage your Biology learning journey."
            >
                <div className="flex flex-wrap gap-3">
                    {headerStats.map(({ id, icon, value, label, tone }) => (
                        <HeaderStat key={id} icon={icon} value={value} label={label} iconClassName={tone} />
                    ))}
                </div>
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <Tabs tabs={learningTabs} activeTab={activeTab} onChange={setActiveTab} />

                {['overview', 'progress', 'completed'].includes(activeTab) && (
                    <SummaryGate>{renderTab}</SummaryGate>
                )}
                {activeTab === 'notes' && <NotesTab notes={notes} />}
                {activeTab === 'bookmarks' && <SavedItemsTab />}
                {activeTab === 'tests' && <TestHistoryTab />}
            </div>
        </>
    )
}

export default MyLearning