import ContinueLearningCard from '@/components/dashboard/ContinueLearningCard'
import DailyGoalCard from '@/components/dashboard/DailyGoalCard'
import LearningProgressCard from '@/components/dashboard/LearningProgressCard'
import QuickLinks from '@/components/dashboard/QuickLinks'
import RecentActivityCard from '@/components/dashboard/RecentActivityCard'
import RecommendedCarousel from '@/components/dashboard/RecommendedCarousel'
import UpcomingPracticeCard from '@/components/dashboard/UpcomingPracticeCard'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner'

function Dashboard() {
    return (
        <>
            <WelcomeBanner />

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <QuickLinks />

                <div className="grid gap-5 lg:grid-cols-12">
                    <ContinueLearningCard className="lg:col-span-5 xl:col-span-4" />
                    <LearningProgressCard className="lg:col-span-7 xl:col-span-5" />
                    <DailyGoalCard className="lg:col-span-12 xl:col-span-3 xl:row-span-2" />
                    <RecommendedCarousel className="lg:col-span-7 xl:col-span-5" />
                    <div className="space-y-5 lg:col-span-5 xl:col-span-4">
                        <UpcomingPracticeCard />
                        <RecentActivityCard />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard