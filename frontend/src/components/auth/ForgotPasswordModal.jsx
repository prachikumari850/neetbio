import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthField from '@/components/auth/AuthField'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { useForm } from '@/hooks/useForm'
import { requestPasswordReset } from '@/services/authService'
import { getEmailError } from '@/utils/validators'

function validateResetForm({ email }) {
    const emailError = getEmailError(email)
    return emailError ? { email: emailError } : {}
}

function ForgotPasswordForm({ onClose }) {
    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: { email: '' },
        validate: validateResetForm,
        onSubmit: async ({ email }) => {
            await requestPasswordReset(email)
            toast.success(`Reset link sent to ${email.trim()} (simulated).`)
            onClose()
        },
    })

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <p className="text-ink-700 text-sm">
                Enter the email linked to your account and we’ll send you a link to reset
                your password.
            </p>
            <AuthField
                id="reset-email"
                name="email"
                type="email"
                label="Email Address"
                icon={Mail}
                placeholder="Enter your email address"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
            />
            <Button type="submit" variant="orange" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
        </form>
    )
}

function ForgotPasswordModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} title="Forgot your password?" onClose={onClose}>
            <ForgotPasswordForm onClose={onClose} />
        </Modal>
    )
}

export default ForgotPasswordModal