import AssetImage from '@/components/common/AssetImage'
import { useUserStore } from '@/store/useUserStore'

function WelcomeBanner() {
    const name = useUserStore((state) => state.user.name)

    return (
        <section className="bg-banner">
            <div className="flex flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="max-w-xl">
                    <h1 className="text-3xl font-extrabold sm:text-4xl">
                        Welcome Back, <span className="text-brand-orange">{name}!</span> 👋
                    </h1>
                    <p className="text-ink-700 mt-2 text-base font-medium">
                        Continue your NEET Biology journey with interactive diagrams, AI
                        learning and smart practice.
                    </p>
                </div>

                <AssetImage
                    src="/images/page-banner.png"
                    className="pointer-events-none hidden h-36 object-contain lg:block"
                />

                <blockquote className="shadow-card rounded-2xl bg-white/90 px-6 py-5">
                    <p className="text-xl leading-snug font-extrabold italic">
                        <span className="text-accent-pink mr-1 text-3xl">“</span>
                        Visual Learning Makes Biology Easier!”
                    </p>
                    <span className="bg-accent-pink/60 rounded-pill mt-2 block h-[3px] w-24" />
                </blockquote>
            </div>
        </section>
    )
}

export default WelcomeBanner