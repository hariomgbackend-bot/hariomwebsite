'use client'

import { useTranslation } from '@/hooks/useTranslation'

const languages = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हिं', full: 'हिन्दी' },
  { code: 'mr', label: 'मरा', full: 'मराठी' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation()

  return (
    <div className="flex items-center gap-1">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            lang === l.code
              ? 'bg-accent-500 text-white'
              : 'text-gray-600 hover:text-accent-500 hover:bg-accent-50'
          }`}
          title={l.full}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
