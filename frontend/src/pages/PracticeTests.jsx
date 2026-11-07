import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, ClipboardList, Layers, Star, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import HeaderStat from '@/components/common/HeaderStat'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import PageHeader from '@/components/common/PageHeader'
import SectionCard from '@/components/common/SectionCard'
import Tabs from '@/components/common/Tabs'
import CustomTestForm from '@/components/practice/CustomTestForm'
import RecentResultsCard from '@/components/practice/RecentResultsCard'
import SubjectModeGrid from '@/components/practice/SubjectModeGrid'
import TestList from '@/components/practice/TestList'
import TestProgressCard from '@/components/practice/TestProgressCard'
import TestResults from '@/components/practice/TestResults'
import TestRunner from '@/components/practice/TestRunner'
import { practiceTabs } from '@/data/mockPractice'
import { usePracticeCatalog } from '@/hooks/usePracticeCatalog'
import { startAttempt, submitAttempt } from '@/services/practiceService'
import { useTestStore } from '@/store/useTestStore'
import {
    buildChapterTests,
    buildMockTests,
    buildPyqTests,
    pickRecommended,
} from '@/utils/practiceTests'

function parseStartParam(value) {
    if (value?.startsWith('mock-') && Number.isInteger(Number(value.slice(5)))) {
        return { mode: 'mock', count: Number(value.slice(5)) }
    }

    if (value?.startsWith('area-')) {
        return { mode: 'area', area: value.slice(5) }
    }

    return null
}

function PracticeTests() {
    const [searchParams, setSearchParams] = useSearchParams()
    const loadResults = useTestStore((state) => state.load)
    const catalog = usePracticeCatalog()
    const [activeTest, setActiveTest] = useState(null)
    const [outcome, setOutcome] = useState(null)
    const startingRef = useRef(false)
    const submittingRef = useRef(false)
    const autoStartedRef = useRef(null)

    const startParam = searchParams.get('start')
    const requestedTab = searchParams.get('tab')
    const activeTab = practiceTabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'practice'

    const setActiveTab = (tabId) => setSearchParams({ tab: tabId })

    const beginTest = useCallback(async (request) => {
        if (startingRef.current) {
            return
        }

        startingRef.current = true

        try {
            const attempt = await startAttempt(request)
            setOutcome(null)
            setActiveTest({ ...attempt, request })
        } catch (error) {
            toast.error(error.message)
        } finally {
            startingRef.current = false
        }
    }, [])

    useEffect(() => {
        if (!startParam) {
            autoStartedRef.current = null
            return
        }

        if (autoStartedRef.current === startParam) {
            return
        }

        autoStartedRef.current = startParam
        const request = parseStartParam(startParam)

        if (request) {
            queueMicrotask(() => {
                if (autoStartedRef.current === startParam) {
                    void beginTest(request)
                }
            })
        } else {
            toast.error('That test is not available.')
        }
    }, [startParam, beginTest])

    const handleSubmit = async ({ answers }) => {
        if (submittingRef.current) {
            return
        }

        submittingRef.current = true

        try {
            setOutcome(await submitAttempt(activeTest.id, answers))
            loadResults()
        } catch (error) {
            toast.error(`${error.message} Press Submit Test to try again.`)
        } finally {
            submittingRef.current = false
        }
    }

    const leaveTest = () => {
        setActiveTest(null)
        setOutcome(null)
        setSearchParams({ tab: activeTab })
    }

    if (activeTest && outcome) {
        return (
            <TestResults
                test={activeTest}
                evaluation={outcome.evaluation}
                timeTakenSec={outcome.timeTakenSec}
                onRetry={() => beginTest(activeTest.request)}
                onBack={leaveTest}
            />
        )
    }

    if (activeTest) {
        return <TestRunner key={activeTest.id} test={activeTest} onSubmit={handleSubmit} onExit={leaveTest} />
    }

    const data = catalog.data
    const mockTests = data ? buildMockTests(data.mockSizes) : []
    const chapterTests = data ? buildChapterTests(data.chapters) : []
    const pyqTests = data ? buildPyqTests(data.pyqYears) : []
    const areaCounts = Object.fromEntries((data?.areas ?? []).map((area) => [area.id, area.count]))

    const headerStats = [
        { icon: Target, value: data?.totals.questions ?? 0, label: 'Practice Qs', tone: 'text-danger' },
        { icon: Layers, value: chapterTests.length, label: 'Chapter Tests', tone: 'text-brand-purple' },
        { icon: ClipboardList, value: mockTests.length, label: 'Full Mock Tests', tone: 'text-accent-pink' },
    ]

    const renderTabContent = () => {
        if (activeTab === 'practice') {
            return (
                <>
                    <SectionCard icon={Target} title="Choose Practice Mode" iconClassName="text-danger">
                        <SubjectModeGrid
                            counts={areaCounts}
                            onStart={(subject) => beginTest({ mode: 'area', area: subject.id })}
                        />
                    </SectionCard>

                    <SectionCard icon={Star} title="Recommended for You" iconClassName="fill-brand-orange text-brand-orange">
                        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
                            <TestList
                                tests={pickRecommended(mockTests, chapterTests)}
                                onStart={beginTest}
                                emptyTitle="Recommendations will appear as questions are added"
                            />
                            <Card className="flex flex-col items-center gap-2 bg-linear-to-b from-[#ffe9ef] to-white p-5 text-center">
                                <ClipboardList className="text-accent-pink size-12" />
                                <h3 className="text-lg leading-tight font-extrabold">Create Your Custom Test</h3>
                                <p className="text-ink-700 text-xs">
                                    Choose subjects, question count and difficulty level.
                                </p>
                                <Button variant="purple" size="sm" onClick={() => setActiveTab('custom')} className="mt-auto w-full">
                                    Create Test
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Card>
                        </div>
                    </SectionCard>
                </>
            )
        }

        if (activeTab === 'custom') {
            return (
                <SectionCard icon={BookOpen} title="Create Your Custom Test">
                    <CustomTestForm onStart={beginTest} />
                </SectionCard>
            )
        }

        const tabLists = {
            mock: {
                tests: mockTests,
                emptyTitle: 'No mock tests available yet',
                emptyDescription: 'Mock tests appear once the question bank is large enough.',
            },
            chapter: {
                tests: chapterTests,
                emptyTitle: 'No chapter tests available yet',
                emptyDescription: 'A chapter test appears once a chapter has at least 2 questions.',
            },
            pyq: {
                tests: pyqTests,
                emptyTitle: 'No previous-year questions yet',
                emptyDescription:
                    'Previous-year questions are added only with their official answer key and a confirmed right to reuse them.',
            },
        }
        const { tests, emptyTitle, emptyDescription } = tabLists[activeTab]

        return (
            <SectionCard icon={BookOpen} title={practiceTabs.find((tab) => tab.id === activeTab).label}>
                <TestList
                    tests={tests}
                    onStart={beginTest}
                    emptyTitle={emptyTitle}
                    emptyDescription={emptyDescription}
                />
            </SectionCard>
        )
    }

    const renderLeftColumn = () => {
        if (catalog.status === 'error') {
            return (
                <Card>
                    <EmptyState
                        icon={Target}
                        title="Couldn’t load the question bank"
                        description="Check that the backend is running and try again."
                    >
                        <Button variant="soft" onClick={catalog.retry}>
                            Try again
                        </Button>
                    </EmptyState>
                </Card>
            )
        }

        if (catalog.status === 'loading') {
            return <LoadingSpinner label="Loading questions..." />
        }

        return renderTabContent()
    }

    return (
        <>
            <PageHeader
                icon={ClipboardList}
                title="Practice &"
                highlight="Tests"
                subtitle="Revise, Practice and Test your Biology concepts for NEET."
            >
                <div className="flex flex-wrap gap-3">
                    {headerStats.map(({ icon, value, label, tone }) => (
                        <HeaderStat key={label} icon={icon} value={value} label={label} iconClassName={tone} />
                    ))}
                </div>
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <Tabs tabs={practiceTabs} activeTab={activeTab} onChange={setActiveTab} />

                <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                    <div className="space-y-5">{renderLeftColumn()}</div>

                    <div className="space-y-5">
                        <TestProgressCard />
                        <RecentResultsCard />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PracticeTests
