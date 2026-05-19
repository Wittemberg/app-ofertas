import { useState, useEffect, createContext, useContext } from 'react'
import { getTenant } from '../api/public'

const BrandingContext = createContext({ loading: true, tenant: null })

export function useBranding() {
  return useContext(BrandingContext)
}

export default function BrandingProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenant()
      .then(data => {
        setTenant(data)
        applyBranding(data)
      })
      .catch(err => {
        console.error('Erro ao carregar branding:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <BrandingContext.Provider value={{ loading, tenant }}>
      {children}
    </BrandingContext.Provider>
  )
}

function applyBranding(t) {
  const root = document.documentElement
  root.style.setProperty('--primary', t.primary_color || '#2563eb')
  root.style.setProperty('--primary-dark', darken(t.primary_color || '#2563eb'))
  root.style.setProperty('--secondary', t.secondary_color || '#1e40af')
  root.style.setProperty('--accent', t.accent_color || '#f59e0b')
  root.style.setProperty('--background', t.background_color || '#ffffff')
  root.style.setProperty('--text', t.text_color || '#1a1a1a')

  if (t.logo_url) {
    const link = document.querySelector('link[rel="icon"]')
    if (link) link.href = t.logo_url
  }

  if (t.name) {
    document.title = `${t.name} - Ofertas`
  }

  if (t.font_family) {
    root.style.setProperty('--font', t.font_family)
  }
}

function darken(hex) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max((num >> 16) - 30, 0)
  const g = Math.max(((num >> 8) & 0x00FF) - 30, 0)
  const b = Math.max((num & 0x0000FF) - 30, 0)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}