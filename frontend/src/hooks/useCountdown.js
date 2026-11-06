import { useEffect, useRef, useState } from 'react'

export function useCountdown(totalSeconds, onExpire) {
    const [remaining, setRemaining] = useState(totalSeconds)
    const onExpireRef = useRef(onExpire)

    useEffect(() => {
        onExpireRef.current = onExpire
    }, [onExpire])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemaining((current) => Math.max(current - 1, 0))
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        if (remaining === 0) {
            onExpireRef.current()
        }
    }, [remaining])

    return remaining
}