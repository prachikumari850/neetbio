import { BookOpen, Calendar, Trophy } from 'lucide-react'
import { practiceSubjects } from '@/data/mockPractice'

const DEFAULT_CHAPTER_COUNT = 10
const RECOMMENDED_CHAPTERS = 2

function findSubject(subjectId) {
    return practiceSubjects.find((subject) => subject.id === subjectId)
}

export function buildMockTests(sizes) {
    return sizes.map((size) => ({
        id: `mock-${size}`,
        title: `Full Syllabus Mock Test – ${size} Questions`,
        meta: `${size} Questions | NEET Pattern`,
        icon: Trophy,
        request: { mode: 'mock', count: size },
    }))
}

export function buildChapterTests(chapters) {
    return chapters.map((chapter) => ({
        id: `chapter-${chapter.name}`,
        title: `${chapter.name} – Chapter Test`,
        meta: `${Math.min(chapter.count, DEFAULT_CHAPTER_COUNT)} Questions | ${findSubject(chapter.subject)?.label ?? 'Biology'}`,
        icon: findSubject(chapter.subject)?.icon ?? BookOpen,
        count: chapter.count,
        request: { mode: 'chapter', chapter: chapter.name },
    }))
}

export function buildPyqTests(years) {
    return years.map(({ year, count }) => ({
        id: `pyq-${year}`,
        title: `NEET ${year} – Previous Year Questions`,
        meta: `${count} Questions | Botany + Zoology`,
        icon: Calendar,
        request: { mode: 'pyq', year },
    }))
}

export function pickRecommended(mockTests, chapterTests) {
    const largestChapters = [...chapterTests]
        .sort((first, second) => second.count - first.count)
        .slice(0, RECOMMENDED_CHAPTERS)

    return [mockTests.at(-1), ...largestChapters].filter(Boolean)
}