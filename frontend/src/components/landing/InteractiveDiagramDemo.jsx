import { useRef, useState } from 'react'
import {
    ArrowRight,
    CircleCheck,
    Maximize,
    Microscope,
    RotateCcw,
    Volume2,
    ZoomIn,
    ZoomOut,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import LandingSection from '@/components/landing/LandingSection'
import SegmentedTabs from '@/components/landing/SegmentedTabs'
import {
    demoBenefits,
    demoModeTabs,
    nephronStructures,
} from '@/data/landingContent'
import { cx } from '@/utils/classNames'

const DEFAULT_STRUCTURE_ID = 'glomerulus'
const MIN_ZOOM = 0.75
const MAX_ZOOM = 2
const ZOOM_STEP = 0.25

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

function StructureInfo({ mode, structure, revealedCount }) {
    if (mode === 'label') {
        return (
            <p className="text-ink-700 text-sm">
                Labels are on. Switch to Study Mode to read explanations.
            </p>
        )
    }

    if (mode === 'identify') {
        return (
            <p className="text-ink-700 text-sm">
                Tap a “?” label to reveal the structure. Revealed {revealedCount} of{' '}
                {nephronStructures.length}.
            </p>
        )
    }

    const speak = () => {
        if (!('speechSynthesis' in window)) {
            toast.error('Audio is not supported in this browser.')
            return
        }

        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(
            new SpeechSynthesisUtterance(`${structure.name}. ${structure.description}`),
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold">{structure.name}</h4>
                <button
                    type="button"
                    aria-label={`Listen to ${structure.name}`}
                    onClick={speak}
                    className="text-ink-500 hover:text-brand-purple"
                >
                    <Volume2 className="size-5" />
                </button>
            </div>
            <p className="text-ink-700 text-xs">{structure.description}</p>
            <p className="text-xs">
                <strong className="block">Function:</strong>
                {structure.function}
            </p>
            <p className="text-xs">
                <strong className="block">Location:</strong>
                {structure.location}
            </p>
        </div>
    )
}

function InteractiveDiagramDemo() {
    const [mode, setMode] = useState('study')
    const [selectedId, setSelectedId] = useState(DEFAULT_STRUCTURE_ID)
    const [revealedIds, setRevealedIds] = useState([])
    const [zoom, setZoom] = useState(1)
    const stageRef = useRef(null)

    const selectedStructure = nephronStructures.find(
        (structure) => structure.id === selectedId,
    )

    const handleModeChange = (nextMode) => {
        setMode(nextMode)
        setRevealedIds([])
    }

    const handleStructureClick = (structureId) => {
        setSelectedId(structureId)

        if (mode === 'identify' && !revealedIds.includes(structureId)) {
            setRevealedIds((current) => [...current, structureId])
        }
    }

    const handleReset = () => {
        setZoom(1)
        setRevealedIds([])
        setSelectedId(DEFAULT_STRUCTURE_ID)
    }

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
            return
        }

        stageRef.current
            ?.requestFullscreen?.()
            ?.catch(() => toast.error('Fullscreen is not available right now.'))
    }

    const getLabelText = (structure) => {
        const isHidden = mode === 'identify' && !revealedIds.includes(structure.id)
        return isHidden ? '?' : structure.name
    }

    return (
        <LandingSection>
            <div className="bg-banner grid gap-8 rounded-3xl p-6 lg:grid-cols-[0.8fr_1.4fr] lg:p-8">
                <div>
                    <h2 className="text-navy-900 text-3xl leading-tight font-extrabold">
                        Learn with
                        <br />
                        Interactive Diagrams
                    </h2>
                    <span className="bg-brand-orange rounded-pill mt-2 block h-[3px] w-36" />
                    <p className="text-ink-700 mt-4 text-sm">
                        Explore detailed, labeled diagrams with clickable structures.
                        Understand functions, get instant explanations and switch between
                        study modes for active learning.
                    </p>

                    <ul className="mt-5 space-y-2">
                        {demoBenefits.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-2 text-sm font-medium">
                                <CircleCheck className="fill-success size-5 shrink-0 text-white" />
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <Button to="/diagrams" size="lg" className="mt-6">
                        Explore Diagrams
                        <ArrowRight className="size-5" />
                    </Button>
                </div>

                <div className="rounded-card shadow-card bg-white/80 p-4">
                    <SegmentedTabs
                        tabs={demoModeTabs}
                        activeTab={mode}
                        onChange={handleModeChange}
                    />

                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_14rem]">
                        <div
                            ref={stageRef}
                            className="border-line relative h-72 overflow-hidden rounded-2xl border bg-white sm:h-80"
                        >
                            <div
                                className="relative size-full origin-center transition-transform"
                                style={{ transform: `scale(${zoom})` }}
                            >
                                <AssetImage
                                    src="/images/landing/nephron.png"
                                    alt="Human nephron"
                                    className="size-full object-contain p-4"
                                    fallback={
                                        <div className="flex size-full items-center justify-center">
                                            <Microscope className="text-brand-purple/30 size-28" />
                                        </div>
                                    }
                                />
                                {nephronStructures.map((structure) => (
                                    <button
                                        key={structure.id}
                                        type="button"
                                        onClick={() => handleStructureClick(structure.id)}
                                        style={{ top: structure.top, left: structure.left }}
                                        className={cx(
                                            'border-info text-navy-900 absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-2 py-1 text-xs font-semibold shadow-sm',
                                            structure.id === selectedId &&
                                            'bg-brand-purple-soft ring-brand-purple ring-2',
                                        )}
                                    >
                                        {getLabelText(structure)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-line rounded-2xl border bg-white p-4">
                            <h3 className="mb-3 text-sm font-bold">Human Nephron</h3>
                            <StructureInfo
                                mode={mode}
                                structure={selectedStructure}
                                revealedCount={revealedIds.length}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
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
                        <ControlButton icon={RotateCcw} label="Reset" onClick={handleReset} />
                        <ControlButton icon={Maximize} label="Fullscreen" onClick={handleFullscreen} />
                    </div>
                </div>
            </div>
        </LandingSection>
    )
}

export default InteractiveDiagramDemo