import { useState } from 'react'

function AssetImage({ src, alt = '', className, fallback = null }) {
    const [failedSrc, setFailedSrc] = useState(null)

    if (failedSrc === src) {
        return fallback
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailedSrc(src)}
        />
    )
}

export default AssetImage