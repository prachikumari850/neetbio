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
    { id: 'genetics', label: 'Genetics & Evolution', icon: Dna, tint: 'from-[#dcebff] to-[#f0f6ff]', iconTone: 'text-info' },
    { id: 'human-physiology', label: 'Human Physiology', icon: HeartPulse, tint: 'from-[#ffe0ea] to-[#fff0f4]', iconTone: 'text-danger' },
    { id: 'ecology', label: 'Ecology & Environment', icon: TreePine, tint: 'from-[#d9f5df] to-[#effaf1]', iconTone: 'text-success' },
]

export const testCatalog = [
    { id: 'mock-1', category: 'mock', title: 'Full Syllabus NEET Mock Test – 1', subjects: 'all', count: 30, durationMin: 30, icon: Trophy },
    { id: 'mock-2', category: 'mock', title: 'Full Syllabus NEET Mock Test – 2', subjects: 'all', count: 20, durationMin: 20, icon: Trophy },
    { id: 'mock-3', category: 'mock', title: 'NEET Pattern Mini Mock', subjects: 'all', count: 10, durationMin: 10, icon: Trophy },
    ...practiceSubjects.map((subject) => ({
        id: `chapter-${subject.id}`,
        category: 'chapter',
        title: `${subject.label} – Chapter Test`,
        subjects: [subject.id],
        count: 5,
        durationMin: 8,
        icon: subject.icon,
    })),
    { id: 'pyq-1', category: 'pyq', title: 'Previous Year Pattern – Set 1', subjects: 'all', count: 15, durationMin: 15, icon: Calendar },
    { id: 'pyq-2', category: 'pyq', title: 'Previous Year Pattern – Set 2', subjects: 'all', count: 15, durationMin: 15, icon: Calendar },
    { id: 'pyq-3', category: 'pyq', title: 'Previous Year Pattern – Set 3', subjects: 'all', count: 15, durationMin: 15, icon: Calendar },
]

export const recommendedTestIds = ['mock-1', 'chapter-human-physiology', 'chapter-cell-biology']

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

export const testProgress = {
    accuracy: 78,
    stats: [
        { id: 'attempted', label: 'Questions Attempted', value: '1,920', tone: 'success' },
        { id: 'correct', label: 'Correct Answers', value: '1,498', tone: 'pink' },
        { id: 'wrong', label: 'Wrong Answers', value: '422', tone: 'danger' },
        { id: 'completed', label: 'Tests Completed', value: '18', tone: 'info' },
    ],
}

export const initialTestResults = [
    { id: 'result-1', title: 'Plant Kingdom – Practice', subjectId: 'botany', correct: 18, total: 20, accuracy: 90, minutes: 15, takenAt: '2026-11-04T12:00:00' },
    { id: 'result-2', title: 'Animal Kingdom – Chapter Test', subjectId: 'zoology', correct: 38, total: 50, accuracy: 76, minutes: 45, takenAt: '2026-11-02T12:00:00' },
    { id: 'result-3', title: 'Circulatory System – Practice', subjectId: 'human-physiology', correct: 20, total: 25, accuracy: 80, minutes: 20, takenAt: '2026-10-30T12:00:00' },
]