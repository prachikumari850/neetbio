import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Button from '@/components/common/Button'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { getCurrentUser } from '@/services/userService'
import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'

function ProtectedRoute() {
    const token = useAuthStore((state) => state.token)
    const setUser = useUserStore((state) => state.setUser)
    const [status, setStatus] = useState('checking')
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        if (!token) {
            return undefined
        }

        let isCancelled = false

        getCurrentUser()
            .then((user) => {
                if (!isCancelled) {
                    setUser(user)
                    setStatus('ready')
                }
            })
            .catch((error) => {
                if (!isCancelled && error.status !== 401) {
                    setStatus('error')
                }
            })

        return () => {
            isCancelled = true
        }
    }, [token, attempt, setUser])

    const retry = () => {
        setStatus('checking')
        setAttempt((current) => current + 1)
    }

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (status === 'checking') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner label="Checking your session..." />
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-2xl font-extrabold">Can’t reach NEETBIO right now</h1>
                <p className="text-ink-700 max-w-sm text-sm">
                    Make sure the backend is running, then try again.
                </p>
                <Button onClick={retry}>Try again</Button>
            </div>
        )
    }

    return <Outlet />
}

export default ProtectedRoute