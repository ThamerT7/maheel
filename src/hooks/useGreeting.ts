export function useGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'صباح النور'
  if (hour >= 12 && hour < 17) return 'السلام عليكم'
  return 'مساء الخير'
}

export function useHijriDate(): string {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  } catch {
    return ''
  }
}

export function useDaysSinceSahada(shahadaDate: string | null): number | null {
  if (!shahadaDate) return null
  const diff = Date.now() - new Date(shahadaDate).getTime()
  return Math.max(1, Math.floor(diff / 86400000))
}
