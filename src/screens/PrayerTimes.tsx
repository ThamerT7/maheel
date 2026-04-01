import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, MapPin, Loader2, Navigation } from 'lucide-react'
import { usePrayerTimes, getNextPrayer, calculateQibla } from '../hooks/usePrayerTimes'

const prayerList = [
  { key: 'Fajr' as const, ar: 'الفجر', emoji: '🌅' },
  { key: 'Sunrise' as const, ar: 'الشروق', emoji: '☀️' },
  { key: 'Dhuhr' as const, ar: 'الظهر', emoji: '🌤️' },
  { key: 'Asr' as const, ar: 'العصر', emoji: '🌇' },
  { key: 'Maghrib' as const, ar: 'المغرب', emoji: '🌆' },
  { key: 'Isha' as const, ar: 'العشاء', emoji: '🌙' },
]

export function PrayerTimes() {
  const nav = useNavigate()
  const { times, loading, error } = usePrayerTimes()
  const nextPrayer = times ? getNextPrayer(times) : null
  const [qibla, setQibla] = useState<number | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setQibla(calculateQibla(pos.coords.latitude, pos.coords.longitude)),
        () => {}
      )
    }
  }, [])

  return (
    <div className="pb-6" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="p-3 hover:bg-surface-warm dark:hover:bg-white/10 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="رجوع"
        >
          <ChevronLeft className="w-5 h-5 text-text-muted rotate-180" aria-hidden="true" />
        </button>
        <h1 className="text-xl font-bold text-primary dark:text-primary-lightest">أوقات الصلاة</h1>
      </div>

      <div className="px-5 space-y-4">
        {loading && (
          <div className="flex flex-col items-center py-16 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-text-muted">جاري تحديد موقعك...</p>
          </div>
        )}

        {error && (
          <div className="bg-accent/10 rounded-2xl p-5 text-center">
            <MapPin className="w-8 h-8 text-accent mx-auto mb-3" />
            <p className="text-sm text-text-muted leading-relaxed">{error}</p>
            <p className="text-xs text-text-light mt-2">
              يرجى السماح بالوصول للموقع من إعدادات المتصفح
            </p>
          </div>
        )}

        {times && (
          <>
            {/* Prayer times list */}
            <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden" role="list" aria-label="أوقات الصلاة">
              {prayerList.map((prayer, i) => {
                const isNext = nextPrayer?.name === prayer.key
                const time = times[prayer.key]
                return (
                  <motion.div
                    key={prayer.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    role="listitem"
                    className={`flex items-center gap-4 px-5 py-4 ${
                      i < prayerList.length - 1 ? 'border-b border-surface dark:border-white/10' : ''
                    } ${isNext ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                  >
                    <span className="text-xl" aria-hidden="true">{prayer.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-base font-semibold ${isNext ? 'text-primary dark:text-primary-lightest' : 'text-text dark:text-white'}`}>
                        {prayer.ar}
                      </p>
                      {isNext && (
                        <span className="text-xs text-primary dark:text-primary-lightest font-medium">القادمة</span>
                      )}
                    </div>
                    <span className={`text-base font-mono font-bold ${isNext ? 'text-primary dark:text-primary-lightest' : 'text-text-muted'}`} dir="ltr">
                      {time?.slice(0, 5)}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Qibla direction */}
            {qibla !== null && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 rounded-2xl p-5 text-center"
              >
                <h2 className="text-base font-bold text-primary dark:text-primary-lightest mb-4">اتجاه القبلة</h2>
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3">
                  <Navigation
                    className="w-10 h-10 text-primary dark:text-primary-lightest"
                    style={{ transform: `rotate(${qibla}deg)` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm text-text-muted">{Math.round(qibla)}° من الشمال</p>
                <p className="text-xs text-text-light mt-1">وجّه الجهاز نحو الشمال للنتيجة الدقيقة</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
