import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LandingSection from '@/components/landing/LandingSection'
import { platformFeatures } from '@/data/landingContent'
import { cx } from '@/utils/classNames'

function FeatureCards() {
    return (
        <LandingSection
            title="Everything You Need for NEET Biology"
            subtitle="From exploring diagrams to practicing questions — all in one free platform."
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {platformFeatures.map(
                    ({ id, icon: Icon, title, description, to, tint, accent }) => (
                        <Link
                            key={id}
                            to={to}
                            className={cx(
                                'rounded-card shadow-card flex flex-col p-5 transition hover:-translate-y-1',
                                tint,
                            )}
                        >
                            <Icon className={cx('size-10', accent)} />
                            <h3 className="mt-4 text-lg leading-tight font-extrabold">
                                {title}
                            </h3>
                            <p className="text-ink-700 mt-2 flex-1 text-sm">{description}</p>
                            <span
                                className={cx(
                                    'shadow-card mt-4 flex size-9 items-center justify-center self-end rounded-full bg-white',
                                    accent,
                                )}
                            >
                                <ArrowRight className="size-4" />
                            </span>
                        </Link>
                    ),
                )}
            </div>
        </LandingSection>
    )
}

export default FeatureCards