import { Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import Avatar from '@/components/common/Avatar'
import { useUserStore } from '@/store/useUserStore'
import { cx } from '@/utils/classNames'

const markdownClasses =
    '[&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_li]:mb-0.5 [&>*:last-child]:mb-0'

function UserMessage({ message }) {
    const user = useUserStore((state) => state.user)

    return (
        <div className="flex items-center justify-end gap-3">
            <p className="bg-brand-purple-soft rounded-2xl px-4 py-2.5 text-sm font-medium break-words">
                {message.content}
            </p>
            <Avatar name={user.name} src={user.avatar} className="size-9" />
        </div>
    )
}

function AssistantMessage({ message }) {
    const hasSources = message.sources?.length > 0

    return (
        <div className="flex items-start gap-3">
            <span className="bg-brand-purple-soft text-brand-purple flex size-9 shrink-0 items-center justify-center rounded-xl">
                <Bot className="size-5" />
            </span>
            <div className="min-w-0">
                <div
                    className={cx(
                        'bg-brand-purple-soft/60 rounded-2xl px-4 py-3 text-sm break-words',
                        markdownClasses,
                    )}
                >
                    {message.content ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                        <span className="text-ink-500 flex items-center gap-2">
                            <Bot className="size-4 animate-pulse" />
                            Thinking...
                        </span>
                    )}
                </div>

                {hasSources && (
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-ink-500 font-semibold">From NEETBIO diagrams:</span>
                        {message.sources.map((source) => (
                            <Link
                                key={source.diagramId}
                                to={`/diagrams?open=${source.diagramId}`}
                                className="border-line text-brand-purple hover:bg-brand-purple-soft rounded-full border bg-white px-3 py-0.5 font-semibold"
                            >
                                {source.title}
                            </Link>
                        ))}
                    </p>
                )}
            </div>
        </div>
    )
}

function ChatMessage({ message }) {
    return message.role === 'user' ? (
        <UserMessage message={message} />
    ) : (
        <AssistantMessage message={message} />
    )
}

export default ChatMessage