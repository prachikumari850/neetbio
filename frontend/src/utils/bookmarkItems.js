import { practiceSubjects } from '@/data/mockPractice'

const TITLE_MAX_LENGTH = 150

export function diagramToBookmark(diagram) {
    return {
        id: `diagram-${diagram.id}`,
        type: 'diagram',
        title: diagram.title,
        subtitle: `${diagram.topic} • Class ${diagram.classLevel}`,
        folder: 'Others',
        image: diagram.image,
        link: `/diagrams?open=${diagram.id}`,
    }
}

export function questionToBookmark(question) {
    const subject = practiceSubjects.find((item) => item.id === question.subject)
    const title =
        question.text.length > TITLE_MAX_LENGTH
            ? `${question.text.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`
            : question.text

    return {
        id: `question-${question.id}`,
        type: 'question',
        title,
        subtitle: `${subject?.label ?? 'Biology'} • MCQ`,
        folder: 'Others',
        link: '/practice?tab=practice',
    }
}