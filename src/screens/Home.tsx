import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, CheckCircle2, Settings, Flame, Bell, ChevronDown
} from 'lucide-react'
import { useGreeting, useHijriDate, useDaysSinceSahada } from '../hooks/useGreeting'
import { useUserStore } from '../store/userStore'
import { usePrayerStore, PRAYER_LABELS } from '../store/prayerStore'
import type { PrayerName, PrayerStatus } from '../store/prayerStore'
import { useProgressStore } from '../store/progressStore'
import { islamPillars } from '../data/pillarsData'
import { getTodayWird } from '../data/wirdData'
import { usePrayerTimes, getNextPrayer } from '../hooks/usePrayerTimes'
import { useNavigate } from 'react-router-dom'

const today = new Date().toISOString().split('T')[0]
const prayerNames: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
const dayLabels = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']

function usePrayerStreak() {
  const days = usePrayerStore((s) => s.days)
  return useMemo(() => {
    let streak = 0
    const d = new Date()
    const todayStr = d.toISOString().split('T')[0]
    const todayDay = days[todayStr]
    if (todayDay && prayerNames.every((p) => todayDay.prayers[p] === 'done')) streak++
    d.setDate(d.getDate() - 1)
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0]
      const day = days[dateStr]
      if (!day || !prayerNames.every((p) => day.prayers[p] === 'done')) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }, [days])
}

function useDailyTask() {
  const currentModule = useProgressStore((s) => s.currentModule)
  return useMemo(() => {
    const allLessons = islamPillars.flatMap((p) => p.lessons)
    return allLessons.find((l) => l.id === currentModule) ?? allLessons[0]
  }, [currentModule])
}

function useWeekPrayers() {
  const days = usePrayerStore((s) => s.days)
  return useMemo(() => {
    const now = new Date()
    const todayIdx = now.getDay()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - todayIdx + i)
      const dateStr = d.toISOString().split('T')[0]
      const dayData = days[dateStr]
      const done = dayData ? prayerNames.filter((p) => dayData.prayers[p] === 'done').length : 0
      return { day: dayLabels[i], done, isToday: i === todayIdx }
    })
  }, [days])
}

export function Home() {
  const greeting = useGreeting()
  const hijri = useHijriDate()
  const shahadaDate = useUserStore((s) => s.shahadaDate)
  const daysCount = useDaysSinceSahada(shahadaDate)
  const prayerDays = usePrayerStore((s) => s.days)
  const togglePrayer = usePrayerStore((s) => s.togglePrayer)
  const prayerDay = prayerDays[today] ?? { date: today, prayers: { fajr: 'pending' as const, dhuhr: 'pending' as const, asr: 'pending' as const, maghrib: 'pending' as const, isha: 'pending' as const } }
  const nav = useNavigate()
  const streak = usePrayerStreak()
  const dailyTask = useDailyTask()
  const wird = useMemo(() => getTodayWird(), [])
  const { times: prayerTimes } = usePrayerTimes()
  const nextPrayer = useMemo(() => prayerTimes ? getNextPrayer(prayerTimes) : null, [prayerTimes])
  const todayDone = prayerNames.filter((p) => prayerDay.prayers[p] === 'done').length
  const weekPrayers = useWeekPrayers()
  const completedModules = useProgressStore((s) => s.completedModules)
  const totalLessons = useMemo(() => islamPillars.flatMap((p) => p.lessons).length, [])
  const progressPct = totalLessons > 0 ? Math.round((completedModules.length / totalLessons) * 100) : 0
  const [wirdExpanded, setWirdExpanded] = useState(false)

  // Find which pillar the current lesson belongs to
  const currentPillar = useMemo(() => {
    return islamPillars.find((p) => p.lessons.some((l) => l.id === dailyTask.id))
  }, [dailyTask])

  return (
    <div className="pb-6">
      {/* ── Header ── */}
      <div className="px-5 pt-8 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-xl">🌙</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text dark:text-white">{greeting}</h1>
              <p className="text-xs text-text-muted mt-0.5">
                {hijri}{daysCount != null ? ` · يوم ${daysCount}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 shadow-xs flex items-center justify-center relative">
              <Bell className="w-[18px] h-[18px] text-text-muted" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
            </button>
            <button
              onClick={() => nav('/settings')}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 shadow-xs flex items-center justify-center"
              aria-label="الإعدادات"
            >
              <Settings className="w-[18px] h-[18px] text-text-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero: Next Lesson ── */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-5 pb-4 relative overflow-hidden"
          style={{ background: `linear-gradient(145deg, ${currentPillar?.bgColor ?? '#D1FAE5'} 0%, ${currentPillar?.bgColor ?? '#D1FAE5'}88 100%)` }}
        >
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/25" />
          <div className="absolute -bottom-8 -right-4 w-28 h-28 rounded-full" style={{ background: `${currentPillar?.color ?? '#1B4332'}10` }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <span className="px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-xl text-[11px] font-bold" style={{ color: currentPillar?.color ?? '#1B4332' }}>
                {currentPillar?.emoji} {currentPillar?.name ?? 'الدرس التالي'}
              </span>
              {nextPrayer && (
                <span className="px-2.5 py-1 bg-white/50 rounded-lg text-[10px] font-semibold" style={{ color: `${currentPillar?.color ?? '#1B4332'}99` }}>
                  {nextPrayer.nameAr} {nextPrayer.time}
                </span>
              )}
            </div>

            <h2 className="text-[17px] font-bold leading-relaxed mb-1" style={{ color: currentPillar?.color ?? '#1B4332' }}>{dailyTask.title}</h2>
            <p className="text-xs mb-4" style={{ color: `${currentPillar?.color ?? '#1B4332'}80` }}>{dailyTask.duration}</p>

            <button
              onClick={() => nav(`/lesson/${dailyTask.id}`)}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-bold text-sm active:scale-[0.97] transition-transform"
              style={{ background: currentPillar?.color ?? '#1B4332', boxShadow: `0 4px 16px ${currentPillar?.color ?? '#1B4332'}40` }}
            >
              <Play className="w-4 h-4" />
              ابدأ الآن
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Prayer Tracker ── */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-bold text-text dark:text-white">صلوات الأسبوع</h2>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(212, 168, 83, 0.12)' }}>
                <Flame className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-accent">{streak}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-5">
            {weekPrayers.map((w) => {
              const bg = w.done === 5
                ? 'bg-prayer-done'
                : w.done > 0
                ? 'bg-[#FEF3C7]'
                : w.isToday
                ? 'bg-primary/8'
                : 'bg-[#F5F3EF] dark:bg-white/5'
              const text = w.done === 5
                ? 'text-white'
                : w.done > 0
                ? 'text-amber-700'
                : w.isToday
                ? 'text-primary font-bold'
                : 'text-text-light'
              return (
                <div key={w.day} className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] ${w.isToday ? 'text-primary font-bold' : 'text-text-light'}`}>{w.day}</span>
                  <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                    <span className={`text-[11px] font-semibold ${text}`}>
                      {w.done === 5 ? '✓' : w.done > 0 ? w.done : '–'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-text dark:text-white">اليوم</span>
            <span className="text-[11px] text-text-light font-medium">{todayDone} من ٥</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {prayerNames.map((p) => {
              const status = prayerDay.prayers[p]
              const pKey = (p.charAt(0).toUpperCase() + p.slice(1)) as keyof NonNullable<typeof prayerTimes>
              return (
                <PrayerChip
                  key={p}
                  label={PRAYER_LABELS[p]}
                  status={status}
                  onTap={() => togglePrayer(today, p)}
                  time={prayerTimes?.[pKey]}
                />
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Daily Wird ── */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={() => setWirdExpanded(!wirdExpanded)}
            className="w-full rounded-3xl p-5 text-right relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <motion.div
                animate={{ rotate: wirdExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-amber-700/50" />
              </motion.div>
              <span className="text-[11px] font-bold text-accent">📿 ورد اليوم</span>
            </div>
            <p className="font-quran text-lg leading-[2] text-primary text-center">
              {wird.ayah.arabic}
            </p>
            <p className="text-[11px] text-text-muted text-center mt-1">{wird.ayah.translation}</p>
            <p className="text-[10px] text-amber-700/40 text-center mt-1">
              سورة {wird.ayah.surah} · آية {wird.ayah.number}
            </p>
          </button>

          <AnimatePresence>
            {wirdExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-2.5 space-y-2.5">
                  {/* Dhikr */}
                  <div className="rounded-2xl p-4" style={{ background: '#D1FAE5' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-primary/50">ذكر</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/50 text-primary font-bold">{wird.dhikr.count}×</span>
                    </div>
                    <p className="text-sm font-semibold text-primary leading-relaxed">{wird.dhikr.text}</p>
                    <p className="text-[10px] text-primary/50 mt-1.5">{wird.dhikr.virtue}</p>
                  </div>

                  {/* Dua */}
                  <div className="rounded-2xl p-4" style={{ background: '#F3E8FF' }}>
                    <span className="text-[10px] font-bold text-purple-700/50 mb-2 block">دعاء</span>
                    <p className="text-sm font-semibold text-purple-900 leading-relaxed">{wird.dua.arabic}</p>
                    <p className="text-[10px] text-purple-700/50 mt-1.5">{wird.dua.translation}</p>
                    <p className="text-[9px] text-purple-700/30 mt-1">{wird.dua.source}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Progress + Streak row ── */}
      <div className="px-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Progress card */}
          <button onClick={() => nav('/pillars')} className="rounded-3xl p-4 flex flex-col items-center justify-center active:scale-[0.97] transition-transform" style={{ background: '#D1FAE5' }}>
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#1B433220" strokeWidth="3.5" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#1B4332" strokeWidth="3.5"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPct / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">{progressPct}%</span>
            </div>
            <p className="text-xs font-bold text-primary">الأركان</p>
            <p className="text-[10px] text-primary/50">{completedModules.length} من {totalLessons}</p>
          </button>

          {/* Streak card */}
          <div className="rounded-3xl p-4 flex flex-col items-center justify-center" style={{ background: '#FEF3C7' }}>
            <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center mb-2">
              <Flame className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xl font-bold text-amber-800">{streak}</p>
            <p className="text-[10px] text-amber-700/60">{streak === 1 ? 'يوم' : streak <= 10 ? 'أيام' : 'يوماً'} متواصلة</p>
          </div>
        </motion.div>
      </div>

      {/* ── Quick Links ── */}
      <div className="mb-5">
        <h3 className="text-[13px] font-bold text-text dark:text-white px-5 mb-3">تعلّم سريع</h3>
        <div className="px-5 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2.5" style={{ width: 'max-content' }}>
            {[
              { label: 'الوضوء', emoji: '💧', path: '/guides/wudu', bg: '#DBEAFE' },
              { label: 'الصلاة', emoji: '🕌', path: '/guides/prayer', bg: '#D1FAE5' },
              { label: 'الأذكار', emoji: '📿', path: '/adhkar', bg: '#FEF3C7' },
              { label: 'الأركان', emoji: '☝️', path: '/pillars', bg: '#F3E8FF' },
              { label: 'الأوقات', emoji: '🕐', path: '/prayer-times', bg: '#FFE4E6' },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => nav(q.path)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl active:scale-[0.96] transition-transform shadow-xs"
                style={{ background: q.bg }}
              >
                <span className="text-base">{q.emoji}</span>
                <span className="text-xs font-semibold text-text whitespace-nowrap">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Islam Pillars Preview ── */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-text dark:text-white">أركان الإسلام</h3>
          <button onClick={() => nav('/pillars')} className="text-[11px] text-primary font-semibold">
            عرض الكل
          </button>
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2.5" style={{ width: 'max-content' }}>
            {islamPillars.map((pillar) => {
              const completed = pillar.lessons.filter((l) => completedModules.includes(l.id)).length
              return (
                <button
                  key={pillar.id}
                  onClick={() => nav('/pillars')}
                  className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl active:scale-[0.96] transition-transform"
                  style={{ background: pillar.bgColor, minWidth: '90px' }}
                >
                  <span className="text-2xl">{pillar.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: pillar.color }}>{pillar.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/50 font-semibold" style={{ color: pillar.color }}>
                    {completed}/{pillar.lessons.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Prayer Chip ── */
function PrayerChip({ label, status, onTap, time }: { label: string; status: PrayerStatus; onTap: () => void; time?: string }) {
  const config: Record<PrayerStatus, { bg: string; text: string }> = {
    done: { bg: 'bg-prayer-done', text: 'text-white' },
    pending: { bg: 'bg-[#F5F3EF] dark:bg-white/8', text: 'text-text-muted' },
    missed: { bg: 'bg-red-50', text: 'text-prayer-missed' },
  }
  const { bg, text } = config[status]

  return (
    <button
      onClick={onTap}
      aria-label={`${label} — ${status === 'done' ? 'تم' : status === 'missed' ? 'فائتة' : 'لم تصلّ'}`}
      className={`${bg} rounded-xl py-2.5 flex flex-col items-center gap-0.5 active:scale-[0.93] transition-transform`}
    >
      {status === 'done' && <CheckCircle2 className={`w-3.5 h-3.5 ${text}`} strokeWidth={2.5} />}
      <span className={`text-[11px] font-semibold ${text}`}>{label}</span>
      {time && status === 'pending' && (
        <span className="text-[9px] text-text-light" dir="ltr">{time.slice(0, 5)}</span>
      )}
    </button>
  )
}
