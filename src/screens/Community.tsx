import { motion } from 'framer-motion'
import { Users, Heart, Lock } from 'lucide-react'

function IslamicStarPattern() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className="absolute top-6 left-6 opacity-[0.06]"
    >
      {/* 8-pointed star pattern */}
      <g transform="translate(60,60)">
        {/* Outer octagram */}
        <polygon
          points="0,-55 15,-20 55,-15 22,10 30,50 0,28 -30,50 -22,10 -55,-15 -15,-20"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-primary"
        />
        {/* Inner octagram rotated */}
        <polygon
          points="0,-40 12,-14 40,-10 16,8 22,36 0,20 -22,36 -16,8 -40,-10 -12,-14"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary"
        />
        {/* Center circle */}
        <circle r="8" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary" />
        {/* Radiating lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * 55}
            y2={Math.sin((angle * Math.PI) / 180) * 55}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-primary"
          />
        ))}
      </g>
    </svg>
  )
}

export function Community() {
  return (
    <div className="pb-6 flex flex-col items-center justify-center min-h-[70dvh] px-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 relative w-full max-w-sm"
      >
        {/* Decorative Islamic star pattern */}
        <IslamicStarPattern />

        <div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto shadow-sm">
          <Users className="w-12 h-12 text-primary dark:text-primary-lightest" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-primary dark:text-primary-lightest">مجتمع الرفقة</h2>
          <p className="text-text-muted leading-relaxed text-sm px-2">
            تواصل مع مسلمين جدد مثلك، واحصل على مرشد متطوع يساعدك في رحلتك.
          </p>
        </div>

        <div className="space-y-3 w-full">
          {['مرشدي — تواصل مع مرشد', 'حلقة المسلمين الجدد', 'مسجد قريبي'].map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-2xl text-right shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-warm flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-text-light" />
              </div>
              <span className="text-sm text-text dark:text-white flex-1">{f}</span>
              <span className="px-2.5 py-1 bg-accent/10 rounded-full text-[10px] text-accent font-medium">
                قريباً
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 justify-center text-sm text-accent pt-2">
          <Heart className="w-4 h-4" />
          <span>ستتوفر في الإصدار القادم إن شاء الله</span>
        </div>
      </motion.div>
    </div>
  )
}
