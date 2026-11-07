import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { goalFields } from '@/data/learningConfig'
import { useForm } from '@/hooks/useForm'
import { saveGoalTargets } from '@/services/learningService'
import { useLearningStore } from '@/store/useLearningStore'

function validateGoals(values) {
    const errors = {}

    goalFields.forEach(({ key, min, max }) => {
        const value = Number(values[key])

        if (!Number.isInteger(value) || value < min || value > max) {
            errors[key] = `Enter a whole number from ${min} to ${max}.`
        }
    })

    return errors
}

function GoalsForm({ targets, onClose }) {
    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: Object.fromEntries(goalFields.map(({ key }) => [key, String(targets[key])])),
        validate: validateGoals,
        onSubmit: async (formValues) => {
            try {
                await saveGoalTargets(
                    Object.fromEntries(goalFields.map(({ key }) => [key, Number(formValues[key])])),
                )
                await useLearningStore.getState().load()
                toast.success('Daily goals updated')
                onClose()
            } catch (error) {
                toast.error(error.message)
            }
        },
    })

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {goalFields.map(({ key, label, min, max }) => (
                <div key={key}>
                    <label htmlFor={`goal-${key}`} className="mb-1 block text-sm font-bold">
                        {label}
                    </label>
                    <input
                        id={`goal-${key}`}
                        name={key}
                        type="number"
                        min={min}
                        max={max}
                        value={values[key]}
                        onChange={handleChange}
                        className="border-line focus:ring-brand-purple/40 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2"
                    />
                    {errors[key] && (
                        <p role="alert" className="text-danger mt-1 text-xs">
                            {errors[key]}
                        </p>
                    )}
                </div>
            ))}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save goals'}
            </Button>
        </form>
    )
}

function EditGoalsModal({ isOpen, targets, onClose }) {
    return (
        <Modal isOpen={isOpen} title="Edit daily goals" onClose={onClose}>
            <GoalsForm targets={targets} onClose={onClose} />
        </Modal>
    )
}

export default EditGoalsModal