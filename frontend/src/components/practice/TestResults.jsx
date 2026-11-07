import { useState } from 'react'
import { Bookmark, CircleCheck, CircleX, Minus } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ProgressRing from '@/components/common/ProgressRing'
import Tabs from '@/components/common/Tabs'
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle'
import { cx } from '@/utils/classNames'
import { questionToBookmark } from '@/utils/bookmarkItems'
import { formatTimer } from '@/utils/formatters'
import { describeSource } from '@/utils/questionSource'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function getOptionClasses({ optionIndex, detail }) {
    if (optionIndex === detail.question.correctIndex) {
        return 'border-success/40 bg-success-soft'
    }

    if (optionIndex === detail.selectedIndex) {
        return 'border-danger/40 bg-danger-soft'
    }

    return 'border-line bg-white'
}

function StatusBadge({ detail }) {
    if (!detail.isAnswered) {
        return (
            <Badge tone="neutral">
                <Minus className="mr-1 size-3" />
                Skipped
            </Badge>
        )
    }

    return detail.isCorrect ? (
        <Badge tone="success">
            <CircleCheck className="mr-1 size-3" />
            Correct
        </Badge>
    ) : (
        <Badge tone="danger">
            <CircleX className="mr-1 size-3" />
            Incorrect
        </Badge>
    )
}

function TestResults({ test, evaluation, timeTakenSec, onRetry, onBack }) {
    const [filter, setFilter] = useState('all')
    const { isBookmarked, toggle } = useBookmarkToggle()

    const filterTabs = [
        { id: 'all', label: `All (${evaluation.details.length})` },
        { id: 'wrong', label: `Incorrect (${evaluation.wrong})` },
        { id: 'skipped', label: `Skipped (${evaluation.unattempted})` },
    ]

    const visibleDetails = evaluation.details.filter((detail) => {
        if (filter === 'wrong') {
            return detail.isAnswered && !detail.isCorrect
        }

        if (filter === 'skipped') {
            return !detail.isAnswered
        }

        return true
    })

    const stats = [
        { label: 'Correct', value: evaluation.correct, className: 'text-success' },
        { label: 'Incorrect', value: evaluation.wrong, className: 'text-danger' },
        { label: 'Skipped', value: evaluation.unattempted, className: 'text-ink-500' },
        { label: 'Time taken', value: formatTimer(timeTakenSec), className: 'text-info' },
    ]

    return (
        <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
            <Card className="flex flex-wrap items-center gap-6 p-6">
                <ProgressRing value={evaluation.accuracy} size={140}>
                    <span className="text-3xl font-extrabold">{evaluation.accuracy}%</span>
                    <span className="text-ink-700 text-xs">Accuracy</span>
                </ProgressRing>

                <div className="min-w-60 flex-1">
                    <h1 className="text-2xl font-extrabold">{test.title} – Results</h1>
                    <p className="mt-1 text-lg font-bold">
                        Score: {evaluation.score} / {evaluation.maxScore}
                        <span className="text-ink-500 ml-2 text-xs font-medium">(+4 correct, −1 wrong)</span>
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {stats.map(({ label, value, className }) => (
                            <div key={label} className="bg-page rounded-xl px-3 py-2 text-center">
                                <dd className={cx('text-xl font-extrabold', className)}>{value}</dd>
                                <dt className="text-ink-700 text-xs">{label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="flex flex-col gap-3">
                    <Button onClick={onRetry}>Try Again</Button>
                    <Button variant="outline" onClick={onBack}>
                        Back to Practice
                    </Button>
                </div>
            </Card>

            <Tabs tabs={filterTabs} activeTab={filter} onChange={setFilter} />

            <ul className="space-y-4">
                {visibleDetails.map((detail) => {
                    const { question } = detail
                    const bookmarkItem = questionToBookmark(question)
                    const saved = isBookmarked(bookmarkItem.id)
                    const number = evaluation.details.indexOf(detail) + 1

                    return (
                        <li key={question.id}>
                            <Card className="space-y-3 p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-ink-700 text-sm font-bold">Question {number}</span>
                                        <StatusBadge detail={detail} />
                                    </div>
                                    <button
                                        type="button"
                                        aria-label={saved ? 'Remove question bookmark' : 'Bookmark question'}
                                        aria-pressed={saved}
                                        onClick={() => toggle(bookmarkItem)}
                                        className="hover:bg-brand-purple-soft rounded-full p-1.5"
                                    >
                                        <Bookmark className={cx('size-5', saved && 'fill-brand-orange text-brand-orange')} />
                                    </button>
                                </div>

                                <p className="font-bold">{question.text}</p>

                                <ul className="space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                        <li
                                            key={option}
                                            className={cx(
                                                'flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium',
                                                getOptionClasses({ optionIndex, detail }),
                                            )}
                                        >
                                            <span className="border-line flex size-6 shrink-0 items-center justify-center rounded-full border bg-white text-xs">
                                                {OPTION_LABELS[optionIndex]}
                                            </span>
                                            <span className="flex-1">
                                                {option}
                                                {question.optionNotes[optionIndex] && (
                                                    <span className="text-ink-700 mt-0.5 block text-xs font-normal">
                                                        {question.optionNotes[optionIndex]}
                                                    </span>
                                                )}
                                            </span>
                                            {optionIndex === question.correctIndex && (
                                                <CircleCheck className="fill-success size-5 text-white" />
                                            )}
                                            {optionIndex === detail.selectedIndex && !detail.isCorrect && (
                                                <CircleX className="fill-danger size-5 text-white" />
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <p className="text-ink-700 text-sm">
                                    <strong>Explanation:</strong> {question.explanation}
                                </p>
                                <p className="text-ink-500 text-xs">Source: {describeSource(question.source)}</p>
                            </Card>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default TestResults