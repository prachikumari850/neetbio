import { apiClient } from '@/services/apiClient'

function toQuestion(apiQuestion) {
    return {
        id: apiQuestion.id,
        text: apiQuestion.text,
        options: apiQuestion.options,
        subject: apiQuestion.subject,
        unit: apiQuestion.unit,
        chapter: apiQuestion.chapter,
        topic: apiQuestion.topic,
        difficulty: apiQuestion.difficulty,
        type: apiQuestion.type,
    }
}

function toReviewQuestion(apiQuestion) {
    return {
        ...toQuestion(apiQuestion),
        correctIndex: apiQuestion.correct_index,
        explanation: apiQuestion.explanation,
        optionNotes: apiQuestion.option_notes,
        source: apiQuestion.source,
    }
}

function toResult(apiResult) {
    return {
        evaluation: {
            correct: apiResult.correct,
            wrong: apiResult.wrong,
            unattempted: apiResult.skipped,
            score: apiResult.score,
            maxScore: apiResult.max_score,
            accuracy: apiResult.accuracy,
            details: apiResult.details.map((detail) => ({
                question: toReviewQuestion(detail.question),
                selectedIndex: detail.selected_index ?? undefined,
                isAnswered: detail.is_answered,
                isCorrect: detail.is_correct,
            })),
        },
        timeTakenSec: apiResult.time_taken_sec,
    }
}

function attemptPath(attemptId) {
    return `/practice/attempts/${encodeURIComponent(attemptId)}`
}

export async function getCatalog() {
    const { data } = await apiClient.get('/practice/catalog')

    return {
        totals: data.totals,
        areas: data.areas,
        chapters: data.chapters,
        pyqYears: data.pyq_years,
        mockSizes: data.mock_sizes,
    }
}

export async function startAttempt({ mode, area, chapter, year, areas, count, difficulty }) {
    const { data } = await apiClient.post('/practice/attempts', {
        mode,
        area,
        chapter,
        year,
        areas,
        count,
        difficulty,
    })

    return {
        id: data.id,
        title: data.title,
        durationSec: data.duration_sec,
        questions: data.questions.map(toQuestion),
    }
}

export async function submitAttempt(attemptId, answers) {
    const { data } = await apiClient.post(`${attemptPath(attemptId)}/submit`, { answers })
    return toResult(data)
}

export async function listAttempts() {
    const { data } = await apiClient.get('/practice/attempts')

    return data.items.map((item) => ({
        id: item.id,
        title: item.title,
        subjectId: item.area_id,
        correct: item.correct,
        total: item.total,
        accuracy: item.accuracy,
        minutes: item.minutes,
        takenAt: item.submitted_at,
    }))
}

export async function getPracticeStats() {
    const { data } = await apiClient.get('/practice/stats')

    return {
        attempted: data.attempted,
        correct: data.correct,
        wrong: data.wrong,
        testsCompleted: data.tests_completed,
        accuracy: data.accuracy,
    }
}