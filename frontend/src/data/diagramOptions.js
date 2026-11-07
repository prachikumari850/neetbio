import { Gamepad2, Play, Zap } from 'lucide-react'

export const diagramTypes = [
    { id: 'structural', label: 'Structural (Anatomy)' },
    { id: 'process', label: 'Process / Flowchart' },
    { id: 'lifecycle', label: 'Life Cycle' },
    { id: 'comparison', label: 'Comparison / Table' },
]

export const diagramFeatures = [
    { id: 'interactive', label: 'Interactive', icon: Zap },
    { id: 'explanation', label: 'With Explanation', icon: Play },
    { id: 'practice', label: 'Practise Mode', icon: Gamepad2 },
]

export const diagramSortOptions = [
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'az', label: 'Title (A–Z)' },
    { value: 'za', label: 'Title (Z–A)' },
]