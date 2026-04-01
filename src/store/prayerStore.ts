import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
export type PrayerStatus = 'pending' | 'done' | 'missed'

interface PrayerDay {
  date: string
  prayers: Record<PrayerName, PrayerStatus>
}

interface PrayerStore {
  days: Record<string, PrayerDay>
  togglePrayer: (date: string, prayer: PrayerName) => void
}

const defaultPrayers = (): Record<PrayerName, PrayerStatus> => ({
  fajr: 'pending',
  dhuhr: 'pending',
  asr: 'pending',
  maghrib: 'pending',
  isha: 'pending',
})

export const usePrayerStore = create<PrayerStore>()(
  persist(
    (set, get) => ({
      days: {},
      togglePrayer: (date, prayer) => {
        const current = get().days[date]?.prayers[prayer] ?? 'pending'
        const next: PrayerStatus = current === 'pending' ? 'done' : current === 'done' ? 'missed' : 'pending'
        set((state) => ({
          days: {
            ...state.days,
            [date]: {
              date,
              prayers: {
                ...(state.days[date]?.prayers ?? defaultPrayers()),
                [prayer]: next,
              },
            },
          },
        }))
      },
    }),
    { name: 'maheel_prayers' }
  )
)

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
}
