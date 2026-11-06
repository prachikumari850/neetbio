import { BookOpen, FileText, Image as ImageIcon, ListChecks, Sparkles } from 'lucide-react'

export const welcomeMessage = {
    id: 'welcome',
    role: 'assistant',
    content:
        'Hi! I’m your Biology assistant. Ask me a doubt, or try **Analyze Image**, **Generate Image** or **Summarize Notes** above.\n\n_Replies here are simulated until the AI backend is connected._',
}

export const simulatedReplies = [
    {
        keywords: ['mitochondri'],
        content:
            '**Mitochondria** are double-membrane organelles known as the *powerhouse of the cell*.\n\n- **Function:** produce ATP through the Krebs cycle and oxidative phosphorylation\n- **Inner membrane:** folded into cristae, which carry the ETC and ATP synthase\n- **Matrix:** contains enzymes, circular DNA and 70S ribosomes',
    },
    {
        keywords: ['photosynthesis'],
        content:
            '**Photosynthesis** has two stages:\n\n1. **Light reactions** (thylakoid membrane): water is split, O₂ is released, ATP and NADPH are made\n2. **Calvin cycle** (stroma): CO₂ is fixed into sugars using ATP and NADPH\n\nNEET tip: remember that the O₂ released comes from **water**, not CO₂.',
    },
    {
        keywords: ['mitosis', 'meiosis'],
        content:
            '**Mitosis vs Meiosis**\n\n- Mitosis: one division, 2 diploid daughter cells, no crossing over\n- Meiosis: two divisions, 4 haploid cells, crossing over in prophase I\n\nMitosis is for growth and repair; meiosis produces gametes.',
    },
    {
        keywords: ['plant cell', 'animal cell'],
        content:
            '**Plant cell vs animal cell**\n\n- Plant cells have a cell wall, chloroplasts and a large central vacuole\n- Animal cells have centrioles and lysosomes, and usually small vacuoles\n- Both have a nucleus, mitochondria, ER and Golgi apparatus',
    },
    {
        keywords: ['heart'],
        content:
            'The **human heart** is a four-chambered organ.\n\n- Right side: receives deoxygenated blood and sends it to the lungs\n- Left side: receives oxygenated blood and pumps it to the body\n- The left ventricle has the thickest wall because it pumps blood the farthest',
    },
]

export const fallbackReply =
    'This is a simulated reply, so I can only answer a few sample topics for now: **mitochondria**, **photosynthesis**, **mitosis vs meiosis**, **plant vs animal cell** and the **heart**. Real, open-ended answers arrive when the AI backend is connected.'

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

export const recentChats = [
    {
        id: 'chat-photosynthesis',
        title: 'Photosynthesis – process, steps and diagram',
        when: 'Today',
        messages: [
            { id: 'c1-u', role: 'user', content: 'Explain photosynthesis with steps.' },
            { id: 'c1-a', role: 'assistant', content: simulatedReplies[1].content },
        ],
    },
    {
        id: 'chat-cells',
        title: 'Plant cell vs Animal cell (differences)',
        when: 'Yesterday',
        messages: [
            { id: 'c2-u', role: 'user', content: 'Differences between plant cell and animal cell?' },
            { id: 'c2-a', role: 'assistant', content: simulatedReplies[3].content },
        ],
    },
    {
        id: 'chat-meiosis',
        title: 'Explain meiosis with a diagram',
        when: 'Nov 3',
        messages: [
            { id: 'c3-u', role: 'user', content: 'Explain meiosis.' },
            { id: 'c3-a', role: 'assistant', content: simulatedReplies[2].content },
        ],
    },
    {
        id: 'chat-mitochondria',
        title: 'Function of mitochondria',
        when: 'Nov 2',
        messages: [
            { id: 'c4-u', role: 'user', content: 'What is the function of mitochondria?' },
            { id: 'c4-a', role: 'assistant', content: simulatedReplies[0].content },
        ],
    },
    {
        id: 'chat-heart',
        title: 'Human heart – chambers and valves',
        when: 'Oct 30',
        messages: [
            { id: 'c5-u', role: 'user', content: 'Explain the human heart.' },
            { id: 'c5-a', role: 'assistant', content: simulatedReplies[4].content },
        ],
    },
]