import { useRef, useState } from 'react'
import { Bot, FileText, History, Image as ImageIcon, MessageSquare, Plus, Sparkles, Trash2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import AnalyzeImagePanel from '@/components/ai/AnalyzeImagePanel'
import ChatPanel from '@/components/ai/ChatPanel'
import GenerateImagePanel from '@/components/ai/GenerateImagePanel'
import GenerateSideCard from '@/components/ai/GenerateSideCard'
import SummarizePanel from '@/components/ai/SummarizePanel'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import FeatureChecklist from '@/components/common/FeatureChecklist'
import PageHeader from '@/components/common/PageHeader'
import SectionCard from '@/components/common/SectionCard'
import Tabs from '@/components/common/Tabs'
import { promptTiles, welcomeMessage } from '@/data/mockAi'
import { useConversations } from '@/hooks/useConversations'
import { useDiagramGeneration } from '@/hooks/useDiagramGeneration'
import { getConversation } from '@/services/aiService'
import { cx } from '@/utils/classNames'
import { formatShortDate } from '@/utils/formatters'

const tabs = [
    { id: 'chat', label: 'AI Chat (Ask Anything)', icon: MessageSquare },
    { id: 'analyze', label: 'Analyze Image', icon: ImageIcon },
    { id: 'generate', label: 'Generate Image', icon: Sparkles },
    { id: 'summarize', label: 'Summarize Notes', icon: FileText },
]

const DEFAULT_TILE_COUNT = 4
const DEFAULT_CHAT_COUNT = 3

function createSession(
    key,
    { messages = [welcomeMessage], conversationId = null, draft = '', diagramId = '' } = {},
) {
    return { key, messages, conversationId, draft, diagramId }
}

function AILearn() {
    const [searchParams, setSearchParams] = useSearchParams()
    const generation = useDiagramGeneration()
    const conversations = useConversations()
    const [chatSession, setChatSession] = useState(() =>
        createSession('new', {
            draft: searchParams.get('prompt') ?? '',
            diagramId: searchParams.get('diagram') ?? '',
        }),
    )
    const [activeConversationId, setActiveConversationId] = useState(null)
    const sessionSequence = useRef(0)
    const conversationLoadSequence = useRef(0)
    const [showAllPrompts, setShowAllPrompts] = useState(false)
    const [showAllChats, setShowAllChats] = useState(false)

    const requestedTab = searchParams.get('tab')
    const activeTab = tabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'chat'

    const setActiveTab = (tabId) => setSearchParams({ tab: tabId })

    const startChat = (draft = '') => {
        conversationLoadSequence.current += 1
        sessionSequence.current += 1
        setChatSession(createSession(`chat-${sessionSequence.current}`, { draft }))
        setActiveConversationId(null)
        setActiveTab('chat')
    }

    const openRecentChat = async (chat) => {
        const loadSequence = ++conversationLoadSequence.current
        sessionSequence.current += 1
        const sessionKey = `chat-${sessionSequence.current}`

        try {
            const conversation = await getConversation(chat.id)
            if (loadSequence !== conversationLoadSequence.current) {
                return
            }

            setChatSession(
                createSession(sessionKey, {
                    messages: conversation.messages,
                    conversationId: conversation.id,
                }),
            )
            setActiveConversationId(conversation.id)
            setActiveTab('chat')
        } catch (error) {
            if (loadSequence === conversationLoadSequence.current) {
                toast.error(error.message)
            }
        }
    }

    const deleteChat = async (chat) => {
        try {
            await conversations.remove(chat.id)

            if (chat.id === activeConversationId) {
                startChat()
            }

            toast.success('Chat deleted')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSaved = (conversationId) => {
        setActiveConversationId(conversationId)
        conversations.refresh()
    }

    const handleTile = (tile) => {
        if (tile.prompt) {
            startChat(tile.prompt)
        } else {
            setActiveTab(tile.tab)
        }
    }

    const handleSideGenerate = () => {
        if (generation.generate()) {
            setActiveTab('generate')
        }
    }

    const visibleTiles = showAllPrompts ? promptTiles : promptTiles.slice(0, DEFAULT_TILE_COUNT)
    const visibleChats = showAllChats
        ? conversations.items
        : conversations.items.slice(0, DEFAULT_CHAT_COUNT)

    const renderRecentChats = () => {
        if (conversations.status === 'loading') {
            return <p className="text-ink-500 py-2 text-sm">Loading chats...</p>
        }

        if (conversations.status === 'error') {
            return <p className="text-ink-500 py-2 text-sm">Couldn’t load your chats right now.</p>
        }

        if (visibleChats.length === 0) {
            return <p className="text-ink-500 py-2 text-sm">Your chats will appear here.</p>
        }

        return (
            <ul className="divide-line divide-y">
                {visibleChats.map((chat) => (
                    <li key={chat.id} className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => openRecentChat(chat)}
                            className="hover:bg-page flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-2.5 text-left text-sm"
                        >
                            <MessageSquare className="text-brand-purple size-5 shrink-0" />
                            <span className="flex-1 truncate font-medium">{chat.title}</span>
                            <span className="text-ink-500 shrink-0 text-xs">
                                {formatShortDate(chat.updatedAt)}
                            </span>
                        </button>
                        <button
                            type="button"
                            aria-label={`Delete chat: ${chat.title}`}
                            onClick={() => deleteChat(chat)}
                            className="text-ink-500 hover:bg-danger-soft hover:text-danger shrink-0 rounded-full p-1.5"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <>
            <PageHeader
                icon={Bot}
                title="AI Learn"
                subtitle="Your AI Biology Assistant – Chat, Understand, Analyze & Create."
            >
                <FeatureChecklist
                    items={[
                        'Ask any Biology doubt',
                        'Analyze & explain any image',
                        'Generate custom diagrams',
                        'Get NEET-focused explanations',
                    ]}
                />
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="separate" />

                <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
                    <Card className="min-w-0 p-5">
                        <div hidden={activeTab !== 'chat'}>
                            <div className="mb-3 flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => startChat()}>
                                    <Plus className="size-4" />
                                    New chat
                                </Button>
                            </div>
                            <ChatPanel
                                key={chatSession.key}
                                initialMessages={chatSession.messages}
                                initialConversationId={chatSession.conversationId}
                                initialDraft={chatSession.draft}
                                initialDiagramId={chatSession.diagramId}
                                onSaved={handleSaved}
                                onAttach={() => setActiveTab('analyze')}
                            />
                        </div>
                        <div hidden={activeTab !== 'analyze'}>
                            <AnalyzeImagePanel />
                        </div>
                        <div hidden={activeTab !== 'generate'}>
                            <GenerateImagePanel generation={generation} />
                        </div>
                        <div hidden={activeTab !== 'summarize'}>
                            <SummarizePanel />
                        </div>
                    </Card>

                    <div className="min-w-0 space-y-5">
                        <GenerateSideCard generation={generation} onGenerate={handleSideGenerate} />

                        <SectionCard
                            icon={Zap}
                            title="Try These Prompts"
                            iconClassName="fill-brand-orange text-brand-orange"
                            action={{
                                label: showAllPrompts ? 'Show Less' : 'View All',
                                onClick: () => setShowAllPrompts((current) => !current),
                            }}
                        >
                            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                {visibleTiles.map((tile) => (
                                    <li key={tile.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleTile(tile)}
                                            className={cx(
                                                'flex h-full w-full flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-semibold transition hover:-translate-y-0.5',
                                                tile.tint,
                                            )}
                                        >
                                            <tile.icon className="size-7" />
                                            <span className="text-ink-900">{tile.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>

                        <SectionCard
                            icon={History}
                            title="Recent Chats"
                            iconClassName="text-brand-purple"
                            action={
                                conversations.items.length > DEFAULT_CHAT_COUNT
                                    ? {
                                        label: showAllChats ? 'Show Less' : 'View All',
                                        onClick: () => setShowAllChats((current) => !current),
                                    }
                                    : undefined
                            }
                        >
                            {renderRecentChats()}
                        </SectionCard>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AILearn
