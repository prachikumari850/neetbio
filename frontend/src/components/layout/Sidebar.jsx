import { ArrowRight } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import Badge from '@/components/common/Badge'
import Logo from '@/components/common/Logo'
import { navigationItems } from '@/data/navigation'
import { cx } from '@/utils/classNames'

function SidebarPromo() {
    return (
        <Link
            to="/diagrams"
            className="relative block overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 text-white"
        >
            <p className="max-w-32 text-lg leading-snug font-bold">
                Learn Biology Visually & Interactively
            </p>
            <span className="mt-4 flex size-9 items-center justify-center rounded-full bg-white/25">
                <ArrowRight className="size-5" />
            </span>
            <AssetImage
                src="/images/sidebar/dashboard.png"
                className="absolute right-0 bottom-0 h-28 object-contain"
            />
        </Link>
    )
}

function Sidebar({ activeItem, isOpen, onClose }) {
    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={onClose}
                    className="bg-navy-950/60 fixed inset-0 z-40 lg:hidden"
                />
            )}

            <aside
                className={cx(
                    'bg-sidebar fixed inset-y-0 left-0 z-50 flex w-sidebar flex-col overflow-y-auto transition-transform duration-200 lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="px-6 pt-5">
                    <Logo tone="light" to="/dashboard" />
                </div>

                <nav aria-label="Main" className="mt-6 flex flex-col gap-1.5 px-3">
                    {navigationItems.map(({ key, label, path, icon: Icon, badge }) => (
                        <NavLink
                            key={key}
                            to={path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cx(
                                    'flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors',
                                    isActive
                                        ? 'bg-action-orange shadow-raised text-white'
                                        : 'text-white/90 hover:bg-white/10',
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className="size-6 shrink-0" strokeWidth={1.75} />
                                    <span>{label}</span>
                                    {badge && !isActive && (
                                        <Badge tone="solid" className="ml-auto">
                                            {badge}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto px-4 pt-6 pb-4">
                    {activeItem.key === 'dashboard' ? (
                        <SidebarPromo />
                    ) : (
                        <AssetImage
                            src={`/images/sidebar/${activeItem.key}.png`}
                            className="mx-auto max-h-64 object-contain"
                        />
                    )}
                </div>
            </aside>
        </>
    )
}

export default Sidebar