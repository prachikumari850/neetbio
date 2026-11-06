import { questionBank } from '@/data/mockQuestions'

const CORRECT_MARKS = 4
const WRONG_MARKS = -1

export function shuffle(items) {
    const copy = [...items]

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
            ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
    }

    return copy
}

export function getQuestionPool({ subjects = 'all', difficulty = 'mixed' }) {
    return questionBank.filter(
        (question) =>
            (subjects === 'all' || subjects.includes(question.subject)) &&
            (difficulty === 'mixed' || question.difficulty === difficulty),
    )
}

export function buildTest(config) {
    const pool = getQuestionPool(config)
    const questions = shuffle(pool).slice(0, config.count)

    return {
        id: config.id,
        title: config.title,
        subjectId: config.subjects === 'all' ? 'mixed' : config.subjects[0],
        questions,
        durationSec: config.durationMin * 60,
        config,
    }
}

export function evaluateTest(questions, answers) {
    const details = questions.map((question) => {
        const selectedIndex = answers[question.id]
        const isAnswered = selectedIndex !== undefined

        return {
            question,
            selectedIndex,
            isAnswered,
            isCorrect: isAnswered && selectedIndex === question.correctIndex,
        }
    })

    const correct = details.filter((detail) => detail.isCorrect).length
    const wrong = details.filter(
        (detail) => detail.isAnswered && !detail.isCorrect,
    ).length

    return {
        details,
        correct,
        wrong,
        unattempted: questions.length - correct - wrong,
        score: correct * CORRECT_MARKS + wrong * WRONG_MARKS,
        maxScore: questions.length * CORRECT_MARKS,
        accuracy: Math.round((correct / questions.length) * 100),
    }
}