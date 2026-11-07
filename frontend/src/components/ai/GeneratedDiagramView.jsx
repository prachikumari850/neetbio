import { useRef, useState } from 'react'
import { Download, Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import Button from '@/components/common/Button'
import { chartColors } from '@/utils/chartColors'
import { cx } from '@/utils/classNames'
import { toFileName, wrapLabel } from '@/utils/diagramLabels'

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25
const CHARACTER_WIDTH = 8
const LINE_HEIGHT = 14
const FONT_SIZE = 12
const FONT_FAMILY = 'Inter, Arial, sans-serif'

const COLORS = {
    background: '#ffffff',
    ink: '#0f172a',
    line: '#64748b',
    node: '#ffffff',
    nodeBorder: chartColors.info,
    highlight: '#ece6ff',
    body: '#ece6ff',
    bodyBorder: chartColors.purple,
}

function ControlButton({ icon: Icon, label, ...props }) {
    return (
        <button
            type="button"
            className="hover:text-brand-purple flex items-center gap-1.5 text-xs font-semibold disabled:opacity-40"
            {...props}
        >
            <Icon className="size-4" />
            {label}
        </button>
    )
}

function SceneNode({ node, text, isSelected, onSelect }) {
    const lines = wrapLabel(text, Math.floor(node.w / CHARACTER_WIDTH))
    const firstLineY = node.y - ((lines.length - 1) * LINE_HEIGHT) / 2

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(node.id)
        }
    }

    return (
        <g
            role="button"
            tabIndex={0}
            aria-label={text}
            onClick={() => onSelect(node.id)}
            onKeyDown={handleKeyDown}
            style={{ cursor: 'pointer' }}
        >
            <rect
                x={node.x - node.w / 2}
                y={node.y - node.h / 2}
                width={node.w}
                height={node.h}
                rx={10}
                fill={isSelected ? COLORS.highlight : COLORS.node}
                stroke={isSelected ? COLORS.bodyBorder : COLORS.nodeBorder}
                strokeWidth={isSelected ? 2.5 : 1.5}
            />
            <text
                textAnchor="middle"
                fontSize={FONT_SIZE}
                fontWeight={600}
                fontFamily={FONT_FAMILY}
                fill={COLORS.ink}
            >
                {lines.map((line, index) => (
                    <tspan key={line} x={node.x} y={firstLineY + index * LINE_HEIGHT + 4}>
                        {line}
                    </tspan>
                ))}
            </text>
        </g>
    )
}

function SelectedPart({ part, isHidden }) {
    if (!part) {
        return <p className="text-ink-500 text-sm">Click a box to read about that part.</p>
    }

    if (isHidden) {
        return <p className="text-ink-700 text-sm">Click a numbered box to reveal its name.</p>
    }

    return (
        <div>
            <h4 className="font-bold">{part.name}</h4>
            <p className="text-ink-700 mt-1 text-sm">{part.description}</p>
        </div>
    )
}

function GeneratedDiagramView({ diagram }) {
    const { scene, parts } = diagram
    const [zoom, setZoom] = useState(MIN_ZOOM)
    const [isQuiz, setIsQuiz] = useState(false)
    const [revealedIds, setRevealedIds] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const svgRef = useRef(null)

    const selectedPart = selectedId === null ? null : parts[selectedId]
    const isSelectedHidden = isQuiz && !revealedIds.includes(selectedId)

    const handleSelect = (nodeId) => {
        setSelectedId(nodeId)

        if (isQuiz) {
            setRevealedIds((current) => (current.includes(nodeId) ? current : [...current, nodeId]))
        }
    }

    const toggleQuiz = () => {
        setIsQuiz((current) => !current)
        setRevealedIds([])
    }

    const getNodeText = (node) =>
        isQuiz && !revealedIds.includes(node.id) ? String(node.id + 1) : node.label

    const handleDownload = () => {
        const markup = new XMLSerializer().serializeToString(svgRef.current)
        const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = toFileName(diagram.title)
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <figure className="border-line space-y-3 rounded-2xl border bg-white p-4">
            <figcaption>
                <h3 className="text-lg font-extrabold">{diagram.title}</h3>
                <p className="text-ink-500 text-xs capitalize">{diagram.kind} diagram</p>
            </figcaption>

            <div className="border-line max-h-[36rem] overflow-auto rounded-xl border">
                <svg
                    ref={svgRef}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={`0 0 ${scene.width} ${scene.height}`}
                    role="img"
                    aria-label={`Generated diagram: ${diagram.title}`}
                    className="mx-auto block"
                    style={{ width: `${zoom * 100}%` }}
                >
                    <defs>
                        <marker
                            id="arrowhead"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto-start-reverse"
                        >
                            <path d="M0 0 L10 5 L0 10 z" fill={COLORS.line} />
                        </marker>
                    </defs>

                    <rect width={scene.width} height={scene.height} fill={COLORS.background} />

                    {scene.body && (
                        <ellipse
                            cx={scene.body.cx}
                            cy={scene.body.cy}
                            rx={scene.body.rx}
                            ry={scene.body.ry}
                            fill={COLORS.body}
                            stroke={COLORS.bodyBorder}
                            strokeWidth={2}
                        />
                    )}

                    {scene.edges.map((edge, index) => (
                        <g key={index}>
                            <line
                                x1={edge.x1}
                                y1={edge.y1}
                                x2={edge.x2}
                                y2={edge.y2}
                                stroke={COLORS.line}
                                strokeWidth={1.5}
                                markerEnd={edge.arrow ? 'url(#arrowhead)' : undefined}
                            />
                            {!edge.arrow && <circle cx={edge.x2} cy={edge.y2} r={3} fill={COLORS.line} />}
                        </g>
                    ))}

                    {scene.nodes.map((node) => (
                        <SceneNode
                            key={node.id}
                            node={node}
                            text={getNodeText(node)}
                            isSelected={node.id === selectedId}
                            onSelect={handleSelect}
                        />
                    ))}
                </svg>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <ControlButton
                    icon={ZoomIn}
                    label="Zoom In"
                    disabled={zoom >= MAX_ZOOM}
                    onClick={() => setZoom((current) => current + ZOOM_STEP)}
                />
                <ControlButton
                    icon={ZoomOut}
                    label="Zoom Out"
                    disabled={zoom <= MIN_ZOOM}
                    onClick={() => setZoom((current) => current - ZOOM_STEP)}
                />
                <ControlButton icon={RotateCcw} label="Reset" onClick={() => setZoom(MIN_ZOOM)} />
                <ControlButton
                    icon={isQuiz ? Eye : EyeOff}
                    label={isQuiz ? 'Show names' : 'Quiz mode'}
                    onClick={toggleQuiz}
                />
                <Button variant="outline" size="sm" onClick={handleDownload} className="ml-auto">
                    <Download className="size-4" />
                    Download SVG
                </Button>
            </div>

            <div className="border-line rounded-2xl border bg-white p-4">
                <SelectedPart part={selectedPart} isHidden={isSelectedHidden} />
            </div>

            {!isQuiz && (
                <ul className="flex flex-wrap gap-2">
                    {parts.map((part, index) => (
                        <li key={part.name}>
                            <button
                                type="button"
                                onClick={() => handleSelect(index)}
                                className={cx(
                                    'rounded-full px-3 py-1 text-xs font-semibold',
                                    index === selectedId
                                        ? 'bg-brand-purple-soft text-brand-purple'
                                        : 'bg-page hover:bg-brand-purple-soft',
                                )}
                            >
                                {part.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <p className="text-ink-500 text-xs">
                A labelled sketch made by a small AI model, not an exact textbook figure. Check the
                parts against your NCERT textbook.
            </p>
        </figure>
    )
}

export default GeneratedDiagramView