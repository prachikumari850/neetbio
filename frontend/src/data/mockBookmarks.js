import { FileText, Image as ImageIcon, MessageCircleQuestion, Trophy } from 'lucide-react'

export const BOOKMARK_LIMIT = 100

export const defaultFolders = [
    'Important Topics',
    'Revision',
    'Weak Areas',
    'NEET Practice',
    'Others',
]

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

export const initialBookmarks = [
    { id: 'diagram-plant-cell', type: 'diagram', title: 'Plant Cell – Labeled Diagram', subtitle: 'Cell Biology • Class 11', folder: 'Important Topics', savedAt: '2026-11-05T12:00:00', image: '/images/diagrams/plant-cell.png', link: '/diagrams?open=plant-cell' },
    { id: 'note-photosynthesis', type: 'note', title: 'Photosynthesis – Short Notes', subtitle: 'Plant Physiology • Class 11', folder: 'Revision', savedAt: '2026-11-04T12:00:00', image: '/images/bookmarks/note-photosynthesis.png', link: '/my-learning?tab=notes' },
    { id: 'question-respiration', type: 'question', title: 'Respiration – Practice Questions', subtitle: 'Human Physiology • MCQs', folder: 'Weak Areas', savedAt: '2026-11-03T12:00:00', image: '/images/bookmarks/question-respiration.png', link: '/practice?tab=practice' },
    { id: 'test-mock-1', type: 'test', title: 'Full Syllabus Mock Test – 1', subtitle: 'NEET • Mixed Topics', folder: 'NEET Practice', savedAt: '2026-11-02T12:00:00', image: '/images/bookmarks/test-mock.png', link: '/practice?start=mock-1' },
    { id: 'diagram-human-heart', type: 'diagram', title: 'Human Heart – Structure & Working', subtitle: 'Circulatory System • Class 11', folder: 'Important Topics', savedAt: '2026-11-01T12:00:00', image: '/images/diagrams/human-heart.png', link: '/diagrams?open=human-heart' },
    { id: 'note-cell-cycle', type: 'note', title: 'Cell Cycle & Mitosis – Revision Notes', subtitle: 'Cell Biology • Class 11', folder: 'Revision', savedAt: '2026-10-30T12:00:00', image: '/images/bookmarks/note-cell-cycle.png', link: '/my-learning?tab=notes' },
]