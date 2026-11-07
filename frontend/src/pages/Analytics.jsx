import { useState } from 'react'
import { ChartColumn } from 'lucide-react'
import AiInsightsCard from '@/components/analytics/AiInsightsCard'
import OverviewStats from '@/components/analytics/OverviewStats'
import PerformanceTrendCard from '@/components/analytics/PerformanceTrendCard'
import QuestionAnalysisCard from '@/components/analytics/QuestionAnalysisCard'
import RecentTestsCard from '@/components/analytics/RecentTestsCard'
import StrengthsCard from '@/components/analytics/StrengthsCard'
import SubjectComparisonCard from '@/components/analytics/SubjectComparisonCard'
import SubjectPerformanceCard from '@/components/analytics/SubjectPerformanceCard'
import TestTrendCard from '@/components/analytics/TestTrendCard'
import TopicProgressCard from '@/components/analytics/TopicProgressCard'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import FeatureChecklist from '@/components/common/FeatureChecklist'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import PageHeader from '@/components/common/PageHeader'
import Tabs from '@/components/common/Tabs'
import { analyticsTabs } from '@/data/learningConfig'
import { useAnalytics } from '@/hooks/useAnalytics'

function AnalyticsTabs({ data, activeTab }) {
    if (activeTab === 'overview') {
        return (
            <>
                <OverviewStats data={data} />
                <div className="grid gap-5 lg:grid-cols-3">
                    <SubjectPerformanceCard areas={data.areas} />
                    <PerformanceTrendCard weeks={data.weeklyTrend} />
                    <QuestionAnalysisCard analysis={data.questionAnalysis} />
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                    <StrengthsCard
                        strengths={data.strengths}
                        weaknesses={data.weaknesses}
                        minSample={data.minSample}
                    />
                    <RecentTestsCard tests={data.tests} />
                    <AiInsightsCard insights={data.insights} />
                </div>
            </>
        )
    }

    if (activeTab === 'subjects') {
        return (
            <div className="grid gap-5 lg:grid-cols-2">
                <SubjectPerformanceCard areas={data.areas} />
                <SubjectComparisonCard areas={data.areas} />
            </div>
        )
    }

    if (activeTab === 'tests') {
        return (
            <div className="grid gap-5 lg:grid-cols-2">
                <TestTrendCard tests={data.tests} />
                <RecentTestsCard tests={data.tests} />
            </div>
        )
    }

    if (activeTab === 'topics') {
        return <TopicProgressCard chapters={data.chapters} />
    }

    return (
        <div className="grid gap-5 lg:grid-cols-2">
            <StrengthsCard
                strengths={data.strengths}
                weaknesses={data.weaknesses}
                minSample={data.minSample}
            />
            <AiInsightsCard insights={data.insights} />
        </div>
    )
}

function Analytics() {
    const [activeTab, setActiveTab] = useState('overview')
    const { data, status, retry } = useAnalytics()

    const renderBody = () => {
        if (status === 'error') {
            return (
                <Card>
                    <EmptyState
                        icon={ChartColumn}
                        title="Couldn’t load your analytics"
                        description="Check that the backend is running and try again."
                    >
                        <Button variant="soft" onClick={retry}>
                            Try again
                        </Button>
                    </EmptyState>
                </Card>
            )
        }

        if (!data) {
            return <LoadingSpinner label="Calculating your progress..." />
        }

        return (
            <>
                {data.excludedAttempts > 0 && (
                    <p className="bg-brand-orange-soft rounded-2xl px-4 py-3 text-sm font-medium">
                        {data.excludedAttempts} earlier test{data.excludedAttempts > 1 ? 's were' : ' was'} left
                        out of the chapter and topic figures because a question’s answer key has changed since.
                        Your totals still include {data.excludedAttempts > 1 ? 'them' : 'it'}.
                    </p>
                )}
                <AnalyticsTabs data={data} activeTab={activeTab} />
            </>
        )
    }

    return (
        <>
            <PageHeader
                icon={ChartColumn}
                title="Progress &"
                highlight="Analytics"
                subtitle="Track your performance, identify strengths & weak areas, and improve for NEET."
            >
                <FeatureChecklist
                    items={[
                        'Track chapter & subject progress',
                        'Analyze test performance',
                        'Get smart improvement insights',
                    ]}
                />
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <Tabs tabs={analyticsTabs} activeTab={activeTab} onChange={setActiveTab} />
                {renderBody()}
            </div>
        </>
    )
}

export default Analytics