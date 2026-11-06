import { LoaderCircle } from 'lucide-react'

function LoadingSpinner({ label = 'Loading...' }) {
    return (
        <div
            role="status"
            className="text-ink-500 flex items-center justify-center gap-3 py-10"
        >
            <LoaderCircle className="text-brand-purple size-6 animate-spin" />
            <span className="text-sm font-medium">{label}</span>
        </div>
    )
}

export default LoadingSpinner