
type LanguageCode = 'en' | 'ja'
type LocaleCode = 'en-us' | 'ja-jp'

export const urlLocaleToLangCodeMap = new Map<string, LanguageCode>([
  [
    'en-us', 'en'
  ],
  [
    'ja-jp', 'ja'
  ]
])

export const langCodeToUrlLocaleMap = new Map<string, LocaleCode>([
  [
    'en', 'en-us'
  ],
  [
    'ja', 'ja-jp'
  ]
])
