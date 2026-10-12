import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ui } from '../data/content'

const PreferencesContext = createContext(null)

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* armazenamento indisponível: segue só em memória */
  }
}

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [lang, setLang] = useState(() => readStored('lang', 'pt'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    store('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    store('lang', lang)
  }, [lang])

  const value = useMemo(
    () => ({
      theme,
      lang,
      t: ui[lang],
      toggleTheme: () => setTheme((v) => (v === 'dark' ? 'light' : 'dark')),
      toggleLang: () => setLang((v) => (v === 'pt' ? 'en' : 'pt')),
    }),
    [theme, lang],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences precisa estar dentro de PreferencesProvider')
  return ctx
}
