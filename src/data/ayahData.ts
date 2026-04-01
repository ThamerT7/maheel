export interface Ayah {
  arabic: string
  translation: string
  surah: string
  ayahNumber: string
}

export const dailyAyat: Ayah[] = [
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'ومن يعتمد على الله فإن الله كافيه',
    surah: 'الطلاق',
    ayahNumber: '٣',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'إن مع الصعوبة سهولة ويسراً',
    surah: 'الشرح',
    ayahNumber: '٦',
  },
  {
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    translation: 'وسيعطيك ربك حتى ترضى',
    surah: 'الضحى',
    ayahNumber: '٥',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'اذكروني أذكركم واشكروا نعمتي ولا تجحدوها',
    surah: 'البقرة',
    ayahNumber: '١٥٢',
  },
  {
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    translation: 'ربي وسّع صدري ويسّر أمري',
    surah: 'طه',
    ayahNumber: '٢٥-٢٦',
  },
  {
    arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
    translation: 'ونحن أقرب إليه من حبل الوريد',
    surah: 'ق',
    ayahNumber: '١٦',
  },
  {
    arabic: 'ادْعُونِي أَسْتَجِبْ لَكُمْ',
    translation: 'ادعوني أستجب لدعائكم',
    surah: 'غافر',
    ayahNumber: '٦٠',
  },
]

export function getTodayAyah(): Ayah {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return dailyAyat[dayOfYear % dailyAyat.length]
}
