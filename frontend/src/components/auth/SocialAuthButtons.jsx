import toast from 'react-hot-toast'
import {
    GithubIcon,
    GoogleIcon,
    MicrosoftIcon,
} from '@/components/auth/BrandIcons'

const providerDetails = {
    google: { label: 'Google', icon: GoogleIcon },
    microsoft: { label: 'Microsoft', icon: MicrosoftIcon },
    github: { label: 'GitHub', icon: GithubIcon },
}

function SocialAuthButtons({ providers, dividerLabel, showPrefix = false }) {
    const handleClick = (label) => {
        toast(`${label} sign-in will be available once the backend is connected.`)
    }

    return (
        <div>
            <div className="flex items-center gap-4">
                <span className="bg-line h-px flex-1" />
                <span className="text-ink-700 text-sm font-medium">{dividerLabel}</span>
                <span className="bg-line h-px flex-1" />
            </div>

            <div
                className="mt-4 grid gap-3"
                style={{
                    gridTemplateColumns: `repeat(${providers.length}, minmax(0, 1fr))`,
                }}
            >
                {providers.map((provider) => {
                    const { label, icon: Icon } = providerDetails[provider]

                    return (
                        <button
                            key={provider}
                            type="button"
                            onClick={() => handleClick(label)}
                            className="rounded-pill border-line shadow-card hover:bg-brand-purple-soft flex items-center justify-center gap-2 border bg-white px-3 py-3 text-sm font-bold"
                        >
                            <Icon className="size-5 shrink-0" />
                            <span className="truncate">
                                {showPrefix ? `Continue with ${label}` : label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default SocialAuthButtons