import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import HeaderStat from '@/components/common/HeaderStat'
import PageHeader from '@/components/common/PageHeader'
import Tabs from '@/components/common/Tabs'
import LearningItemList from '@/components/learning/LearningItemList'
import NotesTab from '@/components/learning/NotesTab'
import OverviewTab from '@/components/learning/OverviewTab'
import SavedItemsTab from '@/components/learning/SavedItemsTab'
import TestHistoryTab from '@/components/learning/TestHistoryTab'
import {
    completedItems,
    initialNotes,
    inProgressItems,
    learningStats,
    learningTabs,
} from '@/data/mockLearning'

function MyLearning() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [notes, setNotes] = useState(initialNotes)

    const requestedTab = searchParams.get('tab')
    const activeTab = learningTabs.some((tab) => tab.id === requestedTab)
        ? requestedTab
        : 'overview'

    const setActiveTab = (tabId) => setSearchParams({ tab: tabId })

    const addNote = (note) => {
        setNotes((current) => [
            { id: `note-${Date.now()}`, ...note, savedAt: new Date().toISOString() },
            ...current,
        ])
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
                    {learningStats.map(({ id, icon, value, label, tone }) => (
                        <HeaderStat key={id} icon={icon} value={value} label={label} iconClassName={tone} />
                    ))}
                </div>
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <Tabs tabs={learningTabs} activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === 'overview' && <OverviewTab notes={notes} onTabChange={setActiveTab} />}
                {activeTab === 'progress' && <LearningItemList items={inProgressItems} variant="progress" />}
                {activeTab === 'completed' && <LearningItemList items={completedItems} variant="completed" />}
                {activeTab === 'notes' && <NotesTab notes={notes} onAddNote={addNote} />}
                {activeTab === 'bookmarks' && <SavedItemsTab />}
                {activeTab === 'tests' && <TestHistoryTab />}
            </div>
        </>
    )
}

export default MyLearning