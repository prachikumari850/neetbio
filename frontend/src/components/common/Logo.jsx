import { Dna } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cx } from '@/utils/classNames'

const sizeClasses = {
    md: { icon: 'size-10', name: 'text-[28px]', tagline: 'text-sm' },
    sm: { icon: 'size-8', name: 'text-[22px]', tagline: 'text-[11px]' },
}

function Logo({ tone = 'dark', size = 'md', to = '/' }) {
    const isLight = tone === 'light'
    const sizes = sizeClasses[size]

    return (
        <Link to={to} className="inline-flex items-center gap-2.5">
            <Dna
                className={cx('text-brand-orange shrink-0', sizes.icon)}
                strokeWidth={2.25}
            />
            <span className="flex flex-col leading-none">
                <span className={cx('font-extrabold tracking-tight', sizes.name)}>
                    <span className={isLight ? 'text-white' : 'text-navy-900'}>NEET</span>
                    <span className="text-brand-orange">BIO</span>
                </span>
                <span
                    className={cx(
                        'mt-1 font-semibold',
                        sizes.tagline,
                        isLight ? 'text-white' : 'text-navy-900',
                    )}
                >
                    Biology for NEET
                </span>
            </span>
        </Link>
    )
}

export default Logo