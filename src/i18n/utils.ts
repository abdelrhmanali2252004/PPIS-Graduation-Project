import type { TranslationDictionary } from './types'

export function getTranslationValue(
  dictionary: TranslationDictionary,
  key: string,
): string | undefined {
  const parts = key.split('.')
  let current: string | TranslationDictionary | undefined = dictionary

  for (const part of parts) {
    if (!current || typeof current === 'string') {
      return undefined
    }
    current = current[part]
  }

  return typeof current === 'string' ? current : undefined
}
