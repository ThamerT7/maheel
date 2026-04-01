import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Play, Lock, ChevronLeft } from 'lucide-react'
import { journeyStages } from '../data/journeyData'
import type { JourneyModule } from '../data/journeyData'
import { useProgressStore } from '../store/progressStore'

const BLOCK_COLORS = [
  'card-block-green',
  'card-block-gold',
  'card-block-blue',
  'card-block-purple',
  'card-block-rose',
]

const MODULE_EMOJIS: Record<string, string> = {
  's1-shahada': '🕋',
  's1-tahara': '💧',
  's1-salah': '🤲',
  's1-fatiha': '📖',
  's1-qibla': '🧭',
  's2-regular': '⏰',
  's2-adhkar': '📿',
  's2-surahs': '🎙️',
  's2-halal': '🍽️',
  's2-questions': '💬',
  's3-pillars-islam': '🏛️',
  's3-pillars-iman': '❤️',
  's3-fiqh': '⚖️',
  's3-shubhat': '🛡️',
  's3-sunnah': '🌿',
  's4-tajweed': '🔊',
  's4-seerah': '🌙',
  's4-madhab': '📚',
  's4-identity': '🌟',
  's4-service': '🤝',
}

export function JourneyMap() {
  const { completedModules, currentModule } = useProgressStore()
  const [activeStage, setActiveStage] = useState<string>('s1')
  const nav = useNavigate()
  const pillsRef = useRef<HTMLDivElement>(null)

  const totalCompleted = completedModules.length
  const totalModules = journeyStages.reduce((sum, s) => sum + s.modules.length, 0)
  const progressPercent = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0

  const getModuleStatus = (mod: JourneyModule, stageIndex: number) => {
    if (completedModules.includes(mod.id)) return 'completed'
    if (currentModule === mod.id) return 'current'
    if (stageIndex > 1) return 'locked'
    return 'available'
  }

  const handleModuleTap = (mod: JourneyModule, status: string) => {
    if (status === 'locked') return
    nav(`/lesson/${mod.id}`)
  }

  const activeStageData = journeyStages.find((s) => s.id === activeStage)
  const activeStageIndex = journeyStages.findIndex((s) => s.id === activeStage)

  // SVG circle parameters
  const circleRadius = 54
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className="pb-24" dir="rtl">
      {/* Header with back + title */}
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="w-10 h-10 rounded-[var(--radius-xl)] bg-white dark:bg-white/5 flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-text dark:text-white rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-text dark:text-white">خريطة الرحلة</h1>
          <p className="text-xs text-text-muted">تقدّمك في رحلة التعلم</p>
        </div>
      </div>

      {/* Circular progress indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center py-6"
      >
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              className="text-surface-warm dark:text-white/10"
              strokeWidth="10"
            />
            {/* Progress arc */}
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
          {/* Center text */}
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
          <span className="font-semibold text-text dark:text-white">{totalModules}</span>
          {' '}درس
        </p>
      </motion.div>

      {/* Pill tabs — horizontal scroll */}
      <div
        ref={pillsRef}
        className="flex gap-2 px-5 pb-5 overflow-x-auto no-scrollbar"
      >
        {journeyStages.map((stage, idx) => {
          const isActive = activeStage === stage.id
          const stageCompleted = stage.modules.filter((m) =>
            completedModules.includes(m.id)
          ).length
          const allDone = stageCompleted === stage.modules.length

          return (
            <motion.button
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => setActiveStage(stage.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-warm dark:bg-white/5 text-text-muted dark:text-white/60'
              }`}
            >
              {stage.name}
              {allDone && ' \u2713'}
            </motion.button>
          )
        })}
      </div>

      {/* Week card for active stage */}
      {activeStageData && (
        <motion.div
          key={activeStageData.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-5"
        >
          {/* Week header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: activeStageData.color }}
              >
                {activeStageData.stage}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text dark:text-white">
                  {activeStageData.name}
                </h2>
                <p className="text-xs text-text-muted">{activeStageData.period}</p>
              </div>
            </div>
            <span className="text-xs text-text-muted bg-surface-warm dark:bg-white/5 px-3 py-1 rounded-full">
              {activeStageData.modules.filter((m) => completedModules.includes(m.id)).length}/
              {activeStageData.modules.length} درس
            </span>
          </div>

          {/* Module grid — 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            {activeStageData.modules.map((mod, modIdx) => {
              const status = getModuleStatus(mod, activeStageIndex)
              const colorClass = BLOCK_COLORS[modIdx % BLOCK_COLORS.length]
              const emoji = MODULE_EMOJIS[mod.id] || '📘'
              const isCompleted = status === 'completed'
              const isCurrent = status === 'current'
              const isLocked = status === 'locked'

              return (
                <motion.button
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: modIdx * 0.07 }}
                  onClick={() => handleModuleTap(mod, status)}
                  disabled={isLocked}
                  className={`relative text-right rounded-[var(--radius-xl)] p-4 transition-all ${colorClass} ${
                    isLocked ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.97]'
                  } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''}`}
                >
                  {/* Completed overlay checkmark */}
                  {isCompleted && (
                    <div className="absolute top-3 left-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" strokeWidth={0} />
                    </div>
                  )}

                  {/* Lock icon for locked */}
                  {isLocked && (
                    <div className="absolute top-3 left-3">
                      <Lock className="w-5 h-5 text-text-light/50" />
                    </div>
                  )}

                  {/* Current indicator */}
                  {isCurrent && (
                    <motion.div
                      className="absolute top-3 left-3"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Play className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}

                  {/* Emoji */}
                  <span className="text-3xl block mb-3">{emoji}</span>

                  {/* Title */}
                  <p
                    className={`text-sm font-semibold leading-snug mb-2 ${
                      isLocked ? 'text-text-light' : 'text-text dark:text-white'
                    } ${isCompleted ? 'line-clamp-2' : 'line-clamp-3'}`}
                  >
                    {mod.title}
                  </p>

                  {/* Duration */}
                  <span className="text-[11px] text-text-muted">{mod.duration}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
