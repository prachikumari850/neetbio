import {
    Bookmark,
    BookOpen,
    Bot,
    ChartColumn,
    CircleCheck,
    Dna,
    FileText,
    FlaskConical,
    Flower2,
    HeartPulse,
    Layers,
    LayoutGrid,
    Leaf,
    MessageSquare,
    Microscope,
    Play,
    Sprout,
    Target,
    TreePine,
    TrendingUp,
    Trophy,
} from 'lucide-react'

export const dashboardLinks = [
    { id: 'diagrams', title: 'Explore Diagrams', to: '/diagrams', icon: BookOpen, tint: 'bg-[#e9e0ff]', iconTone: 'text-brand-purple' },
    { id: 'ai', title: 'AI Learn', subtitle: '(Chat & Generate)', to: '/ai-learn', icon: Bot, tint: 'bg-[#d9f5e3]', iconTone: 'text-success' },
    { id: 'practice', title: 'Practice', subtitle: '(NEET Style)', to: '/practice', icon: Target, tint: 'bg-[#ffe6d6]', iconTone: 'text-brand-orange' },
    { id: 'progress', title: 'My Progress & Analytics', to: '/analytics', icon: ChartColumn, tint: 'bg-[#dce9ff]', iconTone: 'text-info' },
]

export const learningTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'progress', label: 'In Progress', icon: Play },
    { id: 'completed', label: 'Completed', icon: CircleCheck },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'tests', label: 'My Tests', icon: Trophy },
]

export const analyticsTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'subjects', label: 'Subject Analysis', icon: Layers },
    { id: 'tests', label: 'Test Analytics', icon: Trophy },
    { id: 'topics', label: 'Topic Wise Progress', icon: Target },
    { id: 'strengths', label: 'Strengths & Weaknesses', icon: TrendingUp },
]

export const unitVisuals = {
    'cell-biology': { icon: Microscope, tone: 'text-brand-purple' },
    'genetics-evolution': { icon: Dna, tone: 'text-info' },
    'human-physiology': { icon: HeartPulse, tone: 'text-danger' },
    ecology: { icon: TreePine, tone: 'text-success' },
    'plant-physiology': { icon: Leaf, tone: 'text-success' },
    reproduction: { icon: Flower2, tone: 'text-accent-pink' },
    'diversity-of-life': { icon: Sprout, tone: 'text-success' },
    biotechnology: { icon: FlaskConical, tone: 'text-info' },
    'structural-organisation': { icon: Layers, tone: 'text-brand-purple' },
    'health-and-disease': { icon: HeartPulse, tone: 'text-brand-orange' },
}

export const activityVisuals = {
    test: { icon: CircleCheck, tone: 'text-success' },
    diagram: { icon: BookOpen, tone: 'text-info' },
    note: { icon: FileText, tone: 'text-brand-purple' },
    chat: { icon: MessageSquare, tone: 'text-brand-orange' },
}

export const goalFields = [
    { key: 'diagrams', label: 'Diagrams to study', min: 1, max: 50 },
    { key: 'questions', label: 'Questions to practice', min: 1, max: 200 },
    { key: 'chapters', label: 'Chapters to revise', min: 1, max: 10 },
    { key: 'ai', label: 'AI Learn uses', min: 1, max: 50 },
]