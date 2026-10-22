import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from '@posthog/react'
import type { CaptureResult } from 'posthog-js'
import App from './App.tsx'
import { useAuthStore } from './modules/auth/states/authStore'

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2026-05-30',
  // No captura nada hasta que el usuario acepte el consentimiento (banner CookieConsent).
  opt_out_capturing_by_default: true,
  opt_out_capturing_persistence_type: 'localStorage',
  // SPA: pageviews automáticos en cambios de ruta (react-router).
  capture_pageview: 'history_change',
  // Pageleave ayuda a medir abandono de compra paso a paso.
  capture_pageleave: true,
  // Clics/interacciones anónimos (respeta .ph-no-capture; no captura valores de inputs).
  autocapture: true,
  // Solo crea perfil de persona tras identify(); los anónimos no crean perfil
  // (más eficiente en el plan gratuito y coherente con la política de privacidad).
  person_profiles: 'identified_only',
  // Etiqueta TODOS los eventos (custom + automáticos) con guest/auth para poder
  // segmentar el embudo de abandono por tipo de usuario. Corre por evento y lee
  // el store en el momento, así que siempre está fresco tras login/logout.
  before_send: (event: CaptureResult) => {
    try {
      const { isAuth } = useAuthStore.getState()
      event.properties = { ...event.properties, user_type: isAuth ? 'auth' : 'guest' }
    } catch {
      /* el store aún no está listo: se omite la propiedad */
    }
    return event
  },
  // Sin logs de PostHog en producción.
  debug: import.meta.env.DEV,
} as const

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN} options={options}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
