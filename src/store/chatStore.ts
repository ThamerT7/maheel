import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SourceType = 'fard' | 'sunnah' | 'cultural' | 'khilaf'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: SourceType
  timestamp: number
}

interface ChatStore {
  messages: ChatMessage[]
  questionsToday: number
  lastQuestionDate: string | null
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChat: () => void
  canAskToday: () => boolean
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      questionsToday: 0,
      lastQuestionDate: null,
      addMessage: (msg) => {
        const today = new Date().toISOString().split('T')[0]
        const state = get()
        const isNewDay = state.lastQuestionDate !== today
        set({
          messages: [
            ...state.messages,
            { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
          questionsToday: msg.role === 'user' ? (isNewDay ? 1 : state.questionsToday + 1) : state.questionsToday,
          lastQuestionDate: msg.role === 'user' ? today : state.lastQuestionDate,
        })
      },
      clearChat: () => set({ messages: [] }),
      canAskToday: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        if (state.lastQuestionDate !== today) return true
        return state.questionsToday < 10
      },
    }),
    { name: 'maheel_chat' }
  )
)
