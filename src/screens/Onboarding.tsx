import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, TreePine, Leaf, Trees, ChevronLeft, Check } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import type { ShahadaStage, DailyMinutes } from '../store/userStore'
import { GeometricBg } from '../components/GeometricBg'
import { APP_CONFIG } from '../config'

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 250 : -250, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -250 : 250, opacity: 0 }),
}

export function Onboarding() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const nav = useNavigate()
  const store = useUserStore()

  const next = () => { setDir(1); setStep((s) => s + 1) }
  const back = () => { setDir(-1); setStep((s) => s - 1) }

  const finish = () => {
    store.setOnboardingComplete(true)
    store.setShahadaDate(new Date().toISOString())
    nav('/', { replace: true })
  }

  return (
    <div className="relative min-h-dvh flex flex-col bg-surface overflow-hidden" dir="rtl">
      <GeometricBg />

      {/* Progress bar */}
      <div className="relative z-10 px-8 pt-10 pb-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-primary/10">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={false}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      {step > 1 && (
        <button onClick={back} className="relative z-10 self-end mx-6 p-2 text-text-muted hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5 rotate-180" />
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-sm"
          >
            {step === 1 && <Step1 onNext={next} />}
            {step === 2 && <Step2 onNext={next} />}
            {step === 3 && <Step3 onNext={next} />}
            {step === 4 && <Step4 onNext={next} />}
            {step === 5 && <Step5 onFinish={finish} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-10">
      {/* Decorative Islamic star with rotation */}
      <motion.div
        className="mx-auto w-32 h-32 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
            fill="none"
            stroke="#1B4332"
            strokeWidth="1"
            opacity="0.7"
          />
          <polygon
            points="50,15 58,37 82,37 63,52 71,77 50,63 29,77 37,52 18,37 42,37"
            fill="none"
            stroke="#D4A853"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle cx="50" cy="50" r="12" fill="none" stroke="#1B4332" strokeWidth="0.6" opacity="0.4" />
          <circle cx="50" cy="50" r="4" fill="#D4A853" opacity="0.3" />
        </svg>
      </motion.div>
      <div>
        <h1 className="text-3xl font-bold text-primary mb-3 leading-tight">مرحباً بك في رحلتك</h1>
        <p className="text-text-muted text-base leading-relaxed">
          هذا التطبيق رُفِق لك — لا ليحكم عليك
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 bg-primary text-white rounded-2xl text-lg font-bold btn-primary-glow hover:bg-primary-light transition-all active:scale-[0.98]"
      >
        ابدأ رحلتك
      </button>
    </div>
  )
}

const stageOptions: { label: string; value: ShahadaStage; icon: React.ReactNode }[] = [
  { label: 'منذ أيام قليلة', value: 'days', icon: <Sprout className="w-6 h-6" /> },
  { label: 'منذ أسابيع', value: 'weeks', icon: <Leaf className="w-6 h-6" /> },
  { label: 'منذ أشهر (أقل من سنة)', value: 'months', icon: <TreePine className="w-6 h-6" /> },
  { label: 'منذ أكثر من سنة', value: 'year_plus', icon: <Trees className="w-6 h-6" /> },
]

function Step2({ onNext }: { onNext: () => void }) {
  const { shahadaStage, setShahadaStage } = useUserStore()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">متى أسلمتَ؟</h2>
        <p className="text-text-muted text-sm">هذا يساعدنا نرتّب الرحلة حسب مرحلتك</p>
      </div>
      <div className="space-y-3">
        {stageOptions.map((opt) => {
          const selected = shahadaStage === opt.value
          return (
            <motion.button
              key={opt.value}
              onClick={() => setShahadaStage(opt.value)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-transparent bg-white text-text hover:border-text-light/20 shadow-xs'
              }`}
              style={selected ? { boxShadow: '0 0 0 1px rgba(27,67,50,0.1), var(--shadow-sm)' } : {}}
            >
              <span className={`transition-colors ${selected ? 'text-accent' : 'text-text-light'}`}>
                {opt.icon}
              </span>
              <span className="font-medium flex-1 text-right">{opt.label}</span>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
      <button
        onClick={onNext}
        disabled={!shahadaStage}
        className="w-full py-4 bg-primary text-white rounded-2xl text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed btn-primary-glow hover:bg-primary-light transition-all active:scale-[0.98]"
      >
        التالي
      </button>
    </div>
  )
}

const concernOptions = APP_CONFIG.concernOptions

function Step3({ onNext }: { onNext: () => void }) {
  const { concerns, setConcerns } = useUserStore()

  const toggle = (c: string) => {
    setConcerns(concerns.includes(c) ? concerns.filter((x) => x !== c) : [...concerns, c])
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">ما أكثر شيء يشغل بالك الآن؟</h2>
        <p className="text-text-muted text-sm">اختر ما يناسبك — يمكنك تغييره لاحقاً</p>
      </div>
      <div className="flex flex-wrap gap-2.5 justify-center">
        {concernOptions.map((c) => {
          const selected = concerns.includes(c)
          return (
            <motion.button
              key={c}
              onClick={() => toggle(c)}
              whileTap={{ scale: 0.95 }}
              animate={selected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.2 }}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                selected
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-text-muted shadow-xs hover:shadow-sm'
              }`}
            >
              {c}
            </motion.button>
          )
        })}
      </div>
      <button
        onClick={onNext}
        disabled={concerns.length === 0}
        className="w-full py-4 bg-primary text-white rounded-2xl text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed btn-primary-glow hover:bg-primary-light transition-all active:scale-[0.98]"
      >
        التالي
      </button>
    </div>
  )
}

const languages = APP_CONFIG.languages

function Step4({ onNext }: { onNext: () => void }) {
  const { language, setLanguage } = useUserStore()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">اختر لغة التطبيق</h2>
      </div>
      <div className="space-y-3">
        {languages.map((l) => {
          const selected = language === l.code
          return (
            <motion.button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-transparent bg-white hover:border-text-light/20 shadow-xs'
              }`}
            >
              <span className="text-2xl">{l.flag}</span>
              <span className="font-medium flex-1 text-right">{l.label}</span>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 bg-primary text-white rounded-2xl text-lg font-bold btn-primary-glow hover:bg-primary-light transition-all active:scale-[0.98]"
      >
        التالي
      </button>
    </div>
  )
}

const minuteOptions: DailyMinutes[] = [5, 10, 15, 20]
const minuteLabels: Record<DailyMinutes, string> = { 5: '٥', 10: '١٠', 15: '١٥', 20: '٢٠' }

function Step5({ onFinish }: { onFinish: () => void }) {
  const { dailyMinutes, setDailyMinutes } = useUserStore()

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">جرعتك اليومية</h2>
        <p className="text-text-muted text-sm">كم دقيقة تستطيع يومياً؟</p>
      </div>
      <div className="flex justify-center gap-4">
        {minuteOptions.map((m) => {
          const selected = dailyMinutes === m
          return (
            <motion.button
              key={m}
              onClick={() => setDailyMinutes(m)}
              whileTap={{ scale: 0.95 }}
              animate={selected ? { y: -4 } : { y: 0 }}
              className={`w-[72px] h-[72px] rounded-2xl flex flex-col items-center justify-center transition-all ${
                selected
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-text-muted shadow-xs hover:shadow-sm'
              }`}
            >
              <span className="text-xl font-bold">{minuteLabels[m]}</span>
              <span className="text-[10px] opacity-70">دقيقة</span>
            </motion.button>
          )
        })}
      </div>
      <button
        onClick={onFinish}
        className="w-full py-4 bg-accent text-white rounded-2xl text-lg font-bold btn-accent-glow hover:bg-accent-light transition-all active:scale-[0.98]"
      >
        ابدأ رحلتك الآن
      </button>
    </div>
  )
}
