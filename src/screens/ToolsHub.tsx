import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Compass as CompassIcon, BookOpen, Shield, Heart,
  Users, MapPin, Lock
} from 'lucide-react'

interface ToolItem {
  label: string
  icon: React.ReactNode
  path: string
  available: boolean
  description: string
}

const tools: ToolItem[] = [
  {
    label: 'بوصلة المصدر',
    icon: <CompassIcon className="w-6 h-6" />,
    path: '/source-compass',
    available: true,
    description: 'فرض أم سنة أم عادة؟',
  },
  {
    label: 'أدلة سريعة',
    icon: <BookOpen className="w-6 h-6" />,
    path: '/guides',
    available: true,
    description: 'الوضوء والصلاة خطوة بخطوة',
  },
  {
    label: 'الشبهات والردود',
    icon: <Shield className="w-6 h-6" />,
    path: '/tools',
    available: false,
    description: 'إجابات على الأسئلة الصعبة',
  },
  {
    label: 'جسر العائلة',
    icon: <Heart className="w-6 h-6" />,
    path: '/tools',
    available: false,
    description: 'ساعد عائلتك على فهمك',
  },
  {
    label: 'مجتمع الرفقة',
    icon: <Users className="w-6 h-6" />,
    path: '/tools',
    available: false,
    description: 'تواصل مع مسلمين جدد',
  },
  {
    label: 'مسجد قريبي',
    icon: <MapPin className="w-6 h-6" />,
    path: '/tools',
    available: false,
    description: 'ابحث عن مسجد قريب',
  },
]

export function ToolsHub() {
  const nav = useNavigate()

  return (
    <div className="pb-6" dir="rtl">
      <div className="px-5 pt-6 mb-6">
        <h1 className="text-xl font-bold text-primary dark:text-primary-lightest">الأدوات</h1>
        <p className="text-sm text-text-muted mt-1">كل ما تحتاجه في مكان واحد</p>
      </div>

      <div className="px-5 grid grid-cols-2 gap-4">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => tool.available && nav(tool.path)}
            aria-label={tool.label}
            aria-disabled={!tool.available}
            className={`relative p-5 rounded-2xl text-right transition-all min-h-[120px] focus-visible:outline-2 focus-visible:outline-primary ${
              tool.available
                ? 'bg-white dark:bg-white/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]'
                : 'bg-white/60 dark:bg-white/3 shadow-xs cursor-not-allowed'
            }`}
          >
            {!tool.available && (
              <div className="absolute top-3 left-3">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-surface-warm rounded-full text-[10px] text-text-light">
                  <Lock className="w-3 h-3" />
                  قريباً
                </span>
              </div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              tool.available ? 'bg-accent/10 text-primary' : 'bg-text-light/10 text-text-light'
            }`}>
              {tool.icon}
            </div>
            <h3 className={`font-semibold text-sm mb-1 ${
              tool.available ? 'text-text dark:text-white' : 'text-text-light'
            }`}>
              {tool.label}
            </h3>
            <p className={`text-xs leading-relaxed ${
              tool.available ? 'text-text-muted' : 'text-text-light/70'
            }`}>
              {tool.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
