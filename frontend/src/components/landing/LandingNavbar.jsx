import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import SearchInput from '@/components/common/SearchInput'
import NavDropdown from '@/components/landing/NavDropdown'
import { navLinks } from '@/data/landingContent'

const mobileLinkClasses =
    'hover:bg-brand-purple-soft block rounded-xl px-3 py-2 text-sm font-semibold'

function DesktopNavItem({ link }) {
    if (link.menu) {
        return <NavDropdown label={link.label} items={link.menu} />
    }

    if (link.href) {
        return (
            <a
                href={link.href}
                className="hover:bg-brand-purple-soft rounded-pill px-3 py-2 text-sm font-semibold"
            >
                {link.label}
            </a>
        )
    }

    const isHome = link.to === '/'

    return (
        <Link
            to={link.to}
            className={
                isHome
                    ? 'bg-action-orange rounded-pill px-4 py-2 text-sm font-semibold text-white'
                    : 'hover:bg-brand-purple-soft rounded-pill px-3 py-2 text-sm font-semibold'
            }
        >
            {link.label}
        </Link>
    )
}

function MobileNavItem({ link, onNavigate }) {
    if (link.menu) {
        return (
            <li>
                <p className="text-ink-500 px-3 pt-2 text-xs font-bold uppercase">
                    {link.label}
                </p>
                <ul>
                    {link.menu.map((item) => (
                        <li key={item.label}>
                            <Link to={item.to} onClick={onNavigate} className={mobileLinkClasses}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </li>
        )
    }

    return (
        <li>
            {link.href ? (
                <a href={link.href} onClick={onNavigate} className={mobileLinkClasses}>
                    {link.label}
                </a>
            ) : (
                <Link to={link.to} onClick={onNavigate} className={mobileLinkClasses}>
                    {link.label}
                </Link>
            )}
        </li>
    )
}

function LandingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const closeMenu = () => setIsMenuOpen(false)

    const handleSearch = (term) => {
        const trimmedTerm = term.trim()

        if (!trimmedTerm) {
            return
        }

        closeMenu()
        navigate(`/diagrams?q=${encodeURIComponent(trimmedTerm)}`)
    }

    return (
        <header className="border-line sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Logo size="sm" />

                <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <DesktopNavItem key={link.label} link={link} />
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        onSubmit={handleSearch}
                        placeholder="Search diagrams, topics or ask AI..."
                        className="hidden w-72 py-2 xl:flex"
                    />
                    <Link
                        to="/login"
                        className="hidden px-2 text-sm font-semibold sm:block"
                    >
                        Login
                    </Link>
                    <Button to="/signup" size="sm" className="hidden sm:inline-flex">
                        Sign Up
                    </Button>
                    <button
                        type="button"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((current) => !current)}
                        className="hover:bg-brand-purple-soft rounded-full p-2 lg:hidden"
                    >
                        {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="border-line border-t bg-white px-4 py-4 lg:hidden">
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        onSubmit={handleSearch}
                        placeholder="Search diagrams, topics or ask AI..."
                        className="mb-3 py-2"
                    />
                    <ul>
                        {navLinks.map((link) => (
                            <MobileNavItem key={link.label} link={link} onNavigate={closeMenu} />
                        ))}
                    </ul>
                    <div className="mt-3 flex gap-3 sm:hidden">
                        <Button to="/login" variant="outline" size="sm" className="flex-1">
                            Login
                        </Button>
                        <Button to="/signup" size="sm" className="flex-1">
                            Sign Up
                        </Button>
                    </div>
                </div>
            )}
        </header>
    )
}

export default LandingNavbar