import {
    BookOpen,
    Bot,
    ChartColumn,
    CircleCheck,
    Play,
    Target,
} from 'lucide-react'

export const quickLinks = [
    { id: 'diagrams', title: 'Explore Diagrams', to: '/diagrams', icon: BookOpen, tint: 'bg-[#e9e0ff]', iconTone: 'text-brand-purple' },
    { id: 'ai', title: 'AI Learn', subtitle: '(Chat & Generate)', to: '/ai-learn', icon: Bot, tint: 'bg-[#d9f5e3]', iconTone: 'text-success' },
    { id: 'practice', title: 'Practice', subtitle: '(NEET Style)', to: '/practice', icon: Target, tint: 'bg-[#ffe6d6]', iconTone: 'text-brand-orange' },
    { id: 'progress', title: 'My Progress & Analytics', to: '/analytics', icon: ChartColumn, tint: 'bg-[#dce9ff]', iconTone: 'text-info' },
]

export const continueLearning = {
    diagramId: 'nephron',
    title: 'Human Excretory System',
    chapter: 'Chapter: Excretory Products and their Elimination',
    progress: 68,
}

export const learningProgress = {
    overall: 72,
    stats: [
        { id: 'chapters', label: 'Chapters Completed', value: '14 / 20', icon: BookOpen, tone: 'text-success' },
        { id: 'diagrams', label: 'Diagrams Studied', value: '128', icon: Bot, tone: 'text-brand-purple' },
        { id: 'practice', label: 'Practice Attempted', value: '420', icon: Target, tone: 'text-accent-pink' },
        { id: 'accuracy', label: 'Accuracy', value: '86%', icon: CircleCheck, tone: 'text-info' },
    ],
}

export const initialDailyTasks = [
    { id: 'diagrams', label: 'Study 5 Diagrams', done: true },
    { id: 'questions', label: 'Practice 20 Questions', done: true },
    { id: 'revise', label: 'Revise 1 Chapter', done: false },
    { id: 'ai', label: 'Use AI Learn (Image/Chat)', done: false },
    { id: 'bookmarks', label: 'Review saved bookmarks', done: false },
]

export const upcomingPracticeTestId = 'mock-2'

export const recommendedDiagramIds = [
    'flower',
    'chloroplast',
    'nephron',
    'dna-structure',
    'human-heart',
    'alveolus',
    'mitosis',
    'plant-cell',
]

export const dashboardActivity = [
    { id: 'a1', label: 'Completed: Plant Cell Diagram', time: '2 hours ago', icon: CircleCheck, tone: 'text-success' },
    { id: 'a2', label: 'Practiced: Transport in Plants (15 Q)', time: '4 hours ago', icon: Play, tone: 'text-brand-purple' },
    { id: 'a3', label: 'Studied: Photosynthesis', time: 'Yesterday', icon: BookOpen, tone: 'text-info' },
]
