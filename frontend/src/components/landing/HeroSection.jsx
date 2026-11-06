import { useState } from 'react'
import { ArrowRight, GraduationCap, Play } from 'lucide-react'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import HeroDiagramCarousel from '@/components/landing/HeroDiagramCarousel'
import { demoSteps, heroHighlights } from '@/data/landingContent'

function HeroSection() {
    const [isDemoOpen, setIsDemoOpen] = useState(false)

    return (
        <section className="bg-banner overflow-hidden">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:py-14">
                <div>
                    <span className="rounded-pill shadow-card inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 text-xs font-bold">
                        <GraduationCap className="text-danger size-4" />
                        Free for NEET Aspirants
                    </span>

                    <h1 className="mt-5 text-4xl leading-tight font-extrabold sm:text-5xl">
                        Master NEET Biology with{' '}
                        <span className="text-brand-orange">
                            Interactive Diagrams & AI Learning
                        </span>
                    </h1>

                    <p className="text-ink-700 mt-5 max-w-lg text-base">
                        Explore, understand, generate and practice high-quality Biology
                        diagrams with AI. Learn visually, practice smarter and track your
                        progress — completely free.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                        <Button to="/signup" size="lg">
                            Start Learning Free
                            <ArrowRight className="size-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setIsDemoOpen(true)}
                        >
                            <Play className="size-5" />
                            Watch Demo
                        </Button>
                    </div>

                    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                        {heroHighlights.map(({ icon: Icon, lines }) => (
                            <li key={lines.join(' ')} className="flex items-center gap-2">
                                <Icon className="text-brand-purple size-7 shrink-0" />
                                <span className="text-xs leading-tight font-semibold">
                                    {lines[0]}
                                    <br />
                                    {lines[1]}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <HeroDiagramCarousel />
            </div>

            <Modal
                isOpen={isDemoOpen}
                title="How NEETBIO works"
                onClose={() => setIsDemoOpen(false)}
            >
                <ol className="text-ink-700 list-decimal space-y-3 pl-5 text-sm">
                    {demoSteps.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>
                <Button to="/signup" className="mt-6 w-full">
                    Start Learning Free
                </Button>
            </Modal>
        </section>
    )
}

export default HeroSection