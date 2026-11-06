import { useRef, useState } from 'react'
import { Bookmark, Folder, MoreHorizontal, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import Badge from '@/components/common/Badge'
import { bookmarkTypeMeta } from '@/data/mockBookmarks'
import { useClickOutside } from '@/hooks/useClickOutside'
import { formatShortDate } from '@/utils/formatters'

function BookmarkCard({ item, folders, onRemove, onMove }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const { label, icon: TypeIcon, tone } = bookmarkTypeMeta[item.type]

    useClickOutside(menuRef, () => setIsMenuOpen(false))

    return (
        <article className="rounded-card border-line shadow-card relative flex h-full flex-col gap-3 border bg-white p-4">
            <div className="flex items-center justify-between">
                <Badge className={tone}>
                    <TypeIcon className="mr-1 size-3.5" />
                    {label}
                </Badge>
                <button
                    type="button"
                    aria-label={`Remove ${item.title} from bookmarks`}
                    onClick={() => onRemove(item)}
                    className="hover:bg-brand-purple-soft rounded-full p-1"
                >
                    <Bookmark className="fill-brand-orange text-brand-orange size-5" />
                </button>
            </div>

            <Link to={item.link} className="flex flex-1 flex-col items-center gap-3 text-center">
                <span className="flex h-28 w-full items-center justify-center">
                    <AssetImage
                        src={item.image}
                        alt=""
                        className="max-h-full object-contain"
                        fallback={<TypeIcon className="text-brand-purple/40 size-14" />}
                    />
                </span>
                <span>
                    <span className="block leading-tight font-extrabold">{item.title}</span>
                    <span className="text-ink-500 mt-1 block text-xs">{item.subtitle}</span>
                </span>
            </Link>

            <div className="flex items-center justify-between gap-2">
                <span className="bg-brand-orange-soft flex min-w-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                    <Folder className="text-brand-orange size-4 shrink-0" />
                    <span className="truncate">{item.folder}</span>
                </span>
                <span className="text-ink-500 shrink-0 text-xs">{formatShortDate(item.savedAt)}</span>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        aria-label="More actions"
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((current) => !current)}
                        className="hover:bg-brand-purple-soft rounded-full p-1"
                    >
                        <MoreHorizontal className="size-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="rounded-card border-line shadow-raised absolute right-0 bottom-full z-20 mb-2 w-48 border bg-white p-2">
                            <p className="text-ink-500 px-2 pb-1 text-xs font-bold uppercase">Move to folder</p>
                            {folders.map((folder) => (
                                <button
                                    key={folder}
                                    type="button"
                                    onClick={() => {
                                        onMove(item, folder)
                                        setIsMenuOpen(false)
                                    }}
                                    className="hover:bg-brand-purple-soft w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium"
                                >
                                    {folder}
                                    {folder === item.folder && ' ✓'}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => onRemove(item)}
                                className="text-danger hover:bg-danger-soft mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-semibold"
                            >
                                <Trash2 className="size-4" />
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}

export default BookmarkCard