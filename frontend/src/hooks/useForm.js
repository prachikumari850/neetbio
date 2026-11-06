import { useState } from 'react'

export function useForm({ initialValues, validate, onSubmit }) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setValues((current) => ({ ...current, [name]: value }))
        setErrors((current) => ({ ...current, [name]: undefined }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const validationErrors = validate(values)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(values)
        } finally {
            setIsSubmitting(false)
        }
    }

    return { values, errors, isSubmitting, handleChange, handleSubmit }
}