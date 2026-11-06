function ProgressRing({
    value,
    size = 140,
    strokeWidth = 14,
    barClassName = 'stroke-success',
    children,
}) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - value / 100)

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-line"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={barClassName}
                />
            </svg>
            <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center [&>*]:max-w-full [&>*]:leading-tight"
                style={{ padding: strokeWidth + 7, boxSizing: 'border-box' }}
            >
                {children}
            </div>
        </div>
    )
}

export default ProgressRing
