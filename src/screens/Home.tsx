import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Droplets, Compass, BookOpen, Navigation, Clock,
  Play, CheckCircle2, Circle, Settings, Flame
} from 'lucide-react'
import { useGreeting, useHijriDate, useDaysSinceSahada } from '../hooks/useGreeting'
import { useUserStore } from '../store/userStore'
import { usePrayerStore, PRAYER_LABELS } from '../store/prayerStore'
import type { PrayerName, PrayerStatus } from '../store/prayerStore'
import { useProgressStore } from '../store/progressStore'
import { journeyStages } from '../data/journeyData'
import { getTodayAyah } from '../data/ayahData'
import { usePrayerTimes, getNextPrayer } from '../hooks/usePrayerTimes'
import { useNavigate } from 'react-router-dom'

const today = new Date().toISOString().split('T')[0]

const quickLinks = [
  { label: 'الوضوء', icon: Droplets, path: '/guides/wudu' },
  { label: 'الصلاة', icon: Compass, path: '/guides/prayer' },
  { label: 'الأذكار', icon: BookOpen, path: '/guides' },
  { label: 'القبلة', icon: Navigation, path: '/tools' },
  { label: 'أوقات الصلاة', icon: Clock, path: '/prayer-times' },
]

const prayerNames: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

function usePrayerStreak() {
  const days = usePrayerStore((s) => s.days)
  return useMemo(() => {
    let streak = 0
    const d = new Date()
    const todayStr = d.toISOString().split('T')[0]
    const todayDay = days[todayStr]
    if (todayDay && prayerNames.every((p) => todayDay.prayers[p] === 'done')) {
      streak++
    }
    d.setDate(d.getDate() - 1)
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0]
      const day = days[dateStr]
      if (!day) break
      if (!prayerNames.every((p) => day.prayers[p] === 'done')) break
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }, [days])
}

function useDailyTask() {
  const currentModule = useProgressStore((s) => s.currentModule)
  return useMemo(() => {
    const allModules = journeyStages.flatMap((s) => s.modules)
    return allModules.find((m) => m.id === currentModule) ?? allModules[0]
  }, [currentModule])
}

export function Home() {
  const greeting = useGreeting()
  const hijri = useHijriDate()
  const shahadaDate = useUserStore((s) => s.shahadaDate)
  const days = useDaysSinceSahada(shahadaDate)
  const prayerDays = usePrayerStore((s) => s.days)
  const togglePrayer = usePrayerStore((s) => s.togglePrayer)
  const prayerDay = prayerDays[today] ?? { date: today, prayers: { fajr: 'pending' as const, dhuhr: 'pending' as const, asr: 'pending' as const, maghrib: 'pending' as const, isha: 'pending' as const } }
  const ayah = useMemo(() => getTodayAyah(), [])
  const nav = useNavigate()
  const streak = usePrayerStreak()
  const dailyTask = useDailyTask()
  const { times: prayerTimes } = usePrayerTimes()
  const nextPrayer = useMemo(() => prayerTimes ? getNextPrayer(prayerTimes) : null, [prayerTimes])
  const todayDone = prayerNames.filter((p) => prayerDay.prayers[p] === 'done').length

  return (
    <div className="pb-4">
      {/* ── Greeting Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-8 pb-2 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-lightest">{greeting}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {hijri && <span className="text-sm text-text-muted">{hijri}</span>}
            {days != null && (
              <>
                <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                <span className="text-sm text-accent font-medium">اليوم {days} في رحلتك</span>
              </>
            )}
          </div>
          {nextPrayer && (
            <p className="text-sm text-text-muted mt-1">
              الصلاة القادمة: <span className="font-semibold text-primary dark:text-primary-lightest">{nextPrayer.nameAr}</span> — {nextPrayer.time}
            </p>
          )}
        </div>
        <button
          onClick={() => nav('/settings')}
          className="shrink-0 w-11 h-11 rounded-xl hover:bg-surface-warm dark:hover:bg-white/10 flex items-center justify-center"
          aria-label="الإعدادات"
        >
          <Settings className="w-5 h-5 text-text-muted" />
        </button>
      </motion.div>

      {/* ── Daily Task Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 mt-4"
      >
        <div className="bg-primary rounded-3xl p-5 text-white relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.10]" viewBox="0 0 300 200" aria-hidden="true">
            <circle cx="240" cy="30" r="80" fill="none" stroke="#D4A853" strokeWidth="0.8" />
            <circle cx="240" cy="30" r="50" fill="none" stroke="#D4A853" strokeWidth="0.5" />
            <circle cx="40" cy="170" r="40" fill="none" stroke="#fff" strokeWidth="0.4" />
          </svg>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-medium mb-3">
              مهمة اليوم
            </span>
            <h2 className="text-lg font-bold mb-1">{dailyTask.title}</h2>
            <p className="text-white/60 text-sm mb-4">{dailyTask.duration} · أساسي</p>
            <button
              onClick={() => nav(`/lesson/${dailyTask.id}`)}
              className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-2xl font-semibold text-sm hover:bg-accent-light active:scale-[0.97]"
            >
              <Play className="w-4 h-4" />
              ابدأ الآن
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Prayer Tracker ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 mt-5"
      >
        <div className="card-elevated p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-primary dark:text-primary-lightest">صلواتك اليوم</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">{todayDone}/٥</span>
              {streak > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold text-accent">{streak}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {prayerNames.map((p) => {
              const status = prayerDay.prayers[p]
              const pKey = (p.charAt(0).toUpperCase() + p.slice(1)) as keyof NonNullable<typeof prayerTimes>
              return (
                <PrayerPill
                  key={p}
                  label={PRAYER_LABELS[p]}
                  status={status}
                  onTap={() => togglePrayer(today, p)}
                  time={prayerTimes?.[pKey]}
                />
              )
            })}
          </div>

          {streak > 0 && (
            <p className="text-xs text-accent text-center mt-3 font-medium">
              ماشاء الله — {streak} {streak === 1 ? 'يوم' : streak <= 10 ? 'أيام' : 'يوماً'} متواصلة
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Quick Reference ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-5"
      >
        <h2 className="text-sm font-bold text-primary dark:text-primary-lightest mb-3 px-5">مرجع سريع</h2>
        <div className="px-5 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2.5 w-max">
            {quickLinks.map((q) => (
              <button
                key={q.label}
                onClick={() => nav(q.path)}
                className="w-[72px] flex flex-col items-center gap-2 py-3 px-2 card dark:bg-white/5 hover:shadow-md active:scale-[0.96]"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/8 dark:bg-primary/20 flex items-center justify-center">
                  <q.icon className="w-[18px] h-[18px] text-primary dark:text-primary-lightest" />
                </div>
                <span className="text-[11px] font-semibold text-text dark:text-white/80 leading-tight text-center">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Ayah of the Day ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-5 mt-5"
      >
        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-surface-card) 0%, var(--color-surface-warm) 100%)',
            border: '1px solid rgba(212,168,83,0.15)',
          }}
        >
          <svg className="absolute top-2 right-2 w-7 h-7 text-accent/20" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M0 16L16 0L32 16L16 32Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M8 16L16 8L24 16L16 24Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          <h2 className="text-xs font-bold text-accent mb-4">آية اليوم</h2>
          <p className="font-quran text-[1.4rem] leading-[2] text-primary dark:text-primary-lightest text-center mb-3">
            {ayah.arabic}
          </p>
          <p className="text-sm text-text-muted text-center mb-3 leading-relaxed">{ayah.translation}</p>
          <div className="flex justify-center">
            <span className="text-[11px] text-text-light bg-surface dark:bg-white/5 px-3 py-1 rounded-full font-medium">
              سورة {ayah.surah} — الآية {ayah.ayahNumber}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Prayer Pill ── */
function PrayerPill({ label, status, onTap, time }: { label: string; status: PrayerStatus; onTap: () => void; time?: string }) {
  const bg: Record<PrayerStatus, string> = {
    done: 'bg-prayer-done text-white',
    pending: 'bg-surface-warm dark:bg-white/10 text-text-muted dark:text-white/60',
    missed: 'bg-prayer-missed/10 text-prayer-missed',
  }

  return (
    <button
      onClick={onTap}
      aria-label={`${label} — ${status === 'done' ? 'تم' : status === 'missed' ? 'فائتة' : 'لم تصلّ'}`}
      className={`rounded-xl py-2 flex flex-col items-center gap-0.5 active:scale-[0.93] transition-transform ${bg[status]}`}
    >
      {status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />}
      {status === 'missed' && <Circle className="w-3.5 h-3.5" />}
      <span className="text-[11px] font-semibold leading-none">{label}</span>
      {time && status === 'pending' && (
        <span className="text-[9px] opacity-50 leading-none" dir="ltr">{time.slice(0, 5)}</span>
      )}
    </button>
  )
}
