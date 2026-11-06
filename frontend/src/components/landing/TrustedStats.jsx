import LandingSection from '@/components/landing/LandingSection'
import { trustStats } from '@/data/landingContent'
import { cx } from '@/utils/classNames'

function TrustedStats() {
    return (
        <LandingSection id="about">
            <div className="grid items-center gap-6 lg:grid-cols-[0.6fr_2fr]">
                <h2 className="text-navy-900 text-3xl leading-tight font-extrabold">
                    Trusted by
                    <br />
                    NEET Aspirants
                    <span className="bg-brand-orange rounded-pill mt-2 block h-[3px] w-28" />
                </h2>

                <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {trustStats.map(({ id, icon: Icon, value, label, accent }) => (
                        <li
                            key={id}
                            className="rounded-card border-line shadow-card flex flex-col items-center gap-1 border bg-white p-5 text-center"
                        >
                            <Icon className={cx('size-8', accent)} />
                            <span className="text-lg font-extrabold">{value}</span>
                            <span className="text-ink-700 text-sm">{label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </LandingSection>
    )
}

export default TrustedStats