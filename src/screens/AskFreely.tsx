import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, Key, Clock } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import type { ChatMessage } from '../store/chatStore'
import { SourceBadge } from '../components/SourceBadge'
import { askAI } from '../services/aiChat'
import { APP_CONFIG } from '../config'

const suggestedQuestions = [
  'هل صلاتي صحيحة بالفاتحة فقط؟',
  'نسيت الوضوء — ماذا أفعل؟',
  'كيف أشرح إسلامي لأهلي؟',
  'هل الشك طبيعي؟',
  'ما الفرق بين الفرض والسنة؟',
]

const quickChips = [
  'ملخص الصلاة',
  'خطة تعلّم',
  'أحكام الوضوء',
]

export function AskFreely() {
  const { messages, addMessage, canAskToday } = useChatStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('maheel_api_key') ?? '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const send = async (text: string) => {
    if (!text.trim() || !canAskToday()) return
    const question = text.trim()
    addMessage({ role: 'user', content: question })
    setInput('')
    setIsTyping(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const resp = await askAI(question, history, apiKey || undefined)
      addMessage({ role: 'assistant', content: resp.content, source: resp.source })
    } catch {
      addMessage({
        role: 'assistant',
        content: 'عذراً، حدث خطأ. حاول مرة أخرى أو تواصل مع إمام المسجد القريب.',
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const handleSaveKey = () => {
    localStorage.setItem('maheel_api_key', apiKey)
    setShowKeyInput(false)
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)]" dir="rtl">
      {/* AI Header */}
      <div className="relative overflow-hidden rounded-b-[var(--radius-2xl)]" style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #C7D2FE 50%, #DDD6FE 100%)' }}>
        <div className="absolute top-2 right-8 w-24 h-24 rounded-full bg-white/20" />
        <div className="absolute bottom-0 left-4 w-16 h-16 rounded-full bg-primary/10" />
        <div className="relative z-10 px-5 pt-6 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">المساعد الذكي</h1>
                <p className="text-xs text-primary/60">اسأل بحرية — لا يوجد سؤال محرج</p>
              </div>
            </div>
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2.5 rounded-[var(--radius-md)] bg-white/40 hover:bg-white/60 transition-colors"
              aria-label="إعدادات API"
            >
              <Key className={`w-4 h-4 ${apiKey ? 'text-primary' : 'text-primary/40'}`} />
            </button>
          </div>

          {!apiKey && messages.length === 0 && (
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
              <Clock className="w-3.5 h-3.5 text-primary/60" />
              <span className="text-xs text-primary/70">يعمل بردود تجريبية — اضغط 🔑 لتفعيل AI</span>
            </div>
          )}
        </div>
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <div className="px-5 py-3">
          <div className="card-elevated p-4 space-y-3">
            <p className="text-xs text-text-muted">أدخل مفتاح Anthropic API لتفعيل الذكاء الاصطناعي:</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-surface dark:bg-white/10 rounded-[var(--radius-md)] px-4 py-3 text-sm placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 border border-text-light/10"
              dir="ltr"
            />
            <button
              onClick={handleSaveKey}
              className="w-full py-2.5 bg-primary text-white rounded-[var(--radius-md)] text-sm font-medium"
            >
              {apiKey ? 'حفظ المفتاح' : 'متابعة بدون مفتاح'}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 space-y-3 pb-4 pt-4"
        role="log"
        aria-label="المحادثة"
        aria-live="polite"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <p className="text-text-muted text-center text-sm">ابدأ بسؤالك أو اختر من الاقتراحات</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-white dark:bg-white/10 rounded-[var(--radius-xl)] rounded-tr-[var(--radius-sm)] p-4 max-w-[85%] shadow-sm"
            aria-label="جاري الكتابة"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary/40 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Chips + Suggested */}
      {messages.length === 0 && (
        <div className="px-5 pb-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {quickChips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="flex-shrink-0 px-4 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-colors min-h-[40px]"
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar" role="list" aria-label="أسئلة مقترحة">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="flex-shrink-0 px-4 py-2.5 bg-surface-warm dark:bg-white/10 rounded-full text-sm font-medium text-text-muted hover:bg-primary hover:text-white transition-colors border border-text-light/10 min-h-[40px]"
                role="listitem"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {!canAskToday() && (
          <p className="text-sm text-prayer-missed text-center mb-2">
            وصلت الحد اليومي ({APP_CONFIG.dailyQuestionLimit} أسئلة). عُد غداً
          </p>
        )}
        <div className="flex gap-2 items-center bg-white dark:bg-white/10 rounded-[var(--radius-xl)] px-2 py-1.5 shadow-sm border border-text-light/10 dark:border-white/10">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            disabled={!canAskToday() || isTyping}
            aria-label="اكتب سؤالك"
            className="flex-1 bg-transparent px-3 py-2.5 text-base placeholder:text-text-light focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || !canAskToday() || isTyping}
            aria-label="إرسال السؤال"
            className="w-10 h-10 bg-primary rounded-[var(--radius-md)] flex items-center justify-center text-white disabled:opacity-30 transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex"
      role="article"
      aria-label={isUser ? 'سؤالك' : 'الإجابة'}
    >
      <div
        className={`max-w-[85%] rounded-[var(--radius-xl)] p-4 ${
          isUser
            ? 'bg-primary text-white rounded-tl-[var(--radius-sm)] shadow-sm'
            : 'bg-white dark:bg-white/10 text-text dark:text-white rounded-tr-[var(--radius-sm)] shadow-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
        {message.source && (
          <div className="mt-2">
            <SourceBadge type={message.source} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
