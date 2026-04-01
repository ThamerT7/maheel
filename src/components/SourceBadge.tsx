import type { SourceType } from '../store/chatStore'

const config: Record<SourceType, { label: string; color: string; bg: string }> = {
  fard: { label: 'فرض', color: 'text-fard', bg: 'bg-fard-bg' },
  sunnah: { label: 'سنة', color: 'text-sunnah', bg: 'bg-sunnah-bg' },
  cultural: { label: 'عادة ثقافية', color: 'text-cultural', bg: 'bg-cultural-bg' },
  khilaf: { label: 'مسألة خلافية', color: 'text-khilaf', bg: 'bg-khilaf-bg' },
}

export function SourceBadge({ type }: { type: SourceType }) {
  const c = config[type]
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color} ${c.bg}`}>
      {c.label}
    </span>
  )
}
