import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShahadaStage = 'days' | 'weeks' | 'months' | 'year_plus'
export type Language = 'ar' | 'en' | 'fr' | 'tr' | 'id'
export type DailyMinutes = 5 | 10 | 15 | 20

interface UserProfile {
  onboardingComplete: boolean
  shahadaStage: ShahadaStage | null
  shahadaDate: string | null
  concerns: string[]
  language: Language
  dailyMinutes: DailyMinutes
  name: string
}

interface UserStore extends UserProfile {
  setOnboardingComplete: (v: boolean) => void
  setShahadaStage: (s: ShahadaStage) => void
  setShahadaDate: (d: string) => void
  setConcerns: (c: string[]) => void
  setLanguage: (l: Language) => void
  setDailyMinutes: (m: DailyMinutes) => void
  setName: (n: string) => void
  reset: () => void
}

const defaults: UserProfile = {
  onboardingComplete: false,
  shahadaStage: null,
  shahadaDate: null,
  concerns: [],
  language: 'ar',
  dailyMinutes: 10,
  name: '',
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...defaults,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
      setShahadaStage: (s) => set({ shahadaStage: s }),
      setShahadaDate: (d) => set({ shahadaDate: d }),
      setConcerns: (c) => set({ concerns: c }),
      setLanguage: (l) => set({ language: l }),
      setDailyMinutes: (m) => set({ dailyMinutes: m }),
      setName: (n) => set({ name: n }),
      reset: () => set(defaults),
    }),
    {
      name: 'maheel_user',
      version: 1,
      migrate: (persisted, version) => {
        if (version === 0) return { ...defaults, ...(persisted as object) }
        return persisted as UserStore
      },
    }
  )
)
