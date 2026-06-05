'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export function useTranslation() {
  const { lang, setLang, t } = useLanguage()
  return { lang, setLang, t }
}
