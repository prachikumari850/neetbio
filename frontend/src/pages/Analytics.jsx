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
import FeatureChecklist from '@/components/common/FeatureChecklist'
import PageHeader from '@/components/common/PageHeader'
import Tabs from '@/components/common/Tabs'
import { analyticsTabs } from '@/data/mockAnalytics'

function Analytics() {
    const [activeTab, setActiveTab] = useState('overview')

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

                {activeTab === 'overview' && (
                    <>
                        <OverviewStats />
                        <div className="grid gap-5 lg:grid-cols-3">
                            <SubjectPerformanceCard />
                            <PerformanceTrendCard />
                            <QuestionAnalysisCard />
                        </div>
                        <div className="grid gap-5 lg:grid-cols-3">
                            <StrengthsCard />
                            <RecentTestsCard />
                            <AiInsightsCard />
                        </div>
                    </>
                )}

                {activeTab === 'subjects' && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        <SubjectPerformanceCard />
                        <SubjectComparisonCard />
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        <TestTrendCard />
                        <RecentTestsCard />
                    </div>
                )}

                {activeTab === 'topics' && <TopicProgressCard />}

                {activeTab === 'strengths' && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        <StrengthsCard />
                        <AiInsightsCard />
                    </div>
                )}
            </div>
        </>
    )
}

export default Analytics