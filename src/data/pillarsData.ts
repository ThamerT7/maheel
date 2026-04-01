export interface PillarLesson {
  id: string
  title: string
  duration: string
  level: number // 1=تعريف  2=تعلم  3=تعمق
}

export interface IslamPillar {
  id: string
  name: string
  emoji: string
  color: string
  bgColor: string
  description: string
  lessons: PillarLesson[]
}

export interface ImanPillar {
  id: string
  name: string
  emoji: string
  color: string
  bgColor: string
  description: string
  lessonId: string
}

export const islamPillars: IslamPillar[] = [
  {
    id: 'shahada',
    name: 'الشهادة',
    emoji: '☝️',
    color: '#1B4332',
    bgColor: '#D1FAE5',
    description: 'أساس الإسلام — لا إله إلا الله محمد رسول الله',
    lessons: [
      { id: 'shahada-1', title: 'معنى الشهادتين', duration: '١٠ دقائق', level: 1 },
      { id: 'shahada-2', title: 'شروط الشهادة السبعة', duration: '١٢ دقيقة', level: 2 },
      { id: 'shahada-3', title: 'نواقض الإسلام ومقتضيات التوحيد', duration: '١٥ دقيقة', level: 3 },
    ],
  },
  {
    id: 'salah',
    name: 'الصلاة',
    emoji: '🕌',
    color: '#1E40AF',
    bgColor: '#DBEAFE',
    description: 'الصلة بينك وبين الله — خمس مرات يومياً',
    lessons: [
      { id: 'salah-1', title: 'الصلوات الخمس وأوقاتها', duration: '١٠ دقائق', level: 1 },
      { id: 'salah-2', title: 'كيف تصلي — خطوة بخطوة', duration: '١٥ دقيقة', level: 2 },
      { id: 'salah-3', title: 'السنن الرواتب والخشوع', duration: '١٢ دقيقة', level: 3 },
    ],
  },
  {
    id: 'zakat',
    name: 'الزكاة',
    emoji: '🤲',
    color: '#92400E',
    bgColor: '#FEF3C7',
    description: 'تطهير المال — حق الفقراء في أموال الأغنياء',
    lessons: [
      { id: 'zakat-1', title: 'ما هي الزكاة ولماذا؟', duration: '٨ دقائق', level: 1 },
      { id: 'zakat-2', title: 'متى تجب وكيف تُحسب', duration: '١٠ دقائق', level: 2 },
      { id: 'zakat-3', title: 'مصارف الزكاة الثمانية', duration: '١٠ دقائق', level: 3 },
    ],
  },
  {
    id: 'sawm',
    name: 'الصيام',
    emoji: '🌙',
    color: '#6B21A8',
    bgColor: '#F3E8FF',
    description: 'صيام رمضان — تربية النفس والتقرب إلى الله',
    lessons: [
      { id: 'sawm-1', title: 'رمضان — الأساسيات', duration: '١٠ دقائق', level: 1 },
      { id: 'sawm-2', title: 'المفطرات والرخص', duration: '١٠ دقائق', level: 2 },
      { id: 'sawm-3', title: 'صيام التطوع وفضائله', duration: '٨ دقائق', level: 3 },
    ],
  },
  {
    id: 'hajj',
    name: 'الحج',
    emoji: '🕋',
    color: '#0F766E',
    bgColor: '#CCFBF1',
    description: 'زيارة بيت الله — مرة في العمر لمن استطاع',
    lessons: [
      { id: 'hajj-1', title: 'ما هو الحج ومتى يجب؟', duration: '٨ دقائق', level: 1 },
      { id: 'hajj-2', title: 'العمرة والحج — الأركان والواجبات', duration: '١٥ دقيقة', level: 2 },
      { id: 'hajj-3', title: 'الاستعداد العملي للحج', duration: '١٠ دقائق', level: 3 },
    ],
  },
]

export const imanPillars: ImanPillar[] = [
  {
    id: 'iman-allah',
    name: 'الإيمان بالله',
    emoji: '💎',
    color: '#1B4332',
    bgColor: '#D1FAE5',
    description: 'توحيد الربوبية والألوهية والأسماء والصفات',
    lessonId: 'iman-allah',
  },
  {
    id: 'iman-angels',
    name: 'الإيمان بالملائكة',
    emoji: '✨',
    color: '#1E40AF',
    bgColor: '#DBEAFE',
    description: 'مخلوقات نورانية تنفذ أوامر الله',
    lessonId: 'iman-angels',
  },
  {
    id: 'iman-books',
    name: 'الإيمان بالكتب',
    emoji: '📖',
    color: '#92400E',
    bgColor: '#FEF3C7',
    description: 'التوراة والإنجيل والزبور والقرآن',
    lessonId: 'iman-books',
  },
  {
    id: 'iman-messengers',
    name: 'الإيمان بالرسل',
    emoji: '🌟',
    color: '#6B21A8',
    bgColor: '#F3E8FF',
    description: 'من آدم إلى محمد ﷺ',
    lessonId: 'iman-messengers',
  },
  {
    id: 'iman-akhira',
    name: 'الإيمان باليوم الآخر',
    emoji: '⚖️',
    color: '#0F766E',
    bgColor: '#CCFBF1',
    description: 'الموت والبرزخ والقيامة والحساب',
    lessonId: 'iman-akhira',
  },
  {
    id: 'iman-qadr',
    name: 'الإيمان بالقدر',
    emoji: '🔮',
    color: '#B45309',
    bgColor: '#FEF3C7',
    description: 'خيره وشره — والتوازن بين التوكل والأخذ بالأسباب',
    lessonId: 'iman-qadr',
  },
]

/** Get all lesson IDs across both Islam and Iman pillars */
export function getAllLessonIds(): string[] {
  const islamIds = islamPillars.flatMap((p) => p.lessons.map((l) => l.id))
  const imanIds = imanPillars.map((p) => p.lessonId)
  return [...islamIds, ...imanIds]
}

/** Find which pillar a lesson belongs to */
export function findPillarForLesson(lessonId: string): IslamPillar | undefined {
  return islamPillars.find((p) => p.lessons.some((l) => l.id === lessonId))
}
