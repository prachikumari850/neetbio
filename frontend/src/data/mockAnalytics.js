import {
    Dna,
    GraduationCap,
    HeartPulse,
    Leaf,
    Microscope,
    PawPrint,
    Target,
    Timer,
    Check,
    TreePine,
    Trophy,
    Layers,
    TrendingUp,
    LayoutGrid,
} from 'lucide-react'

export const analyticsTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'subjects', label: 'Subject Analysis', icon: Layers },
    { id: 'tests', label: 'Test Analytics', icon: Trophy },
    { id: 'topics', label: 'Topic Wise Progress', icon: Target },
    { id: 'strengths', label: 'Strengths & Weaknesses', icon: TrendingUp },
]

export const overviewStats = [
    { id: 'progress', label: 'Overall Progress', value: '68%', delta: '+12%', progress: 68, tone: 'success', icon: GraduationCap },
    { id: 'tests', label: 'Tests Completed', value: '18 / 25', progress: 72, tone: 'info', icon: Target },
    { id: 'practice', label: 'Practice Questions', value: '1,498 / 1,920', progress: 78, tone: 'purple', icon: Check },
    { id: 'time', label: 'Total Study Time', value: '24h 36m', icon: Timer },
]

export const subjectPerformance = [
    { id: 'botany', label: 'Botany', icon: Leaf, tone: 'text-success', progress: 75, accuracy: 83 },
    { id: 'zoology', label: 'Zoology', icon: PawPrint, tone: 'text-brand-orange', progress: 70, accuracy: 78 },
    { id: 'cell', label: 'Cell Biology', icon: Microscope, tone: 'text-brand-purple', progress: 68, accuracy: 76 },
    { id: 'genetics', label: 'Genetics & Evolution', icon: Dna, tone: 'text-info', progress: 62, accuracy: 71 },
    { id: 'human', label: 'Human Physiology', icon: HeartPulse, tone: 'text-danger', progress: 60, accuracy: 69 },
    { id: 'ecology', label: 'Ecology & Environment', icon: TreePine, tone: 'text-success', progress: 58, accuracy: 65 },
]

export const performanceTrend = [
    { week: 'Week 1', score: 42 },
    { week: 'Week 2', score: 51 },
    { week: 'Week 3', score: 60 },
    { week: 'Week 4', score: 68 },
]

export const questionAnalysis = {
    total: 1920,
    segments: [
        { name: 'Correct', value: 1498, percent: 78, color: 'success' },
        { name: 'Incorrect', value: 422, percent: 22, color: 'danger' },
        { name: 'Not Attempted', value: 0, percent: 0, color: 'muted' },
    ],
}

export const strengths = ['Plant Physiology', 'Photosynthesis', 'Cell Structure']
export const weaknesses = ['Human Heart', 'Genetics Concepts', 'Ecosystem & Biomes']

export const recentTests = [
    { id: 't1', name: 'Full Syllabus Mock Test – 1', score: '540 / 720', accuracy: 75 },
    { id: 't2', name: 'Cell Biology – Chapter Test', score: '42 / 50', accuracy: 84 },
    { id: 't3', name: 'Plant Kingdom – Practice Test', score: '38 / 50', accuracy: 76 },
]

export const testTrend = [
    { test: 'Test 1', accuracy: 58 },
    { test: 'Test 2', accuracy: 64 },
    { test: 'Test 3', accuracy: 70 },
    { test: 'Test 4', accuracy: 75 },
    { test: 'Test 5', accuracy: 76 },
    { test: 'Test 6', accuracy: 84 },
]

export const aiInsights = [
    'Your accuracy improved by +12% in the last 2 weeks.',
    'Focus more on Human Physiology and Genetics.',
    'Take 1 full mock test this week for better assessment.',
]

export const topicProgress = [
    { id: 'tp1', topic: 'Cell Structure', progress: 90 },
    { id: 'tp2', topic: 'Photosynthesis', progress: 84 },
    { id: 'tp3', topic: 'Plant Physiology', progress: 78 },
    { id: 'tp4', topic: 'Cell Cycle & Division', progress: 66 },
    { id: 'tp5', topic: 'Genetics Concepts', progress: 52 },
    { id: 'tp6', topic: 'Human Heart', progress: 48 },
    { id: 'tp7', topic: 'Ecosystem & Biomes', progress: 41 },
]

