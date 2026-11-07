import {
    BookOpen,
    Calendar,
    Dna,
    HeartPulse,
    Leaf,
    Microscope,
    PawPrint,
    Pencil,
    SlidersHorizontal,
    TreePine,
    Trophy,
} from 'lucide-react'

export const practiceTabs = [
    { id: 'practice', label: 'Practice Questions', icon: Pencil },
    { id: 'mock', label: 'Mock Tests', icon: Trophy },
    { id: 'chapter', label: 'Chapter Tests', icon: BookOpen },
    { id: 'pyq', label: 'Previous Year (PYQs)', icon: Calendar },
    { id: 'custom', label: 'Custom Test', icon: SlidersHorizontal },
]

export const practiceSubjects = [
    { id: 'botany', label: 'Botany', icon: Leaf, tint: 'from-[#e3f6d8] to-[#f3fbec]', iconTone: 'text-success' },
    { id: 'zoology', label: 'Zoology', icon: PawPrint, tint: 'from-[#ffecd0] to-[#fff7ea]', iconTone: 'text-brand-orange' },
    { id: 'cell-biology', label: 'Cell Biology', icon: Microscope, tint: 'from-[#ece3ff] to-[#f7f2ff]', iconTone: 'text-brand-purple' },
    { id: 'genetics-evolution', label: 'Genetics & Evolution', icon: Dna, tint: 'from-[#dcebff] to-[#f0f6ff]', iconTone: 'text-info' },
    { id: 'human-physiology', label: 'Human Physiology', icon: HeartPulse, tint: 'from-[#ffe0ea] to-[#fff0f4]', iconTone: 'text-danger' },
    { id: 'ecology', label: 'Ecology & Environment', icon: TreePine, tint: 'from-[#d9f5df] to-[#effaf1]', iconTone: 'text-success' },
]

export const difficultyOptions = [
    { value: 'mixed', label: 'Mixed' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
]

export const questionCountOptions = [
    { value: '5', label: '5 questions' },
    { value: '10', label: '10 questions' },
    { value: '15', label: '15 questions' },
]