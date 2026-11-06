import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import SelectField from '@/components/common/SelectField'
import { difficultyOptions, practiceSubjects, questionCountOptions } from '@/data/mockPractice'

function CustomTestForm({ onStart }) {
    const [subjectIds, setSubjectIds] = useState([])
    const [count, setCount] = useState('10')
    const [difficulty, setDifficulty] = useState('mixed')

    const toggleSubject = (subjectId) => {
        setSubjectIds((current) =>
            current.includes(subjectId)
                ? current.filter((id) => id !== subjectId)
                : [...current, subjectId],
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (subjectIds.length === 0) {
            toast.error('Choose at least one subject.')
            return
        }

        onStart({
            id: 'custom',
            title: 'Custom Test',
            subjects: subjectIds,
            count: Number(count),
            durationMin: Number(count),
            difficulty,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
                <legend className="mb-2 font-bold">Choose chapters / subjects</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                    {practiceSubjects.map((subject) => (
                        <label
                            key={subject.id}
                            className="border-line flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2 text-sm font-semibold"
                        >
                            <input
                                type="checkbox"
                                checked={subjectIds.includes(subject.id)}
                                onChange={() => toggleSubject(subject.id)}
                                className="accent-brand-purple size-4"
                            />
                            {subject.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                    id="custom-count"
                    label="Number of questions"
                    value={count}
                    onChange={setCount}
                    options={questionCountOptions}
                />
                <SelectField
                    id="custom-difficulty"
                    label="Difficulty level"
                    value={difficulty}
                    onChange={setDifficulty}
                    options={difficultyOptions}
                />
            </div>

            <p className="text-ink-500 text-xs">
                If fewer questions match your choices, the test uses all that are available.
            </p>

            <Button type="submit" variant="purple" className="w-full">
                Create Test
                <ArrowRight className="size-4" />
            </Button>
        </form>
    )
}

export default CustomTestForm