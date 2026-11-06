import { useState } from 'react'
import { CircleCheck, CircleX, HeartPulse, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import { landingQuestion } from '@/data/landingContent'
import { cx } from '@/utils/classNames'

function getOptionClasses({ id, selectedId, isChecked }) {
    const isCorrect = id === landingQuestion.correctId
    const isSelected = id === selectedId

    if (isChecked && isCorrect) {
        return 'border-success/40 bg-success-soft'
    }

    if (isChecked && isSelected) {
        return 'border-danger/40 bg-danger-soft'
    }

    if (isSelected) {
        return 'border-brand-purple bg-brand-purple-soft'
    }

    return 'border-line bg-white/80 hover:bg-brand-purple-soft'
}

function PracticeCard() {
    const [selectedId, setSelectedId] = useState(null)
    const [isChecked, setIsChecked] = useState(false)

    const handleSelect = (optionId) => {
        if (!isChecked) {
            setSelectedId(optionId)
        }
    }

    const handleCheck = () => {
        if (isChecked) {
            setSelectedId(null)
            setIsChecked(false)
            return
        }

        if (!selectedId) {
            toast.error('Select an option first.')
            return
        }

        setIsChecked(true)

        if (selectedId === landingQuestion.correctId) {
            toast.success('Correct answer!')
        } else {
            toast.error('Not quite. The correct answer is highlighted.')
        }
    }

    return (
        <section className="rounded-card border-line shadow-card border bg-linear-to-br from-[#fff0e0] to-[#fff8f1] p-6">
            <div className="flex items-start gap-3">
                <Target className="text-brand-orange size-12 shrink-0" />
                <div>
                    <h2 className="text-xl font-extrabold">Practice & Test your Knowledge</h2>
                    <p className="text-ink-700 text-sm">
                        Solve diagram-based questions, identify structures and get instant
                        feedback.
                    </p>
                </div>
            </div>

            <div className="border-line mt-4 grid gap-4 rounded-2xl border bg-white/80 p-4 sm:grid-cols-[10rem_1fr]">
                <div className="flex items-center justify-center">
                    <AssetImage
                        src={landingQuestion.image}
                        alt="Heart diagram with a highlighted part"
                        className="max-h-40 object-contain"
                        fallback={<HeartPulse className="text-danger/40 size-24" />}
                    />
                </div>

                <div>
                    <p className="text-xs font-bold">Q. {landingQuestion.prompt}</p>
                    <ul className="mt-3 space-y-2">
                        {landingQuestion.options.map(({ id, text }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    aria-pressed={id === selectedId}
                                    onClick={() => handleSelect(id)}
                                    className={cx(
                                        'flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-xs font-semibold',
                                        getOptionClasses({ id, selectedId, isChecked }),
                                    )}
                                >
                                    <span className="border-line flex size-6 shrink-0 items-center justify-center rounded-full border bg-white">
                                        {id}
                                    </span>
                                    <span className="flex-1">{text}</span>
                                    {isChecked && id === landingQuestion.correctId && (
                                        <CircleCheck className="fill-success size-5 text-white" />
                                    )}
                                    {isChecked &&
                                        id === selectedId &&
                                        id !== landingQuestion.correctId && (
                                            <CircleX className="fill-danger size-5 text-white" />
                                        )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center justify-between gap-3 sm:col-span-2">
                    <Button onClick={handleCheck} className="flex-1">
                        {isChecked ? 'Try Again' : 'Check Answer'}
                    </Button>
                    <span className="text-ink-700 shrink-0 text-xs font-bold">
                        {landingQuestion.position}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default PracticeCard