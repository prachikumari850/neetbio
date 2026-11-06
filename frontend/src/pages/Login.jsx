import { useState } from 'react'
import { ArrowRight, GraduationCap, House, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import AuthField from '@/components/auth/AuthField'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal'
import PasswordField from '@/components/auth/PasswordField'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'
import AssetImage from '@/components/common/AssetImage'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import { loginFeatures } from '@/data/authContent'
import { useForm } from '@/hooks/useForm'
import { login } from '@/services/authService'
import { useUserStore } from '@/store/useUserStore'
import { validateLogin } from '@/utils/validators'

function Login() {
    const [formError, setFormError] = useState('')
    const [isResetOpen, setIsResetOpen] = useState(false)
    const navigate = useNavigate()
    const setUser = useUserStore((state) => state.setUser)

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: { identifier: '', password: '' },
        validate: validateLogin,
        onSubmit: async (credentials) => {
            setFormError('')

            try {
                const user = await login(credentials)
                setUser(user)
                toast.success(`Welcome back, ${user.name}!`)
                navigate('/dashboard')
            } catch (error) {
                setFormError(error.message)
            }
        },
    })

    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-white via-[#f3ecff] to-[#e6d9ff]">
            <Link
                to="/"
                className="rounded-pill border-brand-purple/30 shadow-card hover:bg-brand-purple-soft absolute top-5 right-4 z-10 flex items-center gap-2 border bg-white/80 px-5 py-2.5 text-sm font-bold sm:right-8"
            >
                <House className="size-5" />
                Back to Home
            </Link>

            <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-20 lg:grid-cols-[1fr_1.05fr] lg:px-8">
                <section className="hidden lg:block">
                    <Logo />

                    <span className="rounded-pill bg-brand-purple-soft mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold">
                        <GraduationCap className="size-5" />
                        Your <span className="text-brand-orange">Free</span> Biology
                        Companion for NEET
                    </span>

                    <h1 className="mt-6 text-5xl leading-tight font-extrabold">
                        Learn, Practice & Master
                        <span className="text-brand-orange relative mt-1 block w-fit italic">
                            NEET Biology
                            <span className="bg-brand-orange rounded-pill absolute -bottom-1 left-0 h-1 w-4/5" />
                        </span>
                    </h1>

                    <p className="text-ink-700 mt-6 max-w-md text-lg">
                        Explore interactive diagrams, AI-powered learning and personalized
                        practice — all in one place.
                    </p>

                    <ul className="mt-6 space-y-3">
                        {loginFeatures.map(({ id, icon: Icon, label, tone }) => (
                            <li key={id} className="flex items-center gap-4 font-bold">
                                <span
                                    className={`flex size-11 items-center justify-center rounded-xl ${tone}`}
                                >
                                    <Icon className="size-6" />
                                </span>
                                {label}
                            </li>
                        ))}
                    </ul>

                    <AssetImage
                        src="/images/auth/login-hero.png"
                        className="pointer-events-none mt-6 max-h-72 object-contain"
                    />
                </section>

                <section className="rounded-[2rem] border-line shadow-raised mx-auto w-full max-w-xl border bg-white/90 p-6 sm:p-10">
                    <div className="flex justify-center">
                        <Logo size="sm" />
                    </div>
                    <h2 className="mt-4 text-center text-3xl font-extrabold">
                        Welcome Back! 👋
                    </h2>
                    <p className="text-ink-700 mt-2 text-center text-sm">
                        Log in to continue your NEET Biology learning journey.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                        <AuthField
                            id="identifier"
                            name="identifier"
                            type="text"
                            label="Email or Username"
                            icon={Mail}
                            outerIcon={User}
                            placeholder="Enter your email or username"
                            autoComplete="username"
                            value={values.identifier}
                            onChange={handleChange}
                            error={errors.identifier}
                        />
                        <PasswordField
                            id="password"
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsResetOpen(true)}
                                className="text-brand-orange text-sm font-bold hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

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
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Log In'}
                            {!isSubmitting && <ArrowRight className="size-5" />}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <SocialAuthButtons
                            providers={['google', 'microsoft', 'github']}
                            dividerLabel="or continue with"
                        />
                    </div>

                    <p className="mt-6 text-center text-sm">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="text-brand-orange font-bold underline">
                            Sign Up
                        </Link>
                    </p>
                </section>
            </div>

            <ForgotPasswordModal
                isOpen={isResetOpen}
                onClose={() => setIsResetOpen(false)}
            />
        </main>
    )
}

export default Login