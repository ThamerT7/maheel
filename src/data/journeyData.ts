export interface JourneyModule {
  id: string
  title: string
  duration: string
}

export interface JourneyStage {
  stage: number
  id: string
  name: string
  period: string
  color: string
  modules: JourneyModule[]
}

export const journeyStages: JourneyStage[] = [
  {
    stage: 1,
    id: 's1',
    name: 'الأساس',
    period: 'الأسبوع الأول',
    color: '#1B4332',
    modules: [
      { id: 's1-shahada', title: 'الشهادتان — المعنى والمتطلبات', duration: '١٠ دقائق' },
      { id: 's1-tahara', title: 'الطهارة والوضوء', duration: '٨ دقائق' },
      { id: 's1-salah', title: 'الصلاة — الخطوات', duration: '١٥ دقيقة' },
      { id: 's1-fatiha', title: 'سورة الفاتحة', duration: '١٢ دقيقة' },
      { id: 's1-qibla', title: 'القبلة وأوقات الصلاة', duration: '٥ دقائق' },
    ],
  },
  {
    stage: 2,
    id: 's2',
    name: 'الثبات',
    period: 'الشهر الأول',
    color: '#2D6A4F',
    modules: [
      { id: 's2-regular', title: 'الصلوات الخمس بانتظام', duration: '١٠ دقائق' },
      { id: 's2-adhkar', title: 'أذكار الصباح والمساء', duration: '٨ دقائق' },
      { id: 's2-surahs', title: 'سور قصيرة للصلاة', duration: '١٥ دقيقة' },
      { id: 's2-halal', title: 'الحلال والحرام الأساسي', duration: '١٠ دقائق' },
      { id: 's2-questions', title: 'التعامل مع الأسئلة من الآخرين', duration: '٨ دقائق' },
    ],
  },
  {
    stage: 3,
    id: 's3',
    name: 'الفهم',
    period: 'الأشهر ٢–٦',
    color: '#40916C',
    modules: [
      { id: 's3-pillars-islam', title: 'أركان الإسلام الخمسة بعمق', duration: '٢٠ دقيقة' },
      { id: 's3-pillars-iman', title: 'أركان الإيمان الستة', duration: '١٥ دقيقة' },
      { id: 's3-fiqh', title: 'الفقه العملي اليومي', duration: '١٢ دقيقة' },
      { id: 's3-shubhat', title: 'الردود على الشبهات الشائعة', duration: '١٥ دقيقة' },
      { id: 's3-sunnah', title: 'مفهوم السنة والحديث', duration: '١٠ دقائق' },
    ],
  },
  {
    stage: 4,
    id: 's4',
    name: 'التعمق',
    period: 'الأشهر ٧–١٢',
    color: '#52B788',
    modules: [
      { id: 's4-tajweed', title: 'قراءة القرآن بالتجويد', duration: '٢٠ دقيقة' },
      { id: 's4-seerah', title: 'السيرة النبوية', duration: '٢٥ دقيقة' },
      { id: 's4-madhab', title: 'الفقه حسب المذاهب', duration: '١٥ دقيقة' },
      { id: 's4-identity', title: 'بناء الهوية الإسلامية', duration: '١٢ دقيقة' },
      { id: 's4-service', title: 'خدمة الآخرين', duration: '١٠ دقائق' },
    ],
  },
]
