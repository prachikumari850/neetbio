import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cx } from '@/utils/classNames'

const sizeClasses = {
    md: 'max-w-lg',
    xl: 'max-w-5xl',
}

function Modal({ isOpen, title, onClose, size = 'md', children }) {
    useEffect(() => {
        if (!isOpen) {
            return
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="bg-navy-950/60 absolute inset-0 cursor-default"
            />
            <div
                className={cx(
                    'rounded-card shadow-raised relative max-h-[90vh] w-full overflow-y-auto bg-white p-6',
                    sizeClasses[size],
                )}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 id="modal-title" className="text-xl font-bold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="text-ink-500 hover:bg-brand-purple-soft rounded-full p-1.5"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal