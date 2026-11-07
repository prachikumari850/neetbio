import { useState } from 'react'
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ConfirmModal from '@/components/common/ConfirmModal'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Modal from '@/components/common/Modal'
import { useForm } from '@/hooks/useForm'
import { formatShortDate } from '@/utils/formatters'

const fieldClasses =
    'border-line w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-purple/40'

function validateNote({ title, content }) {
    const errors = {}

    if (!title.trim()) {
        errors.title = 'Give your note a title.'
    }

    if (!content.trim()) {
        errors.content = 'Write something in the note.'
    }

    return errors
}

function NoteForm({ note, onSave, onClose }) {
    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: { title: note?.title ?? '', content: note?.content ?? '' },
        validate: validateNote,
        onSubmit: async (formValues) => {
            try {
                await onSave({ title: formValues.title.trim(), content: formValues.content.trim() })
                toast.success(note ? 'Note updated' : 'Note saved')
                onClose()
            } catch (error) {
                toast.error(error.message)
            }
        },
    })

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
                <label htmlFor="note-title" className="mb-1 block text-sm font-bold">Title</label>
                <input
                    id="note-title"
                    name="title"
                    maxLength={100}
                    value={values.title}
                    onChange={handleChange}
                    className={fieldClasses}
                />
                {errors.title && <p role="alert" className="text-danger mt-1 text-xs">{errors.title}</p>}
            </div>
            <div>
                <label htmlFor="note-content" className="mb-1 block text-sm font-bold">Note</label>
                <textarea
                    id="note-content"
                    name="content"
                    rows={6}
                    maxLength={5000}
                    value={values.content}
                    onChange={handleChange}
                    className={fieldClasses}
                />
                {errors.content && <p role="alert" className="text-danger mt-1 text-xs">{errors.content}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Note'}
            </Button>
        </form>
    )
}

function NotesTab({ notes }) {
    const [editor, setEditor] = useState(null)
    const [noteToDelete, setNoteToDelete] = useState(null)

    const handleDelete = async () => {
        const note = noteToDelete
        setNoteToDelete(null)

        try {
            await notes.remove(note.id)
            toast.success('Note deleted')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const renderBody = () => {
        if (notes.status === 'loading') {
            return <LoadingSpinner label="Loading notes..." />
        }

        if (notes.status === 'error') {
            return (
                <Card>
                    <EmptyState icon={FileText} title="Couldn’t load your notes" description="Check that the backend is running.">
                        <Button variant="soft" onClick={notes.retry}>Try again</Button>
                    </EmptyState>
                </Card>
            )
        }

        if (notes.items.length === 0) {
            return (
                <Card>
                    <EmptyState icon={FileText} title="No notes yet" description="Add your first note to see it here." />
                </Card>
            )
        }

        return (
            <ul className="grid gap-4 md:grid-cols-2">
                {notes.items.map((note) => (
                    <li key={note.id}>
                        <Card className="h-full p-5">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="flex min-w-0 items-center gap-2 font-extrabold">
                                    <FileText className="text-brand-purple size-5 shrink-0" />
                                    <span className="truncate">{note.title}</span>
                                </h3>
                                <span className="text-ink-500 shrink-0 text-xs">{formatShortDate(note.updatedAt)}</span>
                            </div>
                            <p className="text-ink-700 mt-2 text-sm break-words whitespace-pre-wrap">{note.content}</p>
                            <div className="mt-3 flex justify-end gap-1">
                                <button
                                    type="button"
                                    aria-label={`Edit note: ${note.title}`}
                                    onClick={() => setEditor({ note })}
                                    className="hover:bg-brand-purple-soft rounded-full p-1.5"
                                >
                                    <Pencil className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Delete note: ${note.title}`}
                                    onClick={() => setNoteToDelete(note)}
                                    className="text-ink-500 hover:bg-danger-soft hover:text-danger rounded-full p-1.5"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </Card>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => setEditor({ note: null })}>
                    <Plus className="size-4" />
                    Add Note
                </Button>
            </div>

            {renderBody()}

            <Modal
                isOpen={Boolean(editor)}
                title={editor?.note ? 'Edit note' : 'Add a note'}
                onClose={() => setEditor(null)}
            >
                <NoteForm
                    key={editor?.note?.id ?? 'new'}
                    note={editor?.note}
                    onSave={(data) => (editor.note ? notes.update(editor.note.id, data) : notes.create(data))}
                    onClose={() => setEditor(null)}
                />
            </Modal>

            <ConfirmModal
                isOpen={Boolean(noteToDelete)}
                title="Delete this note?"
                message="This cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setNoteToDelete(null)}
            />
        </div>
    )
}

export default NotesTab