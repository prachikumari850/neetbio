import AssetImage from '@/components/common/AssetImage'

function PageHeader({
    icon: Icon,
    title,
    highlight,
    subtitle,
    imageSrc = '/images/page-banner.png',
    children,
}) {
    return (
        <section className="bg-banner">
            <div className="flex flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <Icon
                            className="text-brand-purple hidden size-14 shrink-0 sm:block"
                            strokeWidth={1.5}
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-extrabold sm:text-4xl">
                            {title}
                            {highlight && (
                                <span className="text-brand-orange"> {highlight}</span>
                            )}
                        </h1>
                        <p className="text-ink-700 mt-1 text-sm font-medium sm:text-base">
                            {subtitle}
                        </p>
                        <span className="bg-accent-pink/70 rounded-pill mt-2 block h-[3px] w-44" />
                    </div>
                </div>

                <AssetImage
                    src={imageSrc}
                    className="pointer-events-none hidden h-36 object-contain xl:block"
                />

                {children}
            </div>
        </section>
    )
}

export default PageHeader