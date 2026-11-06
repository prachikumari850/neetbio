import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    onConfirm,
    onCancel,
}) {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onCancel}>
            <p className="text-ink-700 text-sm">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={onConfirm}>{confirmLabel}</Button>
            </div>
        </Modal>
    )
}

export default ConfirmModal