import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
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

function NoteForm({ onSave, onClose }) {
    const { values, errors, handleChange, handleSubmit } = useForm({
        initialValues: { title: '', content: '' },
        validate: validateNote,
        onSubmit: (note) => {
            onSave({ title: note.title.trim(), content: note.content.trim() })
            toast.success('Note saved')
            onClose()
        },
    })

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
                <label htmlFor="note-title" className="mb-1 block text-sm font-bold">Title</label>
                <input
                    id="note-title"
                    name="title"
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
                    rows={5}
                    value={values.content}
                    onChange={handleChange}
                    className={fieldClasses}
                />
                {errors.content && <p role="alert" className="text-danger mt-1 text-xs">{errors.content}</p>}
            </div>
            <Button type="submit" className="w-full">Save Note</Button>
        </form>
    )
}

function NotesTab({ notes, onAddNote }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="size-4" />
                    Add Note
                </Button>
            </div>

            {notes.length === 0 ? (
                <Card>
                    <EmptyState icon={FileText} title="No notes yet" description="Add your first note to see it here." />
                </Card>
            ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                    {notes.map((note) => (
                        <li key={note.id}>
                            <Card className="h-full p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="flex items-center gap-2 font-extrabold">
                                        <FileText className="text-brand-purple size-5 shrink-0" />
                                        {note.title}
                                    </h3>
                                    <span className="text-ink-500 shrink-0 text-xs">{formatShortDate(note.savedAt)}</span>
                                </div>
                                <p className="text-ink-700 mt-2 text-sm">{note.content}</p>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}

            <Modal isOpen={isModalOpen} title="Add a note" onClose={() => setIsModalOpen(false)}>
                <NoteForm onSave={onAddNote} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    )
}

export default NotesTab