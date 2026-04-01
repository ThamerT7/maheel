import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface Category {
  label: string
  term: string
  color: string
  bg: string
  definition: string
  examples: string[]
}

const categories: Category[] = [
  {
    label: 'فرض',
    term: 'الفريضة',
    color: '#1B4332',
    bg: '#D1FAE5',
    definition: 'ما أوجبه الله — تركه ذنب، وفعله عبادة',
    examples: ['الصلوات الخمس', 'الزكاة للمستطيع', 'صيام رمضان', 'الحج للمستطيع', 'الشهادتان'],
  },
  {
    label: 'سنة',
    term: 'السنة المؤكدة والمستحبة',
    color: '#1E40AF',
    bg: '#DBEAFE',
    definition: 'ما فعله النبي ﷺ باستمرار — فعله أجر، وتركه لا إثم',
    examples: ['السواك', 'صلاة الضحى', 'صيام الاثنين والخميس', 'السلام عند اللقاء', 'الوتر'],
  },
  {
    label: 'عادة ثقافية',
    term: 'العرف والعادة',
    color: '#92400E',
    bg: '#FEF3C7',
    definition: 'ممارسات اجتماعية في مجتمعات مسلمة — ليست دِيناً بالضرورة',
    examples: [
      'طريقة لبس معينة في بلد ما',
      'أطعمة بعينها في المناسبات',
      'بعض تقاليد العقيقة',
      'تقاليد الأعراس المحلية',
    ],
  },
  {
    label: 'مسألة خلافية',
    term: 'الاجتهاد والخلاف',
    color: '#6B21A8',
    bg: '#F3E8FF',
    definition: 'اختلف فيها العلماء — ولكل رأي دليله المعتبر',
    examples: [
      'بعض أحكام الموسيقى',
      'الاحتفال بالمولد النبوي',
      'بعض مسائل اللباس',
      'أكل ذبائح أهل الكتاب',
    ],
  },
]

export function SourceCompass() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <div className="pb-6" dir="rtl">
      <div className="px-5 pt-6 mb-2">
        <h1 className="text-xl font-bold text-primary dark:text-primary-lightest">بوصلة المصدر</h1>
        <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
          ليس كل ما يُقال في الإسلام على نفس الدرجة. تعلّم التمييز بين الأحكام.
        </p>
      </div>

      <div className="px-5 space-y-3 mt-4">
        {categories.map((cat, i) => {
          const isOpen = expanded === i
          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full rounded-2xl p-5 text-right transition-all bg-white dark:bg-white/5 min-h-[56px] focus-visible:outline-2 focus-visible:outline-primary ${
                  isOpen ? 'shadow-md' : 'shadow-sm'
                }`}
                style={{ borderRight: `4px solid ${cat.color}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3.5 py-1.5 rounded-full text-sm font-semibold"
                      style={{ color: cat.color, backgroundColor: cat.bg }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-xs text-text-muted">{cat.term}</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="rounded-b-2xl px-5 pb-5 -mt-2 pt-4 space-y-4"
                      style={{
                        background: `linear-gradient(180deg, ${cat.bg}40 0%, white 40%)`,
                      }}
                    >
                      <p className="text-text-muted leading-relaxed text-sm">{cat.definition}</p>
                      <div>
                        <p className="text-xs font-semibold text-text mb-3">أمثلة من الحياة:</p>
                        <div className="flex flex-wrap gap-2.5">
                          {cat.examples.map((ex) => (
                            <span
                              key={ex}
                              className="px-4 py-2 rounded-xl text-xs font-medium shadow-xs"
                              style={{ color: cat.color, backgroundColor: cat.bg }}
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
