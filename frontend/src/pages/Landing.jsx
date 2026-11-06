import AssistantCard from '@/components/landing/AssistantCard'
import CallToAction from '@/components/landing/CallToAction'
import ChapterCarousel from '@/components/landing/ChapterCarousel'
import FeatureCards from '@/components/landing/FeatureCards'
import HeroSection from '@/components/landing/HeroSection'
import InteractiveDiagramDemo from '@/components/landing/InteractiveDiagramDemo'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingSection from '@/components/landing/LandingSection'
import PracticeCard from '@/components/landing/PracticeCard'
import TrustedStats from '@/components/landing/TrustedStats'

function Landing() {
    return (
        <>
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeatureCards />
                <ChapterCarousel />
                <InteractiveDiagramDemo />
                <LandingSection className="grid gap-6 lg:grid-cols-2">
                    <AssistantCard />
                    <PracticeCard />
                </LandingSection>
                <TrustedStats />
                <CallToAction />
            </main>
            <LandingFooter />
        </>
    )
}

export default Landing