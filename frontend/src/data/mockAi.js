import { BookOpen, FileText, Image as ImageIcon, ListChecks, Sparkles } from 'lucide-react'

export const welcomeMessage = {
    id: 'welcome',
    role: 'assistant',
    content:
        'Hi! I’m your Biology assistant. Ask me a NEET doubt, or pick a diagram under **Ask about** to focus my answer on it. You can also try **Analyze Image**, **Generate Image** and **Summarize Notes** above.',
    sources: [],
}

export const diagramTemplates = [
    { keywords: ['respiratory', 'lung'], title: 'Human Respiratory System', labels: ['Nasal cavity', 'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli', 'Diaphragm'] },
    { keywords: ['heart'], title: 'Human Heart', labels: ['Aorta', 'Pulmonary artery', 'Right atrium', 'Left atrium', 'Right ventricle', 'Left ventricle'] },
    { keywords: ['cell'], title: 'Plant Cell', labels: ['Cell wall', 'Chloroplast', 'Nucleus', 'Vacuole', 'Mitochondrion', 'Ribosomes'] },
]

export const promptTiles = [
    { id: 'explain', label: 'Explain a concept', icon: BookOpen, tint: 'bg-[#e3f6d8] text-success', tab: 'chat', prompt: 'Explain photosynthesis in simple steps for NEET.' },
    { id: 'analyze', label: 'Analyze a biology image', icon: ImageIcon, tint: 'bg-[#e5deff] text-brand-purple', tab: 'analyze' },
    { id: 'generate', label: 'Generate a diagram', icon: Sparkles, tint: 'bg-[#ffe0ea] text-danger', tab: 'generate' },
    { id: 'summarize', label: 'Summarize this topic', icon: ListChecks, tint: 'bg-[#dcebff] text-info', tab: 'summarize' },
    { id: 'mito', label: 'Function of mitochondria', icon: BookOpen, tint: 'bg-[#e3f6d8] text-success', tab: 'chat', prompt: 'What is the function of mitochondria?' },
    { id: 'compare', label: 'Compare mitosis & meiosis', icon: BookOpen, tint: 'bg-[#e5deff] text-brand-purple', tab: 'chat', prompt: 'Compare mitosis and meiosis.' },
    { id: 'heart', label: 'Explain the human heart', icon: BookOpen, tint: 'bg-[#ffe0ea] text-danger', tab: 'chat', prompt: 'Explain the human heart.' },
    { id: 'notes', label: 'Summarize my notes', icon: FileText, tint: 'bg-[#dcebff] text-info', tab: 'summarize' },
]