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

export const navigationItems = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: House,
        searchPlaceholder: 'Search diagrams, topics, questions...',
        searchPath: '/diagrams',
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
    },
    {
        key: 'practice',
        label: 'Practice & Tests',
        path: '/practice',
        icon: Target,
        searchPlaceholder: 'Search topics, diagrams, tests...',
    },
    {
        key: 'my-learning',
        label: 'My Learning',
        path: '/my-learning',
        icon: BookOpen,
        searchPlaceholder: 'Search your learning, notes, diagrams...',
    },
    {
        key: 'analytics',
        label: 'Progress & Analytics',
        path: '/analytics',
        icon: ChartColumn,
        searchPlaceholder: 'Search topics, chapters, tests...',
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
    },
]

export function findNavigationItem(pathname) {
    return (
        navigationItems.find((item) => pathname.startsWith(item.path)) ??
        navigationItems[0]
    )
}