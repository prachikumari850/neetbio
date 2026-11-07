import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import SelectField from '@/components/common/SelectField'
import { difficultyOptions, practiceSubjects, questionCountOptions } from '@/data/mockPractice'

function CustomTestForm({ onStart }) {
    const [areas, setAreas] = useState([])
    const [count, setCount] = useState('10')
    const [difficulty, setDifficulty] = useState('mixed')

    const toggleArea = (areaId) => {
        setAreas((current) =>
            current.includes(areaId)
                ? current.filter((id) => id !== areaId)
                : [...current, areaId],
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (areas.length === 0) {
            toast.error('Choose at least one subject.')
            return
        }

        onStart({ mode: 'custom', areas, count: Number(count), difficulty })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
                <legend className="mb-2 font-bold">Choose subjects</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                    {practiceSubjects.map((subject) => (
                        <label
                            key={subject.id}
                            className="border-line flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2 text-sm font-semibold"
                        >
                            <input
                                type="checkbox"
                                checked={areas.includes(subject.id)}
                                onChange={() => toggleArea(subject.id)}
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