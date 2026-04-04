import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, RotateCcw } from 'lucide-react'
import { adhkarCategories } from '../data/adhkarData'
import type { Dhikr } from '../data/adhkarData'

/* ──────────────────────────────────────────────
   Guide category card type
   ────────────────────────────────────────────── */
interface CategoryCard {
  id: string
  title: string
  emoji: string
  bgColor: string
  route: string
  subtitle: string
  comingSoon?: boolean
}

const categories: CategoryCard[] = [
  { id: 'wudu', title: 'الوضوء', emoji: '💧', bgColor: '#DBEAFE', route: '/guides/wudu', subtitle: '٨ خطوات' },
  { id: 'prayer', title: 'الصلاة', emoji: '🕌', bgColor: '#D1FAE5', route: '/guides/prayer', subtitle: '١٠ خطوات' },
  { id: 'adhkar', title: 'الأذكار', emoji: '📿', bgColor: '#FEF3C7', route: '/adhkar', subtitle: '٤ أوقات' },
  { id: 'dua', title: 'الدعاء', emoji: '🤲', bgColor: '#F3E8FF', route: '/dua', subtitle: 'قريباً', comingSoon: true },
  { id: 'tilawa', title: 'التلاوة', emoji: '📖', bgColor: '#CCFBF1', route: '/tilawa', subtitle: 'قريباً', comingSoon: true },
]

/* ──────────────────────────────────────────────
   LearnScreen
   ────────────────────────────────────────────── */
export function LearnScreen() {
  const nav = useNavigate()

  const topTwo = categories.slice(0, 2)
  const adhkarCard = categories[2]
  const bottomTwo = categories.slice(3)

  return (
    <div className="pb-6" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 mb-6">
        <h1 className="text-xl font-bold text-primary dark:text-primary-lightest">تعلّم</h1>
        <p className="text-sm text-text-muted mt-1">النسك العملي — خطوة بخطوة</p>
      </div>

      <div className="px-5 space-y-3">
        {/* Top 2 cards — side by side */}
        <div className="grid grid-cols-2 gap-3">
          {topTwo.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav(cat.route)}
              className="rounded-2xl p-5 text-right shadow-sm hover:shadow-md transition-shadow min-h-[140px] flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-primary"
              style={{ backgroundColor: cat.bgColor }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div className="mt-3">
                <h3 className="font-bold text-text text-base">{cat.title}</h3>
                <p className="text-xs text-text-muted mt-1">{cat.subtitle}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Adhkar card — full width */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => nav(adhkarCard.route)}
          className="w-full rounded-2xl p-5 text-right shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 min-h-[80px] focus-visible:outline-2 focus-visible:outline-primary"
          style={{ backgroundColor: adhkarCard.bgColor }}
        >
          <span className="text-3xl">{adhkarCard.emoji}</span>
          <div className="flex-1">
            <h3 className="font-bold text-text text-base">{adhkarCard.title}</h3>
            <p className="text-xs text-text-muted mt-0.5">{adhkarCard.subtitle}</p>
          </div>
          <ChevronLeft className="w-5 h-5 text-text-light" aria-hidden="true" />
        </motion.button>

        {/* Bottom 2 — coming soon, side by side */}
        <div className="grid grid-cols-2 gap-3">
          {bottomTwo.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav(cat.route)}
              className="relative rounded-2xl p-5 text-right shadow-sm transition-shadow min-h-[140px] flex flex-col justify-between opacity-60 focus-visible:outline-2 focus-visible:outline-primary"
              style={{ backgroundColor: cat.bgColor }}
            >
              {/* Coming soon badge */}
              <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/70 dark:bg-black/30 text-text-muted px-2 py-0.5 rounded-full">
                قريباً
              </span>
              <span className="text-3xl">{cat.emoji}</span>
              <div className="mt-3">
                <h3 className="font-bold text-text text-base">{cat.title}</h3>
                <p className="text-xs text-text-muted mt-1">{cat.subtitle}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   AdhkarScreen
   ────────────────────────────────────────────── */
export function AdhkarScreen() {
  const nav = useNavigate()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [counters, setCounters] = useState<Record<string, number>>({})

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id))
  }

  const incrementCounter = (dhikrId: string, maxCount: number) => {
    setCounters((prev) => {
      const current = prev[dhikrId] ?? 0
      if (current >= maxCount) return prev
      return { ...prev, [dhikrId]: current + 1 }
    })
  }

  const resetCounter = (dhikrId: string) => {
    setCounters((prev) => {
      const next = { ...prev }
      delete next[dhikrId]
      return next
    })
  }

  const getCount = (dhikrId: string) => counters[dhikrId] ?? 0

  const categoryBgColors: Record<string, string> = {
    'after-salah': '#D1FAE5',
    morning: '#FEF3C7',
    evening: '#F3E8FF',
    sleep: '#DBEAFE',
  }

  return (
    <div className="pb-6 min-h-[calc(100dvh-80px)]" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => nav('/learn')}
          className="p-3 hover:bg-surface-warm dark:hover:bg-white/10 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="رجوع"
        >
          <ChevronLeft className="w-5 h-5 text-text-muted rotate-180" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-primary-lightest">الأذكار</h1>
          <p className="text-xs text-text-muted">اختر الوقت المناسب</p>
        </div>
      </div>

      {/* Category cards */}
      <div className="px-5 space-y-3">
        {adhkarCategories.map((category) => {
          const isExpanded = expandedCategory === category.id
          return (
            <div key={category.id}>
              {/* Category card */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(category.id)}
                className="w-full rounded-2xl p-4 text-right shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 min-h-[72px] focus-visible:outline-2 focus-visible:outline-primary"
                style={{ backgroundColor: categoryBgColors[category.id] ?? '#F3EDE3' }}
                aria-expanded={isExpanded}
                aria-controls={`adhkar-${category.id}`}
              >
                <span className="text-2xl">{category.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-text text-base">{category.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{category.description}</p>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="w-5 h-5 text-text-light" aria-hidden="true" />
                </motion.div>
              </motion.button>

              {/* Expanded adhkar list */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`adhkar-${category.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 space-y-2">
                      {category.adhkar.map((dhikr) => (
                        <DhikrCard
                          key={dhikr.id}
                          dhikr={dhikr}
                          currentCount={getCount(dhikr.id)}
                          onIncrement={() => incrementCounter(dhikr.id, dhikr.count)}
                          onReset={() => resetCounter(dhikr.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   DhikrCard — individual dhikr with counter
   ────────────────────────────────────────────── */
interface DhikrCardProps {
  dhikr: Dhikr
  currentCount: number
  onIncrement: () => void
  onReset: () => void
}

function DhikrCard({ dhikr, currentCount, onIncrement, onReset }: DhikrCardProps) {
  const isComplete = currentCount >= dhikr.count
  const progress = Math.min(currentCount / dhikr.count, 1)

  return (
    <motion.div
      layout
      className={`bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm transition-all ${
        isComplete ? 'ring-2 ring-primary/30 dark:ring-primary-lightest/30' : ''
      }`}
    >
      {/* Arabic text */}
      <p className="font-quran text-xl leading-loose text-text dark:text-white mb-3 text-right">
        {dhikr.text}
      </p>

      {/* Translation */}
      <p className="text-sm text-text-muted leading-relaxed mb-3">{dhikr.translation}</p>

      {/* Source + Count badge row */}
      <div className="flex items-center justify-between mb-3">
        {dhikr.source && (
          <span className="text-xs text-text-light bg-surface-warm dark:bg-white/10 px-2 py-1 rounded-lg">
            {dhikr.source}
          </span>
        )}
        <span className="text-xs font-medium text-primary dark:text-primary-lightest bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded-full">
          {currentCount} / {dhikr.count}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface-warm dark:bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isComplete ? 'var(--color-prayer-done)' : 'var(--color-primary)' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Counter + Reset */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onIncrement}
          disabled={isComplete}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-primary ${
            isComplete
              ? 'bg-prayer-done/10 text-prayer-done dark:bg-prayer-done/20 cursor-default'
              : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-lightest active:bg-primary/20'
          }`}
          aria-label={isComplete ? 'اكتمل' : `سبّح — ${currentCount} من ${dhikr.count}`}
        >
          {isComplete ? 'اكتمل ✓' : 'اضغط للتسبيح'}
        </motion.button>
        {currentCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onReset}
            className="p-3 rounded-xl bg-surface-warm dark:bg-white/10 text-text-muted hover:text-danger transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="إعادة العداد"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
