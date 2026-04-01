import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock, Clock, ChevronDown, ChevronUp, Play } from 'lucide-react'
import { journeyStages } from '../data/journeyData'
import type { JourneyModule } from '../data/journeyData'
import { useProgressStore } from '../store/progressStore'

export function JourneyMap() {
  const { completedModules, currentModule } = useProgressStore()
  const [expandedStage, setExpandedStage] = useState<string | null>('s1')
  const nav = useNavigate()

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

  const totalCompleted = completedModules.length
  const totalModules = journeyStages.reduce((sum, s) => sum + s.modules.length, 0)

  return (
    <div className="pb-6" dir="rtl">
      <div className="px-5 pt-6 mb-4">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-lightest">خريطة الرحلة</h1>
        <p className="text-sm text-text-muted mt-1">تقدّمك في رحلة التعلم</p>
        {/* Overall progress */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-surface-warm dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / totalModules) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs font-medium text-text-muted">{totalCompleted}/{totalModules}</span>
        </div>
      </div>

      <div className="px-5 space-y-0">
        {journeyStages.map((stage, stageIdx) => {
          const isExpanded = expandedStage === stage.id
          const isLocked = stageIdx > 1
          const completedCount = stage.modules.filter((m) =>
            completedModules.includes(m.id)
          ).length
          const isLastStage = stageIdx === journeyStages.length - 1

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIdx * 0.1 }}
              className="relative"
            >
              {/* Vertical dotted connector between stages */}
              {!isLastStage && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-6 border-r-2 border-dashed border-text-light/20 z-0"
                  style={{ marginTop: '-1px' }}
                />
              )}

              {/* Stage Header Card */}
              <button
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className={`relative z-10 w-full rounded-2xl p-5 text-right transition-all shadow-md ${
                  isLocked ? 'bg-white/60 dark:bg-white/5 opacity-60' : 'bg-white dark:bg-white/5'
                }`}
                style={{ borderRight: `4px solid ${stage.color}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                      style={{ backgroundColor: stage.color }}
                    >
                      {isLocked ? <Lock className="w-5 h-5" /> : stage.stage}
                    </div>
                    <div>
                      <h3 className="font-bold text-text dark:text-white">{stage.name}</h3>
                      <p className="text-xs text-text-muted">{stage.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-medium">
                      {completedCount}/{stage.modules.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-surface dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(completedCount / stage.modules.length) * 100}%`,
                      backgroundColor: stage.color,
                      boxShadow: completedCount > 0 ? `0 0 8px ${stage.color}60` : 'none',
                    }}
                  />
                </div>
              </button>

              {/* Modules */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="pr-8 pt-3 pb-1 space-y-2">
                      {stage.modules.map((mod, modIdx) => {
                        const status = getModuleStatus(mod, stageIdx)
                        return (
                          <div key={mod.id} className="relative">
                            {/* Dotted connector between modules */}
                            {modIdx < stage.modules.length - 1 && (
                              <div className="absolute top-full right-[13px] w-0 h-2 border-r border-dashed border-text-light/15 z-0" />
                            )}
                            <button
                              onClick={() => handleModuleTap(mod, status)}
                              disabled={status === 'locked'}
                              className={`relative z-10 w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-right ${
                                status === 'current'
                                  ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20 shadow-sm'
                                  : status === 'completed'
                                    ? 'bg-fard-bg/50 dark:bg-fard/10 shadow-xs hover:bg-fard-bg/70'
                                    : status === 'locked'
                                      ? 'opacity-40 cursor-not-allowed'
                                      : 'bg-white dark:bg-white/5 shadow-xs hover:bg-surface-warm dark:hover:bg-white/10'
                              }`}
                            >
                              {/* Status icon */}
                              <div className="flex-shrink-0">
                                {status === 'completed' ? (
                                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                  </div>
                                ) : status === 'current' ? (
                                  <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center"
                                  >
                                    <Play className="w-3 h-3 text-primary" />
                                  </motion.div>
                                ) : status === 'locked' ? (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-gray-400" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full border-2 border-text-light/30 bg-white dark:bg-transparent" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  status === 'locked' ? 'text-text-light' : 'text-text dark:text-white'
                                }`}>
                                  {mod.title}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 text-text-light text-xs flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                <span>{mod.duration}</span>
                              </div>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spacer for connector */}
              {!isLastStage && <div className="h-6" />}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
