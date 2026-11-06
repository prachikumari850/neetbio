import { useEffect, useRef, useState } from 'react'
import { Bot, Mic, Paperclip, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatMessage from '@/components/ai/ChatMessage'
import { createMessage, getSimulatedReply } from '@/utils/aiSimulator'

const REPLY_DELAY_MS = 900

function ChatPanel({ initialMessages, initialPrompt, onAttach }) {
    const [messages, setMessages] = useState(() =>
        initialPrompt
            ? [...initialMessages, createMessage('user', initialPrompt)]
            : initialMessages,
    )
    const [draft, setDraft] = useState('')
    const containerRef = useRef(null)

    const lastMessage = messages[messages.length - 1]
    const isReplying = lastMessage.role === 'user'

    useEffect(() => {
        if (!isReplying) {
            return
        }

        const timer = setTimeout(() => {
            setMessages((current) => [
                ...current,
                createMessage('assistant', getSimulatedReply(lastMessage.content)),
            ])
        }, REPLY_DELAY_MS)

        return () => clearTimeout(timer)
    }, [isReplying, lastMessage])

    useEffect(() => {
        containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }, [messages])

    const handleSubmit = (event) => {
        event.preventDefault()
        const text = draft.trim()

        if (!text || isReplying) {
            return
        }

        setMessages((current) => [...current, createMessage('user', text)])
        setDraft('')
    }

    return (
        <div className="flex flex-col gap-4">
            <div ref={containerRef} className="h-[30rem] space-y-4 overflow-y-auto pr-1">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                {isReplying && (
                    <div className="text-ink-500 flex items-center gap-2 text-sm">
                        <Bot className="size-5 animate-pulse" />
                        Thinking...
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-pill border-line shadow-card flex items-center gap-3 border bg-white py-2 pr-2 pl-4"
            >
                <button
                    type="button"
                    aria-label="Attach an image"
                    onClick={onAttach}
                    className="text-brand-purple hover:bg-brand-purple-soft rounded-full p-1.5"
                >
                    <Paperclip className="size-5" />
                </button>
                <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask a biology question, upload an image, or generate a diagram..."
                    aria-label="Message"
                    className="placeholder:text-ink-500 min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                    type="button"
                    aria-label="Voice input"
                    onClick={() => toast('Voice input will be available once the backend is connected.')}
                    className="text-ink-700 hover:bg-brand-purple-soft rounded-full p-1.5"
                >
                    <Mic className="size-5" />
                </button>
                <button
                    type="submit"
                    aria-label="Send message"
                    disabled={isReplying}
                    className="bg-action-orange flex size-10 items-center justify-center rounded-full text-white disabled:opacity-60"
                >
                    <Send className="size-5" />
                </button>
            </form>

            <p className="text-ink-500 text-center text-xs">
                Replies are simulated. Real AI answers arrive when the backend is connected.
            </p>
        </div>
    )
}

export default ChatPanel