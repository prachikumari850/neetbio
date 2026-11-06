import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import { bookmarkTypeMeta } from '@/data/mockBookmarks'
import { useBookmarkStore } from '@/store/useBookmarkStore'

function SavedItemsTab() {
    const items = useBookmarkStore((state) => state.items)

    if (items.length === 0) {
        return (
            <Card>
                <EmptyState icon={Bookmark} title="No bookmarks yet" description="Save diagrams, notes and questions to find them here.">
                    <Button to="/diagrams" variant="soft">Explore Diagrams</Button>
                </EmptyState>
            </Card>
        )
    }

    return (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.slice(0, 6).map((item) => (
                <li key={item.id}>
                    <Link to={item.link} className="block h-full">
                        <Card className="hover:shadow-raised h-full space-y-2 p-5 transition">
                            <Badge className={bookmarkTypeMeta[item.type].tone}>{bookmarkTypeMeta[item.type].label}</Badge>
                            <h3 className="leading-tight font-extrabold">{item.title}</h3>
                            <p className="text-ink-700 text-xs">{item.subtitle}</p>
                        </Card>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default SavedItemsTab