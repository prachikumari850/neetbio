import { practiceSubjects } from '@/data/mockPractice'

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

    return {
        id: `question-${question.id}`,
        type: 'question',
        title: question.text,
        subtitle: `${subject?.label ?? 'Biology'} • MCQ`,
        folder: 'Others',
        link: '/practice?tab=practice',
    }
}