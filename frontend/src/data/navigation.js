import {
    Bot,
    ChartColumn,
    Heart,
    House,
    BookOpen,
    Settings,
    Sparkles,
    Target,
} from 'lucide-react'

const DIAGRAM_SEARCH_PATH = '/diagrams'

export const navigationItems = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: House,
        searchPlaceholder: 'Search diagrams, topics, questions...',
        searchPath: DIAGRAM_SEARCH_PATH,
    },
    {
        key: 'diagrams',
        label: 'Explore Diagrams',
        path: '/diagrams',
        icon: Bot,
        searchPlaceholder: 'Search diagrams, chapters, topics...',
    },
    {
        key: 'ai-learn',
        label: 'AI Learn',
        path: '/ai-learn',
        icon: Sparkles,
        badge: 'New',
        searchPlaceholder: 'Search topics, diagrams, questions...',
        searchPath: DIAGRAM_SEARCH_PATH,
    },
    {
        key: 'practice',
        label: 'Practice & Tests',
        path: '/practice',
        icon: Target,
        searchPlaceholder: 'Search topics, diagrams, tests...',
        searchPath: DIAGRAM_SEARCH_PATH,
    },
    {
        key: 'my-learning',
        label: 'My Learning',
        path: '/my-learning',
        icon: BookOpen,
        searchPlaceholder: 'Search your learning, notes, diagrams...',
        searchPath: DIAGRAM_SEARCH_PATH,
    },
    {
        key: 'analytics',
        label: 'Progress & Analytics',
        path: '/analytics',
        icon: ChartColumn,
        searchPlaceholder: 'Search topics, chapters, tests...',
        searchPath: DIAGRAM_SEARCH_PATH,
    },
    {
        key: 'bookmarks',
        label: 'Bookmarks',
        path: '/bookmarks',
        icon: Heart,
        searchPlaceholder: 'Search your bookmarks (diagrams, notes, tests)...',
    },
    {
        key: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: Settings,
        searchPlaceholder: 'Search topics, diagrams, tests...',
        searchPath: DIAGRAM_SEARCH_PATH,
    },
]

export function findNavigationItem(pathname) {
    return (
        navigationItems.find((item) => pathname.startsWith(item.path)) ??
        navigationItems[0]
    )
}