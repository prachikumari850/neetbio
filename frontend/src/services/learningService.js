import { apiClient } from '@/services/apiClient'

function utcOffsetMinutes() {
    return -new Date().getTimezoneOffset()
}

function offsetParams() {
    return { params: { utc_offset_minutes: utcOffsetMinutes() } }
}

function toChapter(item) {
    return {
        name: item.name,
        subject: item.subject,
        total: item.total,
        answered: item.answered,
        mastered: item.mastered,
        progress: item.progress,
        accuracy: item.accuracy,
        lastPracticed: item.last_practiced,
        diagramId: item.diagram_id,
    }
}

function toNote(note) {
    return {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
    }
}

export async function getLearningSummary() {
    const { data } = await apiClient.get('/learning/summary', offsetParams())
    const { stats } = data

    return {
        streak: { current: data.streak.current, todayActive: data.streak.today_active },
        goals: data.goals,
        stats: {
            testsCompleted: stats.tests_completed,
            questionsAttempted: stats.questions_attempted,
            correct: stats.correct,
            wrong: stats.wrong,
            accuracy: stats.accuracy,
            practiceTimeSec: stats.practice_time_sec,
            diagramsStudied: stats.diagrams_studied,
            chaptersStudied: stats.chapters_studied,
            chaptersCompleted: stats.chapters_completed,
            chaptersTotal: stats.chapters_total,
            questionsTotal: stats.questions_total,
            questionsMastered: stats.questions_mastered,
            progress: stats.progress,
        },
        units: data.units,
        continueItem: data.continue_item ? toChapter(data.continue_item) : null,
        inProgress: data.in_progress.map(toChapter),
        completed: data.completed.map(toChapter),
        activity: data.activity,
        recommendations: {
            diagrams: data.recommendations.diagrams.map((item) => ({
                id: item.diagram_id,
                title: item.title,
                topic: item.topic,
                chapter: item.chapter,
                classLevel: item.class_level,
                image: item.image,
                reason: item.reason,
            })),
            practice: data.recommendations.practice,
        },
    }
}

export async function saveGoalTargets(targets) {
    const { data } = await apiClient.put('/learning/goals', targets)
    return data
}

export async function recordDiagramView(diagramId) {
    await apiClient.post('/learning/diagram-views', { diagram_id: diagramId })
}

export async function getAnalytics() {
    const { data } = await apiClient.get('/analytics/overview', offsetParams())

    return {
        totals: {
            testsCompleted: data.totals.tests_completed,
            questionsAttempted: data.totals.questions_attempted,
            correct: data.totals.correct,
            wrong: data.totals.wrong,
            skipped: data.totals.skipped,
            accuracy: data.totals.accuracy,
            practiceTimeSec: data.totals.practice_time_sec,
        },
        progress: {
            totalQuestions: data.progress.total_questions,
            mastered: data.progress.mastered,
            percent: data.progress.percent,
        },
        accuracyChange: data.accuracy_change,
        areas: data.areas,
        weeklyTrend: data.weekly_trend.map((week) => ({
            weekStart: week.week_start,
            accuracy: week.accuracy,
        })),
        tests: data.tests.map((test) => ({
            id: test.id,
            title: test.title,
            submittedAt: test.submitted_at,
            score: test.score,
            maxScore: test.max_score,
            accuracy: test.accuracy,
        })),
        questionAnalysis: data.question_analysis,
        chapters: data.chapters,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        insights: data.insights,
        excludedAttempts: data.excluded_attempts,
        minSample: data.min_sample,
    }
}

export async function listNotes() {
    const { data } = await apiClient.get('/notes')
    return data.items.map(toNote)
}

export async function createNote(note) {
    const { data } = await apiClient.post('/notes', note)
    return toNote(data)
}

export async function updateNote(noteId, note) {
    const { data } = await apiClient.put(`/notes/${encodeURIComponent(noteId)}`, note)
    return toNote(data)
}

export async function deleteNote(noteId) {
    await apiClient.delete(`/notes/${encodeURIComponent(noteId)}`)
}