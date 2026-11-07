import { Trash2 } from 'lucide-react'
import Badge from '@/components/common/Badge'
import { formatShortDate } from '@/utils/formatters'

function SavedDiagramList({ items, status, onOpen, onRemove }) {
    const renderBody = () => {
        if (status === 'error') {
            return <p className="text-ink-500 text-sm">Couldn’t load your saved diagrams right now.</p>
        }

        if (items.length === 0) {
            return <p className="text-ink-500 text-sm">Diagrams you generate are saved here.</p>
        }

        return (
            <ul className="divide-line divide-y">
                {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onOpen(item)}
                            className="hover:bg-page flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-2.5 text-left text-sm"
                        >
                            <span className="flex-1 truncate font-medium">{item.title}</span>
                            <Badge className="capitalize">{item.kind}</Badge>
                            <span className="text-ink-500 shrink-0 text-xs">{formatShortDate(item.createdAt)}</span>
                        </button>
                        <button
                            type="button"
                            aria-label={`Delete diagram: ${item.title}`}
                            onClick={() => onRemove(item)}
                            className="text-ink-500 hover:bg-danger-soft hover:text-danger shrink-0 rounded-full p-1.5"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <section className="space-y-2">
            <h3 className="text-sm font-bold">Your generated diagrams</h3>
            {renderBody()}
        </section>
    )
}

export default SavedDiagramList