import { ArrowRight } from 'lucide-react'
import { practiceSubjects } from '@/data/mockPractice'
import { cx } from '@/utils/classNames'

function SubjectModeGrid({ counts, onStart }) {
    return (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {practiceSubjects.map((subject) => {
                const questionCount = counts[subject.id] ?? 0

                return (
                    <li key={subject.id}>
                        <button
                            type="button"
                            disabled={questionCount === 0}
                            onClick={() => onStart(subject)}
                            className={cx(
                                'border-line flex h-full w-full items-center gap-3 rounded-2xl border bg-linear-to-br p-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50',
                                subject.tint,
                            )}
                        >
                            <subject.icon className={cx('size-10 shrink-0', subject.iconTone)} />
                            <span className="flex-1">
                                <span className="block leading-tight font-extrabold">{subject.label}</span>
                                <span className="text-ink-700 text-xs">{questionCount} Questions</span>
                            </span>
                            <span className="shadow-card flex size-8 items-center justify-center rounded-full bg-white">
                                <ArrowRight className="size-4" />
                            </span>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}

export default SubjectModeGrid