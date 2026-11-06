function EmptyState({ icon: Icon, title, description, children }) {
    return (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
            {Icon && (
                <span className="bg-brand-purple-soft text-brand-purple flex size-14 items-center justify-center rounded-full">
                    <Icon className="size-7" />
                </span>
            )}
            <h3 className="text-lg font-bold">{title}</h3>
            {description && (
                <p className="text-ink-500 max-w-sm text-sm">{description}</p>
            )}
            {children}
        </div>
    )
}

export default EmptyState