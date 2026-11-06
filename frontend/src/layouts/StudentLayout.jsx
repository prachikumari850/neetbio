import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { findNavigationItem } from '@/data/navigation'

function StudentLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { pathname } = useLocation()
    const activeItem = findNavigationItem(pathname)

    return (
        <div className="bg-page-gradient min-h-screen">
            <Sidebar
                activeItem={activeItem}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden lg:pl-sidebar">
                <Topbar
                    activeItem={activeItem}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default StudentLayout