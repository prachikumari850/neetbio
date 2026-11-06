import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import AuthField from '@/components/auth/AuthField'

function PasswordField(props) {
    const [isVisible, setIsVisible] = useState(false)
    const ToggleIcon = isVisible ? Eye : EyeOff

    return (
        <AuthField
            icon={Lock}
            type={isVisible ? 'text' : 'password'}
            trailing={
                <button
                    type="button"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    onClick={() => setIsVisible((current) => !current)}
                    className="text-ink-700 hover:text-brand-purple"
                >
                    <ToggleIcon className="size-5" />
                </button>
            }
            {...props}
        />
    )
}

export default PasswordField