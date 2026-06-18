export type Locale = 'ar' | 'en'

export const LOCALE_STORAGE_KEY = 'ideaTechLocale'

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary
}
