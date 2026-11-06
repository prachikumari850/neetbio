import { Outlet } from 'react-router-dom'

function PublicLayout() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-white">
            <Outlet />
        </div>
    )
}

export default PublicLayout