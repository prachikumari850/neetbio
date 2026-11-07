import { FileText, Image as ImageIcon, MessageCircleQuestion, Trophy } from 'lucide-react'

export const BOOKMARK_LIMIT = 100

export const bookmarkTypeMeta = {
    diagram: { label: 'Diagram', icon: ImageIcon, tone: 'bg-brand-purple-soft text-brand-purple' },
    note: { label: 'Note', icon: FileText, tone: 'bg-info-soft text-info' },
    question: { label: 'Question', icon: MessageCircleQuestion, tone: 'bg-success-soft text-success' },
    test: { label: 'Test', icon: Trophy, tone: 'bg-danger-soft text-danger' },
}

export const bookmarkSortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A–Z)' },
]