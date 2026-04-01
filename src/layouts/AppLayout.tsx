import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Map, MessageCircle, Users, Grid3X3 } from 'lucide-react'

const tabs = [
  { label: 'اليوم', icon: Sun, path: '/' },
  { label: 'رحلتي', icon: Map, path: '/journey' },
  { label: 'اسأل', icon: MessageCircle, path: '/ask' },
  { label: 'الرفقة', icon: Users, path: '/community' },
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
    <div className="min-h-dvh bg-surface" dir="rtl">
      <main className="pb-24 w-full max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 glass border-t border-white/40 dark:border-white/10"
        role="navigation"
        aria-label="التنقل الرئيسي"
      >
        <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-3 pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const active = isActive(tab.path)
            return (
              <button
                key={tab.path}
                onClick={() => nav(tab.path)}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center gap-1.5 min-w-[56px] min-h-[48px] px-3 py-2 rounded-2xl"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/8 dark:bg-primary/15 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`relative z-10 w-6 h-6 ${
                    active ? 'text-primary dark:text-primary-lightest' : 'text-text-light'
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
                <span
                  className={`relative z-10 text-xs leading-none ${
                    active ? 'text-primary dark:text-primary-lightest font-bold' : 'text-text-light font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
