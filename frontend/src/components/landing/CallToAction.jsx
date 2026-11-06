import { ArrowRight } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import LandingSection from '@/components/landing/LandingSection'

function CallToAction() {
    return (
        <LandingSection>
            <div className="bg-banner relative overflow-hidden rounded-3xl px-6 py-10 text-center">
                <AssetImage
                    src="/images/landing/cta-books.png"
                    className="pointer-events-none absolute bottom-0 left-0 hidden h-40 object-contain md:block"
                />
                <AssetImage
                    src="/images/landing/cta-student.png"
                    className="pointer-events-none absolute right-0 bottom-0 hidden h-44 object-contain md:block"
                />

                <div className="relative">
                    <h2 className="text-navy-900 text-3xl font-extrabold">
                        Start Your NEET Biology Journey Today
                    </h2>
                    <p className="text-ink-700 mx-auto mt-3 max-w-xl text-sm">
                        Learn, explore, practice and master Biology — completely free for all
                        NEET aspirants.
                    </p>
                    <Button to="/signup" size="lg" className="mt-6">
                        Get Started Now
                        <ArrowRight className="size-5" />
                    </Button>
                </div>
            </div>
        </LandingSection>
    )
}

export default CallToAction