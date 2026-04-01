import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  dark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark
        set({ dark: next })
        applyTheme(next)
      },
    }),
    {
      name: 'maheel_theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.dark)
      },
    }
  )
)

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
