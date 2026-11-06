import { useState } from 'react'
import { ArrowRight, CircleCheck, Mail, Phone, User, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import AuthField from '@/components/auth/AuthField'
import PasswordField from '@/components/auth/PasswordField'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import { signupBenefits } from '@/data/authContent'
import { useForm } from '@/hooks/useForm'
import { signup } from '@/services/authService'
import { useUserStore } from '@/store/useUserStore'
import { validateSignup } from '@/utils/validators'

const initialValues = {
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
}

function Signup() {
    const [formError, setFormError] = useState('')
    const navigate = useNavigate()
    const setUser = useUserStore((state) => state.setUser)

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues,
        validate: validateSignup,
        onSubmit: async (details) => {
            setFormError('')

            try {
                const user = await signup(details)
                setUser(user)
                toast.success(`Account created. Welcome to NEETBIO, ${user.name}!`)
                navigate('/dashboard')
            } catch (error) {
                setFormError(error.message)
            }
        },
    })

    return (
        <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
            <aside className="relative hidden flex-col overflow-hidden bg-linear-to-br from-[#2a1470] via-[#4a22b8] to-[#8b5cf6] p-10 text-white lg:flex">
                <Logo tone="light" />

                <h1 className="mt-14 text-6xl font-extrabold">
                    Join NEET<span className="text-brand-orange">BIO</span>
                </h1>
                <p className="mt-4 max-w-md text-2xl font-medium">
                    Create your account and start your Biology learning journey for NEET.
                </p>

                <ul className="mt-8 space-y-3">
                    {signupBenefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3 font-medium">
                            <CircleCheck className="fill-success size-8 shrink-0 text-white" />
                            {benefit}
                        </li>
                    ))}
                </ul>

                <AssetImage
                    src="/images/auth/signup-hero.png"
                    className="pointer-events-none mt-auto max-h-96 self-start object-contain"
                />
            </aside>

            <section className="flex items-center justify-center bg-linear-to-br from-[#f3ecff] to-white px-4 py-8">
                <div className="rounded-[2rem] border-line shadow-raised w-full max-w-xl border bg-white/90 p-6 sm:p-8">
                    <div className="mb-4 flex justify-center lg:hidden">
                        <Logo size="sm" />
                    </div>
                    <UserPlus className="mx-auto hidden size-9 lg:block" />
                    <h2 className="mt-2 text-center text-3xl font-extrabold">
                        Create Your <span className="text-brand-orange">Account</span>
                    </h2>
                    <p className="text-ink-700 mt-2 text-center text-sm">
                        Join thousands of NEET aspirants learning Biology smarter.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-3">
                        <AuthField
                            id="fullName"
                            name="fullName"
                            type="text"
                            label="Full Name"
                            icon={User}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            value={values.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                        />
                        <AuthField
                            id="email"
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
                        <AuthField
                            id="mobile"
                            name="mobile"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            label="Mobile Number"
                            icon={Phone}
                            placeholder="Enter 10-digit mobile number"
                            autoComplete="tel"
                            value={values.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                        />
                        <PasswordField
                            id="password"
                            name="password"
                            label="Password"
                            placeholder="Create a password"
                            autoComplete="new-password"
                            value={values.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <PasswordField
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />

                        {formError && (
                            <p
                                role="alert"
                                className="bg-danger-soft text-danger rounded-xl px-4 py-3 text-sm font-semibold"
                            >
                                {formError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant="purple"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                            {!isSubmitting && <ArrowRight className="size-5" />}
                        </Button>
                    </form>

                    <div className="mt-5">
                        <SocialAuthButtons
                            providers={['google', 'microsoft']}
                            dividerLabel="Or sign up with"
                            showPrefix
                        />
                    </div>

                    <p className="mt-5 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-purple font-bold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Signup