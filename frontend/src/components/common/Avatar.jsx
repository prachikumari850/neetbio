import AssetImage from '@/components/common/AssetImage'
import { cx } from '@/utils/classNames'

function Avatar({ name, src, className }) {
    return (
        <span
            className={cx(
                'bg-brand-purple-soft text-brand-purple relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full font-bold',
                className,
            )}
        >
            {name.charAt(0).toUpperCase()}
            {src && (
                <AssetImage
                    src={src}
                    alt={name}
                    className="absolute inset-0 size-full object-cover"
                />
            )}
        </span>
    )
}

export default Avatar