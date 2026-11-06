import { useRef, useState } from 'react'
import {
    Bookmark,
    Maximize,
    Microscope,
    RotateCcw,
    ZoomIn,
    ZoomOut,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AssetImage from '@/components/common/AssetImage'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import SegmentedTabs from '@/components/landing/SegmentedTabs'
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle'
import { cx } from '@/utils/classNames'
import { diagramToBookmark } from '@/utils/bookmarkItems'

const MODES = [
    { id: 'study', label: 'Study Mode' },
    { id: 'labels', label: 'Label Mode' },
    { id: 'identify', label: 'Identify Mode' },
]

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.5

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

function Hotspot({ structure, mode, isSelected, isRevealed, onSelect }) {
    const baseClasses = 'absolute -translate-x-1/2 -translate-y-1/2 shadow'
    const position = { top: `${structure.top}%`, left: `${structure.left}%` }

    const handleClick = (event) => {
        event.stopPropagation()
        onSelect(structure.name)
    }

    if (mode === 'study') {
        return (
            <button
                type="button"
                aria-label={structure.name}
                style={position}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={handleClick}
                className={cx(
                    baseClasses,
                    'size-5 rounded-full border-2 border-white',
                    isSelected ? 'bg-brand-orange ring-brand-orange/40 ring-4' : 'bg-brand-purple',
                )}
            />
        )
    }

    const isHidden = mode === 'identify' && !isRevealed

    return (
        <button
            type="button"
            style={position}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={handleClick}
            className={cx(
                baseClasses,
                'border-info rounded-lg border bg-white px-2 py-1 text-xs font-semibold whitespace-nowrap',
                isSelected && 'bg-brand-purple-soft ring-brand-purple ring-2',
            )}
        >
            {isHidden ? '?' : structure.name}
        </button>
    )
}

function StructureDetails({ mode, structure, isRevealed }) {
    if (mode === 'identify' && !isRevealed) {
        return (
            <p className="text-ink-700 text-sm">
                Tap a “?” label on the diagram to reveal the structure.
            </p>
        )
    }

    return (
        <div>
            <h4 className="font-bold">{structure.name}</h4>
            <p className="text-ink-700 mt-1 text-sm">{structure.description}</p>
        </div>
    )
}

function DiagramViewer({ diagram, onClose }) {
    const [mode, setMode] = useState('study')
    const [selectedName, setSelectedName] = useState(diagram.structures[0].name)
    const [revealedNames, setRevealedNames] = useState([])
    const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
    const dragRef = useRef(null)
    const stageRef = useRef(null)
    const { isBookmarked, toggle } = useBookmarkToggle()

    const bookmarkId = `diagram-${diagram.id}`
    const saved = isBookmarked(bookmarkId)
    const selectedStructure = diagram.structures.find(
        (structure) => structure.name === selectedName,
    )

    const handleModeChange = (nextMode) => {
        setMode(nextMode)
        setRevealedNames([])
    }

    const handleSelect = (name) => {
        setSelectedName(name)

        if (mode === 'identify') {
            setRevealedNames((current) =>
                current.includes(name) ? current : [...current, name],
            )
        }
    }

    const changeZoom = (delta) => {
        setView((current) => {
            const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.zoom + delta))
            return zoom === MIN_ZOOM ? { zoom, x: 0, y: 0 } : { ...current, zoom }
        })
    }

    const handlePointerDown = (event) => {
        if (view.zoom === MIN_ZOOM) {
            return
        }

        dragRef.current = { startX: event.clientX - view.x, startY: event.clientY - view.y }
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event) => {
        if (!dragRef.current) {
            return
        }

        const { startX, startY } = dragRef.current
        setView((current) => ({
            ...current,
            x: event.clientX - startX,
            y: event.clientY - startY,
        }))
    }

    const handleFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen()
            } else {
                await stageRef.current?.requestFullscreen()
            }
        } catch {
            toast.error('Fullscreen is not available right now.')
        }
    }

    return (
        <Modal isOpen title={diagram.title} onClose={onClose} size="xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge>Class {diagram.classLevel}</Badge>
                    <span className="text-ink-700 text-sm">{diagram.chapter}</span>
                </div>
                <Button
                    variant={saved ? 'soft' : 'outline'}
                    size="sm"
                    aria-pressed={saved}
                    onClick={() => toggle(diagramToBookmark(diagram))}
                >
                    <Bookmark className={cx('size-4', saved && 'fill-brand-orange text-brand-orange')} />
                    {saved ? 'Saved' : 'Bookmark'}
                </Button>
            </div>

            <SegmentedTabs tabs={MODES} activeTab={mode} onChange={handleModeChange} />

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <div>
                    <div
                        ref={stageRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={() => {
                            dragRef.current = null
                        }}
                        className={cx(
                            'border-line relative h-80 touch-none overflow-hidden rounded-2xl border bg-white select-none sm:h-[26rem]',
                            view.zoom > MIN_ZOOM && 'cursor-grab active:cursor-grabbing',
                        )}
                    >
                        <div
                            className="relative size-full origin-center"
                            style={{
                                transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                            }}
                        >
                            <AssetImage
                                src={diagram.image}
                                alt={diagram.title}
                                draggable={false}
                                className="size-full object-contain p-6"
                                fallback={
                                    <div className="flex size-full items-center justify-center">
                                        <Microscope className="text-brand-purple/20 size-32" />
                                    </div>
                                }
                            />
                            {diagram.structures.map((structure) => (
                                <Hotspot
                                    key={structure.name}
                                    structure={structure}
                                    mode={mode}
                                    isSelected={structure.name === selectedName}
                                    isRevealed={revealedNames.includes(structure.name)}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <ControlButton
                            icon={ZoomIn}
                            label="Zoom In"
                            disabled={view.zoom >= MAX_ZOOM}
                            onClick={() => changeZoom(ZOOM_STEP)}
                        />
                        <ControlButton
                            icon={ZoomOut}
                            label="Zoom Out"
                            disabled={view.zoom <= MIN_ZOOM}
                            onClick={() => changeZoom(-ZOOM_STEP)}
                        />
                        <ControlButton
                            icon={RotateCcw}
                            label="Reset"
                            onClick={() => {
                                setView({ zoom: 1, x: 0, y: 0 })
                                setRevealedNames([])
                            }}
                        />
                        <ControlButton icon={Maximize} label="Fullscreen" onClick={handleFullscreen} />
                        {view.zoom > MIN_ZOOM && (
                            <span className="text-ink-500 text-xs">Drag the diagram to pan</span>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-ink-700 text-sm">{diagram.summary}</p>

                    <div className="border-line rounded-2xl border bg-white p-4">
                        <StructureDetails
                            mode={mode}
                            structure={selectedStructure}
                            isRevealed={revealedNames.includes(selectedName)}
                        />
                    </div>

                    {mode === 'identify' ? (
                        <p className="text-sm font-semibold">
                            Revealed {revealedNames.length} of {diagram.structures.length}
                        </p>
                    ) : (
                        <ul className="space-y-1.5">
                            {diagram.structures.map((structure) => (
                                <li key={structure.name}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedName(structure.name)}
                                        className={cx(
                                            'w-full rounded-xl px-3 py-2 text-left text-sm font-semibold',
                                            structure.name === selectedName
                                                ? 'bg-brand-purple-soft text-brand-purple'
                                                : 'hover:bg-page',
                                        )}
                                    >
                                        {structure.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Button to="/practice?tab=practice" variant="outline" size="sm">
                        Practice questions
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default DiagramViewer