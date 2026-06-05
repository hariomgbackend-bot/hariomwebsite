'use client'

import { createContext, useContext, useState } from 'react'
import translations from '@/data/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const t = (path) => {
    const keys = path.split('.')
    let result = translations[lang]
    for (const key of keys) {
      result = result?.[key]
    }
    return result || path
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
