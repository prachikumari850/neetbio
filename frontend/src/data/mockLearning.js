import {
    BookOpen,
    Bookmark,
    CircleCheck,
    Dna,
    Flame,
    HeartPulse,
    Microscope,
    Play,
    Sprout,
    Star,
    Target,
    Clock,
    TreePine,
    Trophy,
    FileText,
    LayoutGrid,
} from 'lucide-react'

export const learningTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'progress', label: 'In Progress', icon: Play },
    { id: 'completed', label: 'Completed', icon: CircleCheck },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'tests', label: 'My Tests', icon: Trophy },
]

export const learningStats = [
    { id: 'chapters', icon: BookOpen, value: '12', label: 'Chapters Studied', tone: 'text-brand-purple' },
    { id: 'progress', icon: Target, value: '68%', label: 'Overall Progress', tone: 'text-danger' },
    { id: 'time', icon: Clock, value: '24h 36m', label: 'Total Learning Time', tone: 'text-info' },
]

export const continueItem = {
    diagramId: 'plant-cell',
    title: 'Plant Cell – Structure and Function',
    meta: 'Cell Biology • Chapter 2',
    progress: 68,
}

export const progressSummary = {
    syllabus: 68,
    rows: [
        { id: 'chapters', label: 'Chapters Studied', value: '17 / 25', icon: Sprout, tone: 'text-success' },
        { id: 'practice', label: 'Practice Completed', value: '420 / 600', icon: Target, tone: 'text-danger' },
        { id: 'tests', label: 'Tests Taken', value: '12 / 20', icon: Trophy, tone: 'text-accent-pink' },
        { id: 'time', label: 'Learning Time', value: '24h 36m', icon: Clock, tone: 'text-info' },
    ],
}

export const subjectProgress = [
    { id: 'cell', label: 'Cell Biology', value: 85, icon: Microscope, tone: 'text-brand-purple' },
    { id: 'plant', label: 'Plant Physiology', value: 72, icon: Sprout, tone: 'text-success' },
    { id: 'human', label: 'Human Physiology', value: 60, icon: HeartPulse, tone: 'text-danger' },
    { id: 'genetics', label: 'Genetics & Evolution', value: 48, icon: Dna, tone: 'text-info' },
    { id: 'ecology', label: 'Ecology & Environment', value: 40, icon: TreePine, tone: 'text-success' },
]

export const initialNotes = [
    { id: 'note-1', title: 'Plant Cell – Key Points', content: 'Cell wall (cellulose), chloroplasts, large central vacuole. Plasmodesmata connect adjacent cells.', savedAt: '2026-11-04T12:00:00' },
    { id: 'note-2', title: 'Photosynthesis – Formula & Steps', content: '6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O. Light reactions in thylakoid, Calvin cycle in stroma.', savedAt: '2026-11-02T12:00:00' },
    { id: 'note-3', title: 'Human Heart – Flow Diagram', content: 'Vena cava → RA → RV → pulmonary artery → lungs → pulmonary vein → LA → LV → aorta.', savedAt: '2026-10-30T12:00:00' },
]

export const learningActivity = [
    { id: 'l1', label: 'Watched: Mitosis – Stages', time: '2h ago', icon: Play, tone: 'text-success' },
    { id: 'l2', label: 'Completed: Cell Cycle Quiz', time: '4h ago', icon: CircleCheck, tone: 'text-success' },
    { id: 'l3', label: 'Studied: Photosynthesis', time: 'Yesterday', icon: BookOpen, tone: 'text-info' },
    { id: 'l4', label: 'Bookmarked: Nephron Diagram', time: 'Yesterday', icon: Star, tone: 'text-brand-orange' },
]

export const achievements = [
    { id: 'chapters', value: 5, label: 'Chapters', icon: BookOpen, tint: 'bg-[#ece3ff] text-brand-purple' },
    { id: 'tests', value: 10, label: 'Tests', icon: Target, tint: 'bg-[#fff0d6] text-brand-orange' },
    { id: 'streak', value: 12, label: 'Day Streak', icon: Flame, tint: 'bg-[#dcf5e3] text-success' },
]

export const inProgressItems = [
    { id: 'ip-1', title: 'Plant Cell – Structure and Function', meta: 'Cell Biology • Chapter 2', progress: 68, to: '/diagrams?open=plant-cell' },
    { id: 'ip-2', title: 'Human Excretory System', meta: 'Excretory Products • Chapter 19', progress: 45, to: '/diagrams?open=nephron' },
    { id: 'ip-3', title: 'Light Reactions of Photosynthesis', meta: 'Plant Physiology • Chapter 13', progress: 30, to: '/diagrams?open=light-reactions' },
    { id: 'ip-4', title: 'Cell Cycle & Mitosis', meta: 'Cell Biology • Chapter 10', progress: 55, to: '/diagrams?open=mitosis' },
]

export const completedItems = [
    { id: 'cp-1', title: 'Structure of Chloroplast', meta: 'Cell Biology • Chapter 8', completedOn: '2026-11-03T12:00:00', to: '/diagrams?open=chloroplast' },
    { id: 'cp-2', title: 'Human Heart – Structure & Working', meta: 'Circulation • Chapter 18', completedOn: '2026-11-01T12:00:00', to: '/diagrams?open=human-heart' },
    { id: 'cp-3', title: 'DNA Structure', meta: 'Genetics • Chapter 6', completedOn: '2026-10-28T12:00:00', to: '/diagrams?open=dna-structure' },
]