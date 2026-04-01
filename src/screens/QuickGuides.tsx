import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Droplets, Compass, Lightbulb, ArrowRight } from 'lucide-react'
import { wuduGuide, prayerGuide } from '../data/guidesData'
import type { Guide } from '../data/guidesData'

const guides: Record<string, Guide> = {
  wudu: wuduGuide,
  prayer: prayerGuide,
}

const guideIcons: Record<string, React.ReactNode> = {
  wudu: <Droplets className="w-6 h-6" aria-hidden="true" />,
  prayer: <Compass className="w-6 h-6" aria-hidden="true" />,
}

export function QuickGuidesList() {
  const nav = useNavigate()
  return (
    <div className="pb-6" dir="rtl">
      <div className="px-5 pt-6 mb-6">
        <h1 className="text-xl font-bold text-primary dark:text-primary-lightest">أدلة سريعة</h1>
        <p className="text-sm text-text-muted mt-1">مرجعك السريع — يعمل بدون إنترنت</p>
      </div>
      <div className="px-5 space-y-3" role="list" aria-label="قائمة الأدلة">
        {Object.entries(guides).map(([id, guide]) => (
          <button
            key={id}
            onClick={() => nav(`/guides/${id}`)}
            role="listitem"
            aria-label={`${guide.title} — ${guide.steps.length} خطوات`}
            className="w-full flex items-center gap-4 p-5 bg-white dark:bg-white/5 rounded-2xl shadow-sm hover:shadow-md hover:bg-surface-warm dark:hover:bg-white/10 transition-all text-right group min-h-[72px] focus-visible:outline-2 focus-visible:outline-primary"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-lightest">
              {guideIcons[id]}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text dark:text-white">{guide.title}</h3>
              <p className="text-xs text-text-muted mt-0.5">{guide.steps.length} خطوات</p>
            </div>
            <ArrowRight className="w-5 h-5 text-text-light rotate-180 group-hover:text-primary transition-colors" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function QuickGuideView() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const guide = guides[id ?? '']
  const [currentStep, setCurrentStep] = useState(0)
  const [dir, setDir] = useState(1)

  if (!guide) {
    return (
      <div className="flex items-center justify-center min-h-[60dvh]" dir="rtl">
        <p className="text-text-muted">الدليل غير موجود</p>
      </div>
    )
  }

  const step = guide.steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === guide.steps.length - 1

  const goNext = () => {
    if (!isLast) { setDir(1); setCurrentStep((s) => s + 1) }
  }
  const goPrev = () => {
    if (!isFirst) { setDir(-1); setCurrentStep((s) => s - 1) }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] flex flex-col" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => nav('/guides')}
          className="p-3 hover:bg-surface-warm dark:hover:bg-white/10 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="رجوع للأدلة"
        >
          <ChevronLeft className="w-5 h-5 text-text-muted rotate-180" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-primary-lightest">{guide.title}</h1>
          <p className="text-xs text-text-muted" aria-live="polite">
            خطوة {currentStep + 1} من {guide.steps.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-5 h-2 bg-surface-warm dark:bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={guide.steps.length}>
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${((currentStep + 1) / guide.steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={currentStep}
            custom={dir}
            initial={{ x: dir > 0 ? 200 : -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? -200 : 200, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 text-center space-y-5 shadow-lg">
              <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-primary dark:text-primary-lightest">{step.step}</span>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-primary-lightest">{step.title}</h2>
              <p className="text-text-muted leading-relaxed text-base">{step.description}</p>
              {step.tip && (
                <div className="flex items-start gap-3 bg-accent/8 dark:bg-accent/15 rounded-xl p-4 text-right border-r-4 border-accent">
                  <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-text-muted leading-relaxed">{step.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex gap-3">
        <button
          onClick={goPrev}
          disabled={isFirst}
          aria-label="الخطوة السابقة"
          className="flex-1 py-3.5 rounded-2xl border-2 border-primary/20 text-primary dark:text-primary-lightest font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.97] min-h-[48px] focus-visible:outline-2 focus-visible:outline-primary"
        >
          <div className="flex items-center justify-center gap-2">
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            السابق
          </div>
        </button>
        <button
          onClick={isLast ? () => nav('/guides') : goNext}
          aria-label={isLast ? 'إنهاء الدليل' : 'الخطوة التالية'}
          className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-medium transition-all active:scale-[0.97] min-h-[48px] focus-visible:outline-2 focus-visible:outline-white"
        >
          {isLast ? 'إنهاء' : (
            <div className="flex items-center justify-center gap-2">
              التالي
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
