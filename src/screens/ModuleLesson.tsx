import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Check, BookOpen, Lightbulb, Star, Dumbbell } from 'lucide-react'
import { getModuleContent } from '../data/moduleContent'
import { islamPillars, imanPillars } from '../data/pillarsData'
import { useProgressStore } from '../store/progressStore'

export function ModuleLesson() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const content = getModuleContent(id ?? '')
  const { completedModules, completeModule, setCurrentModule } = useProgressStore()
  const isCompleted = completedModules.includes(id ?? '')

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] px-8" dir="rtl">
        <BookOpen className="w-12 h-12 text-text-light mb-4" />
        <p className="text-text-muted text-center">هذا الدرس قيد الإعداد وسيتوفر قريباً إن شاء الله</p>
        <button
          onClick={() => nav('/pillars')}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-2xl font-medium"
        >
          العودة للأركان
        </button>
      </div>
    )
  }

  const handleComplete = () => {
    if (!id) return
    completeModule(id)
    // Find the next lesson in the same pillar
    const allLessons = islamPillars.flatMap((p) => p.lessons)
    const currentIdx = allLessons.findIndex((l) => l.id === id)
    if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
      setCurrentModule(allLessons[currentIdx + 1].id)
    }
    nav('/pillars')
  }

  const sectionIcon = (type: string) => {
    switch (type) {
      case 'ayah': return <Star className="w-4 h-4 text-accent" />
      case 'tip': return <Lightbulb className="w-4 h-4 text-accent" />
      case 'practice': return <Dumbbell className="w-4 h-4 text-primary" />
      default: return null
    }
  }

  return (
    <div className="pb-8" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => nav('/journey')}
          className="p-2 hover:bg-surface-warm rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-text-muted rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-primary truncate">{content.title}</h1>
        </div>
        {isCompleted && (
          <span className="flex items-center gap-1 px-3 py-1 bg-fard-bg rounded-full text-xs font-medium text-primary">
            <Check className="w-3 h-3" />
            مكتمل
          </span>
        )}
      </div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 mb-6"
      >
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <p className="text-text-muted leading-relaxed">{content.intro}</p>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="px-5 space-y-4">
        {content.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {section.type === 'ayah' ? (
              <div
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface-warm) 100%)',
                  border: '1px solid rgba(212,168,83,0.15)',
                }}
              >
                <p className="font-quran text-[1.5rem] leading-[2.2] text-primary text-center mb-3">
                  {section.content}
                </p>
                {section.source && (
                  <p className="text-[11px] text-text-light text-center">{section.source}</p>
                )}
              </div>
            ) : section.type === 'tip' ? (
              <div className="flex items-start gap-3 bg-accent/8 rounded-2xl p-5 border border-accent/10">
                <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-muted leading-relaxed">{section.content}</p>
              </div>
            ) : section.type === 'practice' ? (
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/15">
                <div className="flex items-center gap-2 mb-3">
                  <Dumbbell className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-primary">{section.title}</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{section.content}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5">
                {section.title && (
                  <div className="flex items-center gap-2 mb-3">
                    {sectionIcon(section.type)}
                    <h3 className="font-bold text-text">{section.title}</h3>
                  </div>
                )}
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Complete button */}
      {!isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-5 mt-8"
        >
          <button
            onClick={handleComplete}
            className="w-full py-4 bg-primary text-white rounded-2xl text-lg font-semibold hover:bg-primary-light transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            أكملت هذا الدرس
          </button>
        </motion.div>
      )}

      {isCompleted && (
        <div className="px-5 mt-8">
          <button
            onClick={() => nav('/pillars')}
            className="w-full py-4 border-2 border-primary/20 text-primary rounded-2xl text-lg font-semibold hover:bg-primary/5 transition-colors active:scale-[0.98]"
          >
            العودة للأركان
          </button>
        </div>
      )}
    </div>
  )
}
