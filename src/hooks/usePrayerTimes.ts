import { useState, useEffect } from 'react'
import { APP_CONFIG } from '../config'

export interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface PrayerTimesState {
  times: PrayerTimes | null
  loading: boolean
  error: string | null
  locationGranted: boolean
}

const CACHE_KEY = 'maheel_prayer_times'
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours

function getCachedTimes(): { times: PrayerTimes; date: string } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const now = Date.now()
    if (now - parsed.timestamp > CACHE_DURATION) return null
    if (parsed.date !== new Date().toISOString().split('T')[0]) return null
    return parsed
  } catch {
    return null
  }
}

function cacheTimes(times: PrayerTimes) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        times,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
      })
    )
  } catch { /* quota exceeded — ignore */ }
}

export function usePrayerTimes(): PrayerTimesState {
  const [state, setState] = useState<PrayerTimesState>({
    times: getCachedTimes()?.times ?? null,
    loading: false,
    error: null,
    locationGranted: false,
  })

  useEffect(() => {
    // If we have cached times for today, use them
    const cached = getCachedTimes()
    if (cached) {
      setState((s) => ({ ...s, times: cached.times, locationGranted: true }))
      return
    }

    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'الموقع غير متاح في هذا المتصفح' }))
      return
    }

    setState((s) => ({ ...s, loading: true }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setState((s) => ({ ...s, locationGranted: true }))
        try {
          const { latitude, longitude } = position.coords
          const today = new Date()
          const dd = String(today.getDate()).padStart(2, '0')
          const mm = String(today.getMonth() + 1).padStart(2, '0')
          const yyyy = today.getFullYear()

          const res = await fetch(
            `${APP_CONFIG.prayerTimesApi}/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=4`
          )
          if (!res.ok) throw new Error('فشل في جلب أوقات الصلاة')

          const data = await res.json()
          const timings = data.data.timings as PrayerTimes
          cacheTimes(timings)
          setState({ times: timings, loading: false, error: null, locationGranted: true })
        } catch (err) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'خطأ في جلب أوقات الصلاة',
          }))
        }
      },
      (err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: err.code === 1 ? 'يرجى السماح بالوصول للموقع لعرض أوقات الصلاة' : 'تعذّر تحديد الموقع',
        }))
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [])

  return state
}

/** Get the next prayer based on current time */
export function getNextPrayer(times: PrayerTimes): { name: string; nameAr: string; time: string } | null {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const prayerList: { key: keyof PrayerTimes; nameAr: string }[] = [
    { key: 'Fajr', nameAr: 'الفجر' },
    { key: 'Dhuhr', nameAr: 'الظهر' },
    { key: 'Asr', nameAr: 'العصر' },
    { key: 'Maghrib', nameAr: 'المغرب' },
    { key: 'Isha', nameAr: 'العشاء' },
  ]

  for (const prayer of prayerList) {
    const [h, m] = times[prayer.key].split(':').map(Number)
    const prayerMinutes = h * 60 + m
    if (prayerMinutes > currentMinutes) {
      return { name: prayer.key, nameAr: prayer.nameAr, time: times[prayer.key] }
    }
  }

  // All prayers passed — next is Fajr tomorrow
  return { name: 'Fajr', nameAr: 'الفجر', time: times.Fajr }
}

/** Calculate Qibla direction from coordinates */
export function calculateQibla(lat: number, lng: number): number {
  const kaabaLat = 21.4225 * (Math.PI / 180)
  const kaabaLng = 39.8262 * (Math.PI / 180)
  const userLat = lat * (Math.PI / 180)
  const userLng = lng * (Math.PI / 180)

  const y = Math.sin(kaabaLng - userLng)
  const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(kaabaLng - userLng)

  let qibla = Math.atan2(y, x) * (180 / Math.PI)
  qibla = (qibla + 360) % 360

  return qibla
}
