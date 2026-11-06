import { useState } from 'react'
import { ArrowRight, BookOpen, ClipboardList, Layers, Star, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import HeaderStat from '@/components/common/HeaderStat'
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
import { questionBank } from '@/data/mockQuestions'
import { practiceTabs, recommendedTestIds, testCatalog } from '@/data/mockPractice'
import { useTestStore } from '@/store/useTestStore'
import { toMinutes } from '@/utils/formatters'
import { buildTest, evaluateTest } from '@/utils/testBuilder'

const recommendedTests = recommendedTestIds
    .map((id) => testCatalog.find((test) => test.id === id))
    .filter(Boolean)

const headerStats = [
    { icon: Target, value: questionBank.length, label: 'Practice Qs', tone: 'text-danger' },
    { icon: Layers, value: testCatalog.filter((test) => test.category === 'chapter').length, label: 'Chapter Tests', tone: 'text-brand-purple' },
    { icon: ClipboardList, value: testCatalog.filter((test) => test.category === 'mock').length, label: 'Full Mock Tests', tone: 'text-accent-pink' },
]

function PracticeTests() {
    const [searchParams, setSearchParams] = useSearchParams()
    const addResult = useTestStore((state) => state.addResult)
    const [activeTest, setActiveTest] = useState(() => {
        const config = testCatalog.find((test) => test.id === searchParams.get('start'))
        return config ? buildTest(config) : null
    })
    const [outcome, setOutcome] = useState(null)

    const requestedTab = searchParams.get('tab')
    const activeTab = practiceTabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'practice'

    const setActiveTab = (tabId) => setSearchParams({ tab: tabId })

    const startTest = (config) => {
        const test = buildTest(config)

        if (test.questions.length === 0) {
            toast.error('No questions match those choices yet.')
            return
        }

        setOutcome(null)
        setActiveTest(test)
    }

    const startSubjectPractice = (subject) =>
        startTest({
            id: `practice-${subject.id}`,
            title: `${subject.label} – Practice`,
            subjects: [subject.id],
            count: 5,
            durationMin: 5,
        })

    const handleSubmit = ({ answers, timeTakenSec }) => {
        const evaluation = evaluateTest(activeTest.questions, answers)

        addResult({
            id: `result-${Date.now()}`,
            title: activeTest.title,
            subjectId: activeTest.subjectId,
            correct: evaluation.correct,
            total: activeTest.questions.length,
            accuracy: evaluation.accuracy,
            minutes: toMinutes(timeTakenSec),
            takenAt: new Date().toISOString(),
        })
        setOutcome({ evaluation, timeTakenSec })
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
                onRetry={() => startTest(activeTest.config)}
                onBack={leaveTest}
            />
        )
    }

    if (activeTest) {
        return <TestRunner key={activeTest.id} test={activeTest} onSubmit={handleSubmit} onExit={leaveTest} />
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
                    <div className="space-y-5">
                        {activeTab === 'practice' && (
                            <>
                                <SectionCard icon={Target} title="Choose Practice Mode" iconClassName="text-danger">
                                    <SubjectModeGrid onStart={startSubjectPractice} />
                                </SectionCard>

                                <SectionCard icon={Star} title="Recommended for You" iconClassName="fill-brand-orange text-brand-orange">
                                    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
                                        <TestList tests={recommendedTests} onStart={startTest} />
                                        <Card className="flex flex-col items-center gap-2 bg-linear-to-b from-[#ffe9ef] to-white p-5 text-center">
                                            <ClipboardList className="text-accent-pink size-12" />
                                            <h3 className="text-lg leading-tight font-extrabold">Create Your Custom Test</h3>
                                            <p className="text-ink-700 text-xs">
                                                Choose chapters, question count and difficulty level.
                                            </p>
                                            <Button variant="purple" size="sm" onClick={() => setActiveTab('custom')} className="mt-auto w-full">
                                                Create Test
                                                <ArrowRight className="size-4" />
                                            </Button>
                                        </Card>
                                    </div>
                                </SectionCard>
                            </>
                        )}

                        {['mock', 'chapter', 'pyq'].includes(activeTab) && (
                            <SectionCard
                                icon={BookOpen}
                                title={practiceTabs.find((tab) => tab.id === activeTab).label}
                            >
                                <TestList
                                    tests={testCatalog.filter((test) => test.category === activeTab)}
                                    onStart={startTest}
                                />
                                <p className="text-ink-500 mt-4 text-xs">
                                    Tests draw from the sample question bank. The full NEET-scale bank arrives with the backend.
                                </p>
                            </SectionCard>
                        )}

                        {activeTab === 'custom' && (
                            <SectionCard icon={BookOpen} title="Create Your Custom Test">
                                <CustomTestForm onStart={startTest} />
                            </SectionCard>
                        )}
                    </div>

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