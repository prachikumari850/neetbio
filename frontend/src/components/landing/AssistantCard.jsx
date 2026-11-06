import { useState } from 'react'
import { Bot, MessageCircle, Search, Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import { assistantPrompts } from '@/data/landingContent'

function AssistantCard() {
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const trimmedMessage = message.trim()

        if (!trimmedMessage) {
            toast.error('Type a Biology question first.')
            return
        }

        navigate(`/ai-learn?prompt=${encodeURIComponent(trimmedMessage)}`)
    }

    return (
        <section className="rounded-card border-line shadow-card border bg-linear-to-br from-[#fde7f3] to-[#efe6ff] p-6">
            <div className="flex items-start gap-3">
                <span className="bg-accent-pink/15 text-accent-pink flex size-12 shrink-0 items-center justify-center rounded-full">
                    <Sparkles className="size-6" />
                </span>
                <div>
                    <h2 className="text-xl font-extrabold">Your AI Biology Assistant</h2>
                    <p className="text-ink-700 text-sm">
                        Ask questions, analyze any Biology image or generate new diagrams
                        instantly.
                    </p>
                </div>
            </div>

            <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
                <ul className="space-y-2">
                    {assistantPrompts.map((prompt) => (
                        <li key={prompt}>
                            <button
                                type="button"
                                onClick={() => setMessage(prompt)}
                                className="border-line hover:bg-brand-purple-soft flex w-full items-center gap-2 rounded-xl border bg-white/80 px-3 py-2 text-left text-xs font-medium"
                            >
                                <MessageCircle className="text-brand-purple size-4 shrink-0" />
                                {prompt}
                            </button>
                        </li>
                    ))}
                </ul>

                <AssetImage
                    src="/images/landing/ai-robot.png"
                    className="hidden h-44 object-contain sm:block"
                    fallback={<Bot className="text-brand-purple hidden size-24 sm:block" />}
                />
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-pill border-line shadow-card mt-4 flex items-center gap-3 border bg-white py-2 pr-2 pl-4"
            >
                <Search className="text-ink-500 size-5 shrink-0" />
                <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Ask anything about Biology..."
                    aria-label="Ask anything about Biology"
                    className="placeholder:text-ink-500 min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                    type="submit"
                    aria-label="Send question"
                    className="bg-action-orange flex size-9 items-center justify-center rounded-full text-white"
                >
                    <Send className="size-4" />
                </button>
            </form>
        </section>
    )
}

export default AssistantCard