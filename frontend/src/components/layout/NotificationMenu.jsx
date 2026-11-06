import { useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { mockNotifications } from '@/data/mockNotifications'
import { useClickOutside } from '@/hooks/useClickOutside'

function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState(mockNotifications)
    const menuRef = useRef(null)

    useClickOutside(menuRef, () => setIsOpen(false))

    const hasNotifications = notifications.length > 0

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                aria-label="Notifications"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                className="text-ink-900 hover:bg-brand-purple-soft relative rounded-full p-2"
            >
                <Bell className="size-6" />
                {hasNotifications && (
                    <span className="bg-danger absolute top-1.5 right-1.5 size-2.5 rounded-full ring-2 ring-white" />
                )}
            </button>

            {isOpen && (
                <div className="rounded-card border-line shadow-raised absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] border bg-white p-3">
                    <div className="mb-2 flex items-center justify-between px-2">
                        <h2 className="text-sm font-bold">Notifications</h2>
                        {hasNotifications && (
                            <button
                                type="button"
                                onClick={() => setNotifications([])}
                                className="text-brand-purple text-xs font-semibold hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {hasNotifications ? (
                        <ul className="space-y-1">
                            {notifications.map(({ id, title, message, time }) => (
                                <li key={id} className="hover:bg-page rounded-xl px-2 py-2">
                                    <p className="text-sm font-semibold">{title}</p>
                                    <p className="text-ink-700 text-xs">{message}</p>
                                    <p className="text-ink-500 mt-1 text-xs">{time}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-ink-500 px-2 py-6 text-center text-sm">
                            You’re all caught up.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationMenu