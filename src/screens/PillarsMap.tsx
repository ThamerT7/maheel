import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Lock, Play, Check, BookOpen } from 'lucide-react'
import { islamPillars, imanPillars, getAllLessonIds } from '../data/pillarsData'
import type { IslamPillar, PillarLesson } from '../data/pillarsData'
import { useProgressStore } from '../store/progressStore'

const LEVEL_LABELS = ['تعريف', 'تعلّم', 'تعمّق']

export function PillarsMap() {
  const { completedModules } = useProgressStore()
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)
  const nav = useNavigate()

  const allLessonIds = getAllLessonIds()
  const totalLessons = allLessonIds.length
  const totalCompleted = allLessonIds.filter((id) => completedModules.includes(id)).length
  const progressPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  // SVG circle parameters
  const circleRadius = 54
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  const getPillarCompletedCount = (pillar: IslamPillar) =>
    pillar.lessons.filter((l) => completedModules.includes(l.id)).length

  const getLessonStatus = (pillar: IslamPillar, lesson: PillarLesson) => {
    if (completedModules.includes(lesson.id)) return 'completed'

    // Find the first incomplete lesson in this pillar — that's the "current" one
    const firstIncomplete = pillar.lessons.find((l) => !completedModules.includes(l.id))
    if (firstIncomplete?.id === lesson.id) return 'current'

    return 'locked'
  }

  const handleLessonTap = (lessonId: string, status: string) => {
    if (status === 'locked') return
    nav(`/lesson/${lessonId}`)
  }

  return (
    <div className="pb-24" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="w-10 h-10 rounded-[var(--radius-xl)] bg-white dark:bg-white/5 flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-text dark:text-white rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-text dark:text-white">الأركان</h1>
          <p className="text-xs text-text-muted">أساس دينك</p>
        </div>
      </div>

      {/* Overall progress circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center py-6"
      >
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              className="text-surface-warm dark:text-white/10"
              strokeWidth="10"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={circleRadius}
              fill="none"
              className="text-primary"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={progressPercent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-text dark:text-white"
            >
              {progressPercent}%
            </motion.span>
            <span className="text-xs text-text-muted mt-0.5">مكتمل</span>
          </div>
        </div>
        <p className="text-sm text-text-muted mt-3">
          <span className="font-semibold text-text dark:text-white">{totalCompleted}</span>
          {' '}من{' '}
          <span className="font-semibold text-text dark:text-white">{totalLessons}</span>
          {' '}درس
        </p>
      </motion.div>

      {/* ===== أركان الإسلام ===== */}
      <div className="px-5 mb-2">
        <h2 className="text-lg font-bold text-text dark:text-white">أركان الإسلام</h2>
        <p className="text-xs text-text-muted">خمسة أركان يُبنى عليها الإسلام</p>
      </div>

      {/* Horizontal scrollable pillar cards */}
      <div className="flex gap-3 px-5 pb-4 overflow-x-auto hide-scrollbar">
        {islamPillars.map((pillar, idx) => {
          const completed = getPillarCompletedCount(pillar)
          const isSelected = selectedPillar === pillar.id

          return (
            <motion.button
              key={pillar.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => setSelectedPillar(isSelected ? null : pillar.id)}
              className={`flex-shrink-0 w-28 rounded-[var(--radius-xl)] p-3 text-center transition-all active:scale-[0.97] ${
                isSelected ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
              style={{ backgroundColor: pillar.bgColor }}
            >
              <span className="text-3xl block mb-2">{pillar.emoji}</span>
              <p className="text-sm font-semibold leading-snug mb-1" style={{ color: pillar.color }}>
                {pillar.name}
              </p>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full inline-block"
                style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
              >
                {completed}/{pillar.lessons.length}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Expanded pillar lessons */}
      <AnimatePresence mode="wait">
        {selectedPillar && (() => {
          const pillar = islamPillars.find((p) => p.id === selectedPillar)
          if (!pillar) return null

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="px-5 overflow-hidden"
            >
              <div className="pb-4 space-y-3">
                {pillar.lessons.map((lesson, lessonIdx) => {
                  const status = getLessonStatus(pillar, lesson)
                  const isCompleted = status === 'completed'
                  const isCurrent = status === 'current'
                  const isLocked = status === 'locked'

                  return (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lessonIdx * 0.08 }}
                      onClick={() => handleLessonTap(lesson.id, status)}
                      disabled={isLocked}
                      className={`w-full flex items-center gap-3 p-4 rounded-[var(--radius-xl)] text-right transition-all ${
                        isLocked
                          ? 'bg-surface-warm dark:bg-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-surface-card dark:bg-white/5 shadow-sm active:scale-[0.98]'
                      } ${
                        isCurrent
                          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900'
                          : ''
                      }`}
                    >
                      {/* Level number circle */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isCompleted ? '#DCFCE7' : isLocked ? undefined : pillar.bgColor,
                          color: isCompleted ? '#16A34A' : isLocked ? undefined : pillar.color,
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-text-light" />
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Play className="w-5 h-5" style={{ color: pillar.color }} />
                          </motion.div>
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-muted mb-0.5">
                          المستوى {lesson.level} — {LEVEL_LABELS[lesson.level - 1]}
                        </p>
                        <p
                          className={`text-sm font-semibold leading-snug ${
                            isLocked ? 'text-text-light' : 'text-text dark:text-white'
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <span className="text-[11px] text-text-muted">{lesson.duration}</span>
                      </div>

                      {/* Arrow */}
                      {!isLocked && (
                        <ChevronLeft className="w-4 h-4 text-text-light flex-shrink-0" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ===== أركان الإيمان ===== */}
      <div className="px-5 mt-6 mb-3">
        <h2 className="text-lg font-bold text-text dark:text-white">أركان الإيمان</h2>
        <p className="text-xs text-text-muted">ما تؤمن به</p>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3 pb-6">
        {imanPillars.map((pillar, idx) => {
          const isCompleted = completedModules.includes(pillar.lessonId)

          return (
            <motion.button
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => nav(`/lesson/${pillar.lessonId}`)}
              className="relative text-right rounded-[var(--radius-xl)] p-4 transition-all active:scale-[0.97]"
              style={{ backgroundColor: pillar.bgColor }}
            >
              {/* Completed checkmark */}
              {isCompleted && (
                <div className="absolute top-3 left-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <span className="text-3xl block mb-2">{pillar.emoji}</span>
              <p className="text-sm font-semibold leading-snug mb-1" style={{ color: pillar.color }}>
                {pillar.name}
              </p>
              <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: `${pillar.color}CC` }}>
                {pillar.description}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
