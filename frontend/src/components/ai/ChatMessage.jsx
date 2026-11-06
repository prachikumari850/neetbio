import { Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Avatar from '@/components/common/Avatar'
import { useUserStore } from '@/store/useUserStore'
import { cx } from '@/utils/classNames'

const markdownClasses =
    '[&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_li]:mb-0.5 [&>*:last-child]:mb-0'

function ChatMessage({ message }) {
    const user = useUserStore((state) => state.user)

    if (message.role === 'user') {
        return (
            <div className="flex items-center justify-end gap-3">
                <p className="bg-brand-purple-soft rounded-2xl px-4 py-2.5 text-sm font-medium">
                    {message.content}
                </p>
                <Avatar name={user.name} src={user.avatar} className="size-9" />
            </div>
        )
    }

    return (
        <div className="flex items-start gap-3">
            <span className="bg-brand-purple-soft text-brand-purple flex size-9 shrink-0 items-center justify-center rounded-xl">
                <Bot className="size-5" />
            </span>
            <div
                className={cx(
                    'bg-brand-purple-soft/60 min-w-0 rounded-2xl px-4 py-3 text-sm',
                    markdownClasses,
                )}
            >
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
        </div>
    )
}

export default ChatMessage