import { useRef, useState } from 'react'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '@/components/common/Avatar'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useUserStore } from '@/store/useUserStore'

const menuItemClasses =
    'hover:bg-brand-purple-soft flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold'

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()
    const user = useUserStore((state) => state.user)

    useClickOutside(menuRef, () => setIsOpen(false))

    const handleLogout = () => {
        setIsOpen(false)
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                aria-label="Account menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className="hover:bg-brand-purple-soft flex items-center gap-3 rounded-full p-1 sm:pr-3"
            >
                <Avatar name={user.name} src={user.avatar} />
                <span className="hidden text-left leading-tight md:block">
                    <span className="block text-base font-bold">Hi, {user.name} 👋</span>
                    <span className="text-ink-700 block text-sm">{user.role}</span>
                </span>
                <ChevronDown className="hidden size-5 sm:block" />
            </button>

            {isOpen && (
                <div className="rounded-card border-line shadow-raised absolute right-0 z-40 mt-2 w-56 border bg-white p-2">
                    <Link
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className={menuItemClasses}
                    >
                        <Settings className="size-5" />
                        Account settings
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`${menuItemClasses} text-danger`}
                    >
                        <LogOut className="size-5" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserMenu