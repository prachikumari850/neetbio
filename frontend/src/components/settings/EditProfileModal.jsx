import { Mail, Phone, User } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthField from '@/components/auth/AuthField'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { useForm } from '@/hooks/useForm'
import { updateProfile } from '@/services/userService'
import { useUserStore } from '@/store/useUserStore'
import { getEmailError, getMobileError } from '@/utils/validators'

function validateProfile({ name, email, phone }) {
    const errors = {}

    if (name.trim().length < 2) {
        errors.name = 'Enter your name.'
    }

    const emailError = getEmailError(email)
    if (emailError) {
        errors.email = emailError
    }

    const phoneError = getMobileError(phone)
    if (phoneError) {
        errors.phone = phoneError
    }

    return errors
}

function ProfileForm({ onClose }) {
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: {
            name: user.fullName || user.name,
            email: user.email,
            phone: user.mobile,
        },
        validate: validateProfile,
        onSubmit: async ({ name, email, phone }) => {
            try {
                const updatedUser = await updateProfile({
                    name: name.trim(),
                    email: email.trim(),
                    mobile: phone.trim(),
                })
                setUser(updatedUser)
                toast.success('Profile updated')
                onClose()
            } catch (error) {
                toast.error(error.message)
            }
        },
    })

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AuthField
                id="profile-name"
                name="name"
                label="Name"
                icon={User}
                value={values.name}
                onChange={handleChange}
                error={errors.name}
            />
            <AuthField
                id="profile-email"
                name="email"
                type="email"
                label="Email Address"
                icon={Mail}
                value={values.email}
                onChange={handleChange}
                error={errors.email}
            />
            <AuthField
                id="profile-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                label="Mobile Number"
                icon={Phone}
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    )
}

function EditProfileModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} title="Edit profile" onClose={onClose}>
            <ProfileForm onClose={onClose} />
        </Modal>
    )
}

export default EditProfileModal