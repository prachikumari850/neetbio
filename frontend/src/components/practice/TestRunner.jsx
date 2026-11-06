import { useState } from 'react'
import { ChevronLeft, ChevronRight, Flag, Timer } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ConfirmModal from '@/components/common/ConfirmModal'
import { practiceSubjects } from '@/data/mockPractice'
import { useCountdown } from '@/hooks/useCountdown'
import { cx } from '@/utils/classNames'
import { formatTimer } from '@/utils/formatters'

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const LOW_TIME_SECONDS = 60

function getPaletteClasses({ isCurrent, isFlagged, isAnswered }) {
    const stateClasses = isFlagged
        ? 'bg-brand-orange border-brand-orange text-white'
        : isAnswered
            ? 'bg-brand-purple border-brand-purple text-white'
            : 'border-line bg-white'

    return cx(
        'size-10 rounded-xl border text-sm font-bold',
        stateClasses,
        isCurrent && 'ring-brand-purple ring-2 ring-offset-2',
    )
}

function TestRunner({ test, onSubmit, onExit }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [flaggedIds, setFlaggedIds] = useState([])
    const [dialog, setDialog] = useState(null)

    const remaining = useCountdown(test.durationSec, () =>
        onSubmit({ answers, timeTakenSec: test.durationSec }),
    )

    const question = test.questions[currentIndex]
    const subject = practiceSubjects.find((item) => item.id === question.subject)
    const answeredCount = Object.keys(answers).length
    const isLastQuestion = currentIndex === test.questions.length - 1
    const isFlagged = flaggedIds.includes(question.id)

    const selectOption = (optionIndex) => {
        setAnswers((current) => {
            const next = { ...current }

            if (current[question.id] === optionIndex) {
                delete next[question.id]
            } else {
                next[question.id] = optionIndex
            }

            return next
        })
    }

    const toggleFlag = () => {
        setFlaggedIds((current) =>
            isFlagged ? current.filter((id) => id !== question.id) : [...current, question.id],
        )
    }

    const submitNow = () =>
        onSubmit({ answers, timeTakenSec: test.durationSec - remaining })

    const unansweredCount = test.questions.length - answeredCount

    return (
        <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-extrabold">{test.title}</h1>
                <div className="flex items-center gap-3">
                    <span
                        className={cx(
                            'rounded-pill flex items-center gap-2 px-4 py-2 text-sm font-bold',
                            remaining <= LOW_TIME_SECONDS
                                ? 'bg-danger-soft text-danger'
                                : 'bg-brand-purple-soft text-brand-purple',
                        )}
                    >
                        <Timer className="size-5" />
                        {formatTimer(remaining)}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setDialog('exit')}>
                        Exit
                    </Button>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
                <Card className="space-y-5 p-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-ink-700 text-sm font-bold">
                            Question {currentIndex + 1} of {test.questions.length}
                        </span>
                        {subject && <Badge>{subject.label}</Badge>}
                        <Badge tone="info" className="capitalize">
                            {question.difficulty}
                        </Badge>
                    </div>

                    <p className="text-lg font-bold">{question.text}</p>

                    <ul className="space-y-3">
                        {question.options.map((option, optionIndex) => {
                            const isSelected = answers[question.id] === optionIndex

                            return (
                                <li key={option}>
                                    <button
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => selectOption(optionIndex)}
                                        className={cx(
                                            'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition',
                                            isSelected
                                                ? 'border-brand-purple bg-brand-purple-soft'
                                                : 'border-line hover:bg-page bg-white',
                                        )}
                                    >
                                        <span
                                            className={cx(
                                                'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs',
                                                isSelected ? 'bg-brand-purple border-brand-purple text-white' : 'border-line',
                                            )}
                                        >
                                            {OPTION_LABELS[optionIndex]}
                                        </span>
                                        {option}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                            variant="outline"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((index) => index - 1)}
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </Button>
                        <Button variant={isFlagged ? 'soft' : 'outline'} onClick={toggleFlag}>
                            <Flag className="size-4" />
                            {isFlagged ? 'Unflag' : 'Flag for review'}
                        </Button>
                        {isLastQuestion ? (
                            <Button variant="purple" onClick={() => setDialog('submit')}>
                                Submit Test
                            </Button>
                        ) : (
                            <Button onClick={() => setCurrentIndex((index) => index + 1)}>
                                Next
                                <ChevronRight className="size-4" />
                            </Button>
                        )}
                    </div>
                </Card>

                <Card as="aside" className="h-fit space-y-4 p-5">
                    <h2 className="font-extrabold">Question Palette</h2>
                    <ul className="flex flex-wrap gap-2">
                        {test.questions.map((item, index) => (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    aria-label={`Go to question ${index + 1}`}
                                    onClick={() => setCurrentIndex(index)}
                                    className={getPaletteClasses({
                                        isCurrent: index === currentIndex,
                                        isFlagged: flaggedIds.includes(item.id),
                                        isAnswered: answers[item.id] !== undefined,
                                    })}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <ul className="text-ink-700 space-y-1 text-xs">
                        <li><span className="bg-brand-purple mr-2 inline-block size-3 rounded" />Answered</li>
                        <li><span className="bg-brand-orange mr-2 inline-block size-3 rounded" />Flagged</li>
                        <li><span className="border-line mr-2 inline-block size-3 rounded border" />Not answered</li>
                    </ul>
                    <p className="text-sm font-semibold">
                        {answeredCount} of {test.questions.length} answered
                    </p>
                    <Button variant="purple" className="w-full" onClick={() => setDialog('submit')}>
                        Submit Test
                    </Button>
                </Card>
            </div>

            <ConfirmModal
                isOpen={dialog === 'submit'}
                title="Submit test?"
                message={
                    unansweredCount > 0
                        ? `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Submit anyway?`
                        : 'You have answered every question. Submit your test now?'
                }
                confirmLabel="Submit"
                onConfirm={submitNow}
                onCancel={() => setDialog(null)}
            />
            <ConfirmModal
                isOpen={dialog === 'exit'}
                title="Leave this test?"
                message="Your answers will be lost and the attempt will not be saved."
                confirmLabel="Leave"
                onConfirm={onExit}
                onCancel={() => setDialog(null)}
            />
        </div>
    )
}

export default TestRunner