const ROW_HEIGHT = 56
const TOP_PADDING = 40

function SimulatedDiagram({ title, labels }) {
    const leftLabels = labels.filter((_, index) => index % 2 === 0)
    const rightLabels = labels.filter((_, index) => index % 2 === 1)
    const rowCount = Math.max(leftLabels.length, rightLabels.length)
    const height = TOP_PADDING + rowCount * ROW_HEIGHT
    const centerY = height / 2

    const renderLabel = (label, row, side) => {
        const isLeft = side === 'left'
        const y = TOP_PADDING / 2 + row * ROW_HEIGHT + ROW_HEIGHT / 2
        const boxX = isLeft ? 8 : 292

        return (
            <g key={label}>
                <line
                    x1={isLeft ? 108 : 292}
                    y1={y}
                    x2={isLeft ? 165 : 235}
                    y2={centerY + (y - centerY) * 0.4}
                    className="stroke-ink-500"
                    strokeWidth="1.5"
                />
                <rect x={boxX} y={y - 14} width="100" height="28" rx="8" className="fill-white stroke-info" />
                <text
                    x={boxX + 50}
                    y={y + 4}
                    textAnchor="middle"
                    className="fill-ink-900 text-[11px] font-semibold"
                >
                    {label}
                </text>
            </g>
        )
    }

    return (
        <figure className="border-line rounded-2xl border bg-white p-4">
            <svg viewBox={`0 0 400 ${height}`} role="img" aria-label={`Generated diagram: ${title}`} className="mx-auto w-full max-w-md">
                <ellipse
                    cx="200"
                    cy={centerY}
                    rx="40"
                    ry={centerY - 20}
                    className="fill-brand-purple-soft stroke-brand-purple"
                    strokeWidth="2"
                />
                {leftLabels.map((label, row) => renderLabel(label, row, 'left'))}
                {rightLabels.map((label, row) => renderLabel(label, row, 'right'))}
            </svg>
            <figcaption className="text-ink-500 mt-2 text-center text-xs">
                {title} – simulated preview, not a real AI-generated diagram.
            </figcaption>
        </figure>
    )
}

export default SimulatedDiagram