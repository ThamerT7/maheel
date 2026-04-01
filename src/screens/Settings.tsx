import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Moon, Sun, Globe, Clock, Sprout,
  Trash2, RotateCcw, Heart
} from 'lucide-react'
import { useUserStore } from '../store/userStore'
import type { Language, DailyMinutes } from '../store/userStore'
import { useThemeStore } from '../store/themeStore'

const languageLabels: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  tr: 'Türkçe',
  id: 'Bahasa Indonesia',
}

const stageLabels: Record<string, string> = {
  days: 'منذ أيام قليلة',
  weeks: 'منذ أسابيع',
  months: 'منذ أشهر',
  year_plus: 'منذ أكثر من سنة',
}

const minuteLabels: Record<DailyMinutes, string> = { 5: '٥', 10: '١٠', 15: '١٥', 20: '٢٠' }

export function Settings() {
  const nav = useNavigate()
  const user = useUserStore()
  const { dark, toggle } = useThemeStore()
  const [showReset, setShowReset] = useState(false)

  const handleReset = () => {
    user.reset()
    localStorage.removeItem('maheel_prayers')
    localStorage.removeItem('maheel_progress')
    localStorage.removeItem('maheel_chat')
    nav('/')
    window.location.reload()
  }

  return (
    <div className="pb-8" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="p-2 hover:bg-surface-warm rounded-xl transition-colors dark:hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-text-muted rotate-180" />
        </button>
        <h1 className="text-xl font-bold text-primary dark:text-primary-lightest">الإعدادات</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Profile section */}
        <section>
          <h2 className="text-xs font-bold text-text-light mb-3 tracking-wide">ملفك الشخصي</h2>
          <div className="bg-white dark:bg-white/5 rounded-2xl divide-y divide-surface dark:divide-white/10">
            <SettingRow
              icon={<Sprout className="w-5 h-5" />}
              label="مرحلتك"
              value={stageLabels[user.shahadaStage ?? ''] ?? '—'}
            />
            <SettingRow
              icon={<Globe className="w-5 h-5" />}
              label="اللغة"
              value={languageLabels[user.language]}
            />
            <SettingRow
              icon={<Clock className="w-5 h-5" />}
              label="الجرعة اليومية"
            >
              <div className="flex gap-1.5">
                {([5, 10, 15, 20] as DailyMinutes[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => user.setDailyMinutes(m)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      user.dailyMinutes === m
                        ? 'bg-primary text-white'
                        : 'bg-surface dark:bg-white/10 text-text-muted hover:bg-surface-warm'
                    }`}
                  >
                    {minuteLabels[m]}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="text-xs font-bold text-text-light mb-3 tracking-wide">المظهر</h2>
          <div className="bg-white dark:bg-white/5 rounded-2xl">
            <button
              onClick={toggle}
              className="w-full flex items-center gap-4 p-4 text-right"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-lightest">
                {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text dark:text-white">الوضع الليلي</p>
                <p className="text-xs text-text-muted">{dark ? 'مفعّل' : 'غير مفعّل'}</p>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors relative ${dark ? 'bg-primary' : 'bg-text-light/30'}`}>
                <motion.div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm"
                  animate={{ right: dark ? 0.5 : 'auto', left: dark ? 'auto' : 0.5 }}
                  // Use x position for RTL toggle
                  style={dark ? { right: 2 } : { left: 2 }}
                />
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xs font-bold text-text-light mb-3 tracking-wide">حول التطبيق</h2>
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-accent" />
              <span className="font-bold text-primary dark:text-primary-lightest">مَهِيل</span>
              <span className="text-xs text-text-muted">الإصدار ١.٠</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              رفيقك في رحلة الإسلام. صُمّم بحب لكل مسلم جديد يبحث عن بداية دافئة وآمنة.
            </p>
          </div>
        </section>

        {/* Reset */}
        <section>
          <button
            onClick={() => setShowReset(true)}
            className="w-full flex items-center gap-3 p-4 bg-prayer-missed/5 dark:bg-prayer-missed/10 rounded-2xl text-prayer-missed"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-sm font-medium">إعادة تعيين التطبيق</span>
          </button>
        </section>
      </div>

      {/* Reset confirmation */}
      {showReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-8"
          onClick={() => setShowReset(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-prayer-missed/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-prayer-missed" />
              </div>
              <h3 className="font-bold text-text dark:text-white">إعادة تعيين؟</h3>
            </div>
            <p className="text-sm text-text-muted">
              سيتم مسح جميع بياناتك بما فيها تقدمك في الرحلة وسجل الصلوات والمحادثات. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-3 bg-surface dark:bg-white/10 rounded-xl text-sm font-medium text-text dark:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-prayer-missed text-white rounded-xl text-sm font-medium"
              >
                مسح البيانات
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

function SettingRow({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-lightest">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text dark:text-white">{label}</p>
        {value && <p className="text-xs text-text-muted">{value}</p>}
      </div>
      {children}
    </div>
  )
}
