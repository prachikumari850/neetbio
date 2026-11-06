import { useState } from 'react'
import { Folder, Layers, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Modal from '@/components/common/Modal'
import ProgressBar from '@/components/common/ProgressBar'
import { BOOKMARK_LIMIT } from '@/data/mockBookmarks'
import { cx } from '@/utils/classNames'

const ALL_FOLDERS = 'all'

function NewFolderForm({ existingFolders, onCreate, onClose }) {
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        const trimmedName = name.trim()

        if (!trimmedName) {
            setError('Enter a folder name.')
            return
        }

        if (existingFolders.some((folder) => folder.toLowerCase() === trimmedName.toLowerCase())) {
            setError('A folder with this name already exists.')
            return
        }

        onCreate(trimmedName)
        toast.success(`Folder “${trimmedName}” created`)
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
                <label htmlFor="folder-name" className="mb-1 block text-sm font-bold">
                    Folder name
                </label>
                <input
                    id="folder-name"
                    value={name}
                    maxLength={30}
                    onChange={(event) => {
                        setName(event.target.value)
                        setError('')
                    }}
                    className="border-line focus:ring-brand-purple/40 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2"
                />
                {error && (
                    <p role="alert" className="text-danger mt-1 text-xs">
                        {error}
                    </p>
                )}
            </div>
            <Button type="submit" className="w-full">
                Create Folder
            </Button>
        </form>
    )
}

function FolderRow({ label, count, icon: Icon, isActive, onClick }) {
    return (
        <button
            type="button"
            aria-pressed={isActive}
            onClick={onClick}
            className={cx(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold',
                isActive ? 'bg-brand-purple-soft text-brand-purple' : 'hover:bg-page',
            )}
        >
            <Icon className="text-brand-orange size-5 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            <span>{count}</span>
        </button>
    )
}

function FolderSidebar({ folders, items, activeFolder, onSelect, onCreate }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <aside className="space-y-5">
            <Card className="p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold">
                        <Folder className="text-brand-orange size-6" />
                        Your Folders
                    </h2>
                    <button
                        type="button"
                        aria-label="Create folder"
                        onClick={() => setIsModalOpen(true)}
                        className="hover:bg-brand-purple-soft rounded-full p-1.5"
                    >
                        <Plus className="size-5" />
                    </button>
                </div>

                <FolderRow
                    label="All Bookmarks"
                    count={items.length}
                    icon={Folder}
                    isActive={activeFolder === ALL_FOLDERS}
                    onClick={() => onSelect(ALL_FOLDERS)}
                />
                {folders.map((folder) => (
                    <FolderRow
                        key={folder}
                        label={folder}
                        count={items.filter((item) => item.folder === folder).length}
                        icon={Folder}
                        isActive={activeFolder === folder}
                        onClick={() => onSelect(folder)}
                    />
                ))}
            </Card>

            <Card className="p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
                    <Layers className="text-brand-purple size-6" />
                    Storage
                </h2>
                <p className="mb-2 text-sm">
                    <strong>
                        {items.length} / {BOOKMARK_LIMIT}
                    </strong>{' '}
                    Bookmarks
                </p>
                <ProgressBar value={(items.length / BOOKMARK_LIMIT) * 100} tone="purple" />
            </Card>

            <Modal isOpen={isModalOpen} title="New folder" onClose={() => setIsModalOpen(false)}>
                <NewFolderForm
                    existingFolders={folders}
                    onCreate={onCreate}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </aside>
    )
}

export default FolderSidebar