/** App-wide configuration — single source of truth */

export const APP_CONFIG = {
  name: 'مَهِيل',
  nameEn: 'Maheel',
  version: '1.0.0',
  tagline: 'رفيقك في رحلة الإسلام',

  /** Daily question limit for free tier */
  dailyQuestionLimit: 10,

  /** Daily minutes options */
  dailyMinutesOptions: [5, 10, 15, 20] as const,

  /** Supported languages */
  languages: [
    { code: 'ar' as const, label: 'العربية', flag: '🇸🇦', dir: 'rtl' as const },
    { code: 'en' as const, label: 'English', flag: '🇬🇧', dir: 'ltr' as const },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷', dir: 'ltr' as const },
    { code: 'tr' as const, label: 'Türkçe', flag: '🇹🇷', dir: 'ltr' as const },
    { code: 'id' as const, label: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' as const },
  ],

  /** localStorage keys */
  storageKeys: {
    user: 'maheel_user',
    prayers: 'maheel_prayers',
    progress: 'maheel_progress',
    chat: 'maheel_chat',
    theme: 'maheel_theme',
  },

  /** Data schema version — increment when store shapes change */
  dataVersion: 1,

  /** Colors (for dynamic use outside Tailwind) */
  colors: {
    primary: '#1B4332',
    primaryLight: '#2D6A4F',
    accent: '#D4A853',
    surface: '#FAF7F2',
    fard: '#1B4332',
    sunnah: '#1E40AF',
    cultural: '#92400E',
    khilaf: '#6B21A8',
  },

  /** AI system prompt for Ask Freely */
  aiSystemPrompt: `أنت مرافق إسلامي للمسلمين الجدد. أسلوبك: دافئ، صبور، لا تحكم، علمي.

قواعد الإجابة:
- كل إجابة تبدأ بجملة تطمينية مثل "سؤالك طبيعي جداً" أو "هذا سؤال مهم"
- الإجابة المباشرة في ٢-٣ جمل فقط
- كل حكم فقهي يُصنَّف بأحد التصنيفات التالية: [فرض] أو [سنة] أو [عادة ثقافية] أو [مسألة خلافية]
- لا تستخدم أسلوباً وعظياً أو تعليمياً متعالياً

عبارات محظورة لا تستخدمها أبداً:
- "يجب عليك"
- "هذا حرام ولا يجوز"
- "أنت مخطئ"
- "المسلم الحقيقي يجب أن"
- "هذا سؤال بديهي"

في نهاية كل إجابة، أضف سطراً جديداً يبدأ بـ [التصنيف: ] متبوعاً بأحد التصنيفات الأربعة إن كان السؤال فقهياً. إذا لم يكن فقهياً، لا تضف تصنيفاً.

أجب بالعربية دائماً. كن مختصراً ودافئاً.`,

  /** Concern options for onboarding */
  concernOptions: [
    'كيف أؤدي الصلاة',
    'كيف أشرح إسلامي لعائلتي',
    'الفرق بين الدين والعادات',
    'أحتاج أصدقاء مسلمين',
    'أسئلة لا أجرؤ على سؤالها',
    'فهم القرآن',
    'أحكام الحلال والحرام اليومية',
  ],

  /** Prayer time API (Aladhan) */
  prayerTimesApi: 'https://api.aladhan.com/v1',
} as const
