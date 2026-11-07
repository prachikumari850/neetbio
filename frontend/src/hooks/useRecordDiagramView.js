import { useEffect } from 'react'
import { recordDiagramView } from '@/services/learningService'
import { useLearningStore } from '@/store/useLearningStore'

export function useRecordDiagramView(diagramId) {
    const refreshSummary = useLearningStore((state) => state.load)

    useEffect(() => {
        if (!diagramId) {
            return
        }

        recordDiagramView(diagramId)
            .then(refreshSummary)
            .catch(() => {
                // Studying still works if the view cannot be recorded.
            })
    }, [diagramId, refreshSummary])
}