import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useClickOutside } from '@/hooks/useClickOutside'

function NavDropdown({ label, items }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useClickOutside(dropdownRef, () => setIsOpen(false))

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className="hover:bg-brand-purple-soft rounded-pill flex items-center gap-1 px-3 py-2 text-sm font-semibold"
            >
                {label}
                <ChevronDown className="size-4" />
            </button>

            {isOpen && (
                <ul className="rounded-card border-line shadow-raised absolute left-0 z-50 mt-2 w-52 border bg-white p-2">
                    {items.map((item) => (
                        <li key={item.label}>
                            <Link
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-brand-purple-soft block rounded-xl px-3 py-2 text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default NavDropdown