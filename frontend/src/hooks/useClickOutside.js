import { useEffect } from 'react'

export function useClickOutside(ref, handler) {
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [ref, handler])
}