import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { footerColumns, footerSocials } from '@/data/landingContent'
import { getEmailError } from '@/utils/validators'

const linkClasses = 'text-sm text-white/80 hover:text-white'

function FooterLink({ link }) {
    if (link.to) {
        return (
            <Link to={link.to} className={linkClasses}>
                {link.label}
            </Link>
        )
    }

    return (
        <button
            type="button"
            onClick={() => toast('This page will be added soon.')}
            className={`${linkClasses} text-left`}
        >
            {link.label}
        </button>
    )
}

function SubscribeForm() {
    const [email, setEmail] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        const emailError = getEmailError(email)

        if (emailError) {
            toast.error(emailError)
            return
        }

        toast.success('Thanks for subscribing (simulated).')
        setEmail('')
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-3 flex overflow-hidden rounded-lg bg-white"
        >
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="text-ink-900 placeholder:text-ink-500 min-w-0 flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
                type="submit"
                className="bg-action-orange px-4 text-sm font-bold text-white"
            >
                Subscribe
            </button>
        </form>
    )
}

function LandingFooter() {
    return (
        <footer className="bg-navy-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.4fr] lg:px-8">
                <div>
                    <Logo tone="light" size="sm" />
                    <p className="mt-4 max-w-xs text-sm text-white/80">
                        A free, AI-powered platform to learn, explore and practice Biology
                        diagrams for NEET aspirants.
                    </p>
                    <div className="mt-4 flex gap-3">
                        {footerSocials.map(({ label, icon: Icon, tone }) => (
                            <button
                                key={label}
                                type="button"
                                aria-label={label}
                                onClick={() => toast('Social links will be added at launch.')}
                                className={`${tone} flex size-8 items-center justify-center rounded-full text-white`}
                            >
                                <Icon className="size-4" />
                            </button>
                        ))}
                    </div>
                </div>

                {footerColumns.map(({ title, links }) => (
                    <nav key={title} aria-label={title}>
                        <h3 className="font-bold">{title}</h3>
                        <ul className="mt-3 flex flex-col gap-2">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <FooterLink link={link} />
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}

                <div>
                    <h3 className="font-bold">Stay Updated</h3>
                    <p className="mt-2 text-sm text-white/80">
                        Get notified about new diagrams and features.
                    </p>
                    <SubscribeForm />
                </div>
            </div>

            <div className="border-t border-white/15">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-white/70 sm:px-6 lg:px-8">
                    <p>
                        © {new Date().getFullYear()} NEETBIO. All rights reserved. Free for
                        educational use.
                    </p>
                    <p>Made for NEET Aspirants | Learn • Practice • Grow</p>
                </div>
            </div>
        </footer>
    )
}

export default LandingFooter