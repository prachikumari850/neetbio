import { useState } from 'react'
import { Bot, FileText, History, Image as ImageIcon, MessageSquare, Sparkles, Zap } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AnalyzeImagePanel from '@/components/ai/AnalyzeImagePanel'
import ChatPanel from '@/components/ai/ChatPanel'
import GenerateImagePanel from '@/components/ai/GenerateImagePanel'
import GenerateSideCard from '@/components/ai/GenerateSideCard'
import SummarizePanel from '@/components/ai/SummarizePanel'
import Card from '@/components/common/Card'
import FeatureChecklist from '@/components/common/FeatureChecklist'
import PageHeader from '@/components/common/PageHeader'
import SectionCard from '@/components/common/SectionCard'
import Tabs from '@/components/common/Tabs'
import { promptTiles, recentChats, welcomeMessage } from '@/data/mockAi'
import { useDiagramGeneration } from '@/hooks/useDiagramGeneration'
import { cx } from '@/utils/classNames'

const tabs = [
    { id: 'chat', label: 'AI Chat (Ask Anything)', icon: MessageSquare },
    { id: 'analyze', label: 'Analyze Image', icon: ImageIcon },
    { id: 'generate', label: 'Generate Image', icon: Sparkles },
    { id: 'summarize', label: 'Summarize Notes', icon: FileText },
]

const DEFAULT_TILE_COUNT = 4
const DEFAULT_CHAT_COUNT = 3

function AILearn() {
    const [searchParams, setSearchParams] = useSearchParams()
    const generation = useDiagramGeneration()
    const [chatSession, setChatSession] = useState(() => ({
        key: 'new',
        messages: [welcomeMessage],
        prompt: searchParams.get('prompt'),
    }))
    const [showAllPrompts, setShowAllPrompts] = useState(false)
    const [showAllChats, setShowAllChats] = useState(false)

    const requestedTab = searchParams.get('tab')
    const activeTab = tabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'chat'

    const setActiveTab = (tabId) => setSearchParams({ tab: tabId })

    const startChat = (prompt) => {
        setChatSession({ key: `chat-${Date.now()}`, messages: [welcomeMessage], prompt })
        setActiveTab('chat')
    }

    const openRecentChat = (chat) => {
        setChatSession({ key: chat.id, messages: chat.messages, prompt: null })
        setActiveTab('chat')
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
    const visibleChats = showAllChats ? recentChats : recentChats.slice(0, DEFAULT_CHAT_COUNT)

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
                    <Card className="p-5">
                        <div hidden={activeTab !== 'chat'}>
                            <ChatPanel
                                key={chatSession.key}
                                initialMessages={chatSession.messages}
                                initialPrompt={chatSession.prompt}
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

                    <div className="space-y-5">
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
                            action={{
                                label: showAllChats ? 'Show Less' : 'View All',
                                onClick: () => setShowAllChats((current) => !current),
                            }}
                        >
                            <ul className="divide-line divide-y">
                                {visibleChats.map((chat) => (
                                    <li key={chat.id}>
                                        <button
                                            type="button"
                                            onClick={() => openRecentChat(chat)}
                                            className="hover:bg-page flex w-full items-center gap-3 rounded-lg px-1 py-2.5 text-left text-sm"
                                        >
                                            <MessageSquare className="text-brand-purple size-5 shrink-0" />
                                            <span className="flex-1 font-medium">{chat.title}</span>
                                            <span className="text-ink-500 shrink-0 text-xs">{chat.when}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AILearn