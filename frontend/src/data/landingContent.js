import {
    Atom,
    BadgeCheck,
    BookOpen,
    Camera,
    ChartColumn,
    Dna,
    FlaskConical,
    Flower2,
    GraduationCap,
    HeartPulse,
    Image as ImageIcon,
    Layers,
    MessageCircle,
    Microscope,
    Play,
    Send,
    ShieldCheck,
    Sparkles,
    Sprout,
    Target,
    TreePine,
    Zap,
} from 'lucide-react'

export const navLinks = [
    { label: 'Home', to: '/' },
    {
        label: 'Diagrams',
        menu: [
            { label: 'Explore Diagrams', to: '/diagrams' },
            { label: 'Saved Diagrams', to: '/bookmarks' },
        ],
    },
    {
        label: 'AI Learn',
        menu: [
            { label: 'AI Chat', to: '/ai-learn?tab=chat' },
            { label: 'Analyze Image', to: '/ai-learn?tab=analyze' },
            { label: 'Generate Image', to: '/ai-learn?tab=generate' },
            { label: 'Summarize Notes', to: '/ai-learn?tab=summarize' },
        ],
    },
    {
        label: 'Practice',
        menu: [
            { label: 'Practice Questions', to: '/practice?tab=practice' },
            { label: 'Mock Tests', to: '/practice?tab=mock' },
            { label: 'Previous Year (PYQs)', to: '/practice?tab=pyq' },
        ],
    },
    { label: 'My Learning', to: '/my-learning' },
    { label: 'About', href: '#about' },
]

export const heroHighlights = [
    { icon: BadgeCheck, lines: ['100% Free', 'for Students'] },
    { icon: BookOpen, lines: ['NEET', 'Focused'] },
    { icon: Zap, lines: ['AI-Powered', 'Learning'] },
    { icon: Layers, lines: ['Interactive', 'Diagrams'] },
    { icon: ShieldCheck, lines: ['Personalized', 'Progress'] },
]

export const demoSteps = [
    'Explore labelled diagrams chapter by chapter and click any structure to learn its function.',
    'Ask the AI assistant a doubt, upload an image to analyze, or generate a custom diagram.',
    'Practice NEET-style questions and take chapter tests with instant feedback.',
    'Track your accuracy and progress, and focus on the topics that need work.',
]

export const heroSlides = [
    {
        id: 'plant-cell',
        title: 'Plant Cell',
        hint: 'Click on any part to explore',
        image: '/images/landing/hero-plant-cell.svg',
        labels: [
            {
                id: 'cell-wall',
                name: 'Cell Wall',
                dot: 'bg-success',
                top: '12%',
                left: '68%',
                description: 'Rigid outer layer that gives the cell strength and shape.',
            },
            {
                id: 'nucleus',
                name: 'Nucleus',
                dot: 'bg-brand-purple',
                top: '32%',
                left: '70%',
                description: 'Control center of the cell; contains the DNA.',
            },
            {
                id: 'mitochondrion',
                name: 'Mitochondrion',
                dot: 'bg-brand-orange',
                top: '52%',
                left: '66%',
                description: 'Releases energy from food through cellular respiration.',
            },
            {
                id: 'chloroplast',
                name: 'Chloroplast',
                dot: 'bg-success',
                top: '72%',
                left: '66%',
                description: 'Contains chlorophyll and carries out photosynthesis.',
            },
        ],
    },
    {
        id: 'human-heart',
        title: 'Human Heart',
        hint: 'Click on any part to explore',
        image: '/images/landing/hero-human-heart.svg',
        labels: [
            {
                id: 'aorta',
                name: 'Aorta',
                dot: 'bg-danger',
                top: '14%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Largest artery; carries oxygenated blood to the body.',
            },
            {
                id: 'pulmonary-artery',
                name: 'Pulmonary Artery',
                dot: 'bg-info',
                top: '34%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Carries deoxygenated blood from the heart to the lungs.',
            },
            {
                id: 'left-ventricle',
                name: 'Left Ventricle',
                dot: 'bg-danger',
                top: '58%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Pumps oxygenated blood into the aorta.',
            },
            {
                id: 'right-atrium',
                name: 'Right Atrium',
                dot: 'bg-info',
                top: '78%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Receives deoxygenated blood from the body.',
            },
        ],
    },
    {
        id: 'nephron',
        title: 'Human Nephron',
        hint: 'Click on any part to explore',
        image: '/images/landing/hero-human-nephron.svg',
        labels: [
            {
                id: 'bowmans-capsule',
                name: "Bowman's Capsule",
                dot: 'bg-info',
                top: '14%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Cup-shaped structure that collects the filtrate.',
            },
            {
                id: 'glomerulus',
                name: 'Glomerulus',
                dot: 'bg-danger',
                top: '36%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Capillary network where blood is filtered.',
            },
            {
                id: 'loop-of-henle',
                name: 'Loop of Henle',
                dot: 'bg-brand-orange',
                top: '58%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Concentrates the filtrate by reabsorbing water and salts.',
            },
            {
                id: 'collecting-duct',
                name: 'Collecting Duct',
                dot: 'bg-success',
                top: '78%',
                left: '74%',
                mobileLeft: '67%',
                description: 'Carries urine towards the renal pelvis.',
            },
        ],
    },
]

export const platformFeatures = [
    {
        id: 'ai-diagram',
        icon: Sparkles,
        title: 'AI Diagram Generation',
        description: 'Generate accurate, labeled Biology diagrams in seconds.',
        to: '/ai-learn?tab=generate',
        tint: 'bg-linear-to-b from-[#ece3ff] to-[#f7f2ff]',
        accent: 'text-brand-purple',
    },
    {
        id: 'interactive',
        icon: BookOpen,
        title: 'Interactive Learning',
        description: 'Click, explore and understand each structure and function.',
        to: '/diagrams',
        tint: 'bg-linear-to-b from-[#dcebff] to-[#f0f6ff]',
        accent: 'text-info',
    },
    {
        id: 'image-analysis',
        icon: ImageIcon,
        title: 'Image Analysis',
        description: 'Upload any Biology image and get detailed explanations with AI.',
        to: '/ai-learn?tab=analyze',
        tint: 'bg-linear-to-b from-[#ffe9d2] to-[#fff6ec]',
        accent: 'text-brand-orange',
    },
    {
        id: 'practice',
        icon: Target,
        title: 'Practice & Tests',
        description:
            'Identify structures, solve NEET-style questions and improve your accuracy.',
        to: '/practice',
        tint: 'bg-linear-to-b from-[#d9f5df] to-[#effaf1]',
        accent: 'text-success',
    },
    {
        id: 'dashboard',
        icon: ChartColumn,
        title: 'Personalized Dashboard',
        description:
            'Track your learning, progress and focus on weak topics.',
        to: '/dashboard',
        tint: 'bg-linear-to-b from-[#ffe0ea] to-[#fff0f4]',
        accent: 'text-danger',
    },
]

export const chapterClassTabs = [
    { id: '11', label: 'Class 11' },
    { id: '12', label: 'Class 12' },
    { id: 'all', label: 'All Topics' },
]

export const diagramChapters = [
    { id: 'cell', title: 'Cell: The Unit of Life', diagramCount: 12, classLevel: '11', image: '/images/chapters/cell.png', icon: Microscope },
    { id: 'biomolecules', title: 'Biomolecules', diagramCount: 18, classLevel: '11', image: '/images/chapters/biomolecules.png', icon: Atom },
    { id: 'plant-physiology', title: 'Plant Physiology', diagramCount: 15, classLevel: '11', image: '/images/chapters/plant-physiology.png', icon: Sprout },
    { id: 'human-physiology', title: 'Human Physiology', diagramCount: 24, classLevel: '11', image: '/images/chapters/human-physiology.png', icon: HeartPulse },
    { id: 'reproduction', title: 'Reproduction', diagramCount: 16, classLevel: '11', image: '/images/chapters/reproduction.png', icon: Flower2 },
    { id: 'genetics', title: 'Genetics & Evolution', diagramCount: 14, classLevel: '11', image: '/images/chapters/genetics.png', icon: Dna },
    { id: 'flowering-plants', title: 'Sexual Reproduction in Flowering Plants', diagramCount: 13, classLevel: '12', image: '/images/chapters/flowering-plants.png', icon: Flower2 },
    { id: 'human-reproduction', title: 'Human Reproduction', diagramCount: 17, classLevel: '12', image: '/images/chapters/human-reproduction.png', icon: HeartPulse },
    { id: 'inheritance', title: 'Inheritance & Variation', diagramCount: 11, classLevel: '12', image: '/images/chapters/inheritance.png', icon: Dna },
    { id: 'biotechnology', title: 'Biotechnology', diagramCount: 14, classLevel: '12', image: '/images/chapters/biotechnology.png', icon: FlaskConical },
    { id: 'ecosystem', title: 'Ecosystem', diagramCount: 10, classLevel: '12', image: '/images/chapters/ecosystem.png', icon: TreePine },
]

export const demoModeTabs = [
    { id: 'study', label: 'Study Mode' },
    { id: 'label', label: 'Label Mode' },
    { id: 'identify', label: 'Identify Mode' },
]

export const demoBenefits = [
    'Zoom, rotate and explore diagrams',
    'Click on any structure for detailed explanation',
    'Switch between labeled and practice modes',
    'Designed for NEET syllabus',
]

export const nephronStructures = [
    {
        id: 'bowmans-capsule',
        name: 'Bowman’s Capsule',
        top: '12%',
        left: '20%',
        description: 'A cup-shaped structure that surrounds the glomerulus.',
        function: 'Collects the filtrate formed by the glomerulus.',
        location: 'Renal cortex, at the start of the nephron.',
    },
    {
        id: 'glomerulus',
        name: 'Glomerulus',
        top: '38%',
        left: '16%',
        description:
            'A network of capillaries inside Bowman’s capsule that filters blood to form filtrate.',
        function: 'Ultrafiltration of blood.',
        location: 'Inside Bowman’s capsule.',
    },
    {
        id: 'pct',
        name: 'PCT',
        top: '60%',
        left: '34%',
        description: 'Proximal convoluted tubule lined with brush-border cells.',
        function: 'Reabsorbs most nutrients, water and sodium.',
        location: 'Renal cortex, after Bowman’s capsule.',
    },
    {
        id: 'loop-of-henle',
        name: 'Loop of Henle',
        top: '84%',
        left: '30%',
        description: 'A U-shaped tube dipping into the renal medulla.',
        function: 'Concentrates the filtrate by reabsorbing water and salts.',
        location: 'Renal medulla.',
    },
    {
        id: 'dct',
        name: 'DCT',
        top: '8%',
        left: '62%',
        description: 'Distal convoluted tubule, the segment after the loop of Henle.',
        function: 'Selective reabsorption of sodium and water; secretes potassium.',
        location: 'Renal cortex.',
    },
    {
        id: 'collecting-duct',
        name: 'Collecting Duct',
        top: '58%',
        left: '84%',
        description: 'A straight tube that receives filtrate from many nephrons.',
        function: 'Final concentration of urine.',
        location: 'Runs from the cortex into the medulla.',
    },
]

export const assistantPrompts = [
    'Explain this diagram',
    'Generate a diagram of human heart',
    'What is the function of mitochondria?',
    'Compare mitosis and meiosis',
    'Differences between plant and animal cell',
]

export const landingQuestion = {
    prompt: 'Identify the highlighted part.',
    image: '/images/landing/heart-quiz.png',
    correctId: 'B',
    position: '1/10',
    options: [
        { id: 'A', text: 'Aorta' },
        { id: 'B', text: 'Pulmonary Artery' },
        { id: 'C', text: 'Left Ventricle' },
        { id: 'D', text: 'Right Atrium' },
    ],
}

export const trustStats = [
    { id: 'free', icon: GraduationCap, value: '100%', label: 'Free Access', accent: 'text-brand-purple' },
    { id: 'diagrams', icon: ImageIcon, value: '500+', label: 'Diagrams', accent: 'text-info' },
    { id: 'neet', icon: Target, value: 'NEET', label: 'Focused', accent: 'text-danger' },
    { id: 'ai', icon: Zap, value: 'AI-Powered', label: 'Learning', accent: 'text-brand-orange' },
]

export const footerColumns = [
    {
        title: 'Quick Links',
        links: [
            { label: 'Home', to: '/' },
            { label: 'Diagrams', to: '/diagrams' },
            { label: 'AI Learn', to: '/ai-learn' },
            { label: 'Practice', to: '/practice' },
            { label: 'My Learning', to: '/my-learning' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'NEET Syllabus' },
            { label: 'Important Diagrams', to: '/diagrams' },
            { label: 'Study Notes', to: '/my-learning' },
            { label: 'FAQs' },
            { label: 'Contact Us' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy' },
            { label: 'Terms of Use' },
            { label: 'Disclaimer' },
        ],
    },
]

export const footerSocials = [
    { label: 'YouTube', icon: Play, tone: 'bg-red-500' },
    { label: 'Instagram', icon: Camera, tone: 'bg-pink-500' },
    { label: 'Telegram', icon: Send, tone: 'bg-sky-500' },
    { label: 'Discord', icon: MessageCircle, tone: 'bg-indigo-500' },
]
