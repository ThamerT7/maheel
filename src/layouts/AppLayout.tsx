import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, BookOpen, MessageCircle, Hexagon, Grid3X3 } from 'lucide-react'

const tabs = [
  { label: 'اليوم', icon: Sun, path: '/' },
  { label: 'الأركان', icon: Hexagon, path: '/pillars' },
  { label: 'اسأل', icon: MessageCircle, path: '/ask' },
  { label: 'تعلّم', icon: BookOpen, path: '/learn' },
  { label: 'أدوات', icon: Grid3X3, path: '/tools' },
]

export function AppLayout() {
  const location = useLocation()
  const nav = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-dvh bg-surface overflow-x-hidden" dir="rtl">
      <main className="pb-24 w-full max-w-lg mx-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 bg-white/85 dark:bg-[#0F1A14]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10"
        role="navigation"
        aria-label="التنقل الرئيسي"
      >
        <div className="flex items-center justify-around h-[72px] max-w-lg mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const active = isActive(tab.path)
            return (
              <button
                key={tab.path}
                onClick={() => nav(tab.path)}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] px-3 py-2"
              >
                <tab.icon
                  className={`w-[22px] h-[22px] transition-colors ${
                    active ? 'text-primary dark:text-primary-lightest' : 'text-text-light'
                  }`}
                  strokeWidth={active ? 2.3 : 1.7}
                  aria-hidden="true"
                />
                <span
                  className={`text-[11px] leading-none transition-colors ${
                    active ? 'text-primary dark:text-primary-lightest font-bold' : 'text-text-light font-medium'
                  }`}
                >
                  {tab.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-lightest"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
