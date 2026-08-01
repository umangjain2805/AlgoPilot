import { useCallback, useRef } from 'react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Loads Google Identity Services and returns a callback that launches the OAuth popup.
export const useGoogleLogin = (onSuccess, onError) => {
  const googleRef = useRef(null)

  const loadGoogleScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (googleRef.current) return resolve(googleRef.current)
      if (window.google?.accounts) {
        googleRef.current = window.google.accounts
        return resolve(googleRef.current)
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        googleRef.current = window.google.accounts
        resolve(googleRef.current)
      }
      script.onerror = () => reject(new Error('Failed to load Google Sign-In'))
      document.head.appendChild(script)
    })
  }, [])

  const signInWithGoogle = useCallback(() => {
    loadGoogleScript()
      .then((accounts) => {
        accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              onSuccess?.(response.credential)
            } else {
              onError?.(new Error('No credential returned from Google'))
            }
          },
        })
        accounts.id.prompt()
      })
      .catch((error) => onError?.(error))
  }, [loadGoogleScript, onSuccess, onError])

  return { signInWithGoogle, isConfigured: Boolean(GOOGLE_CLIENT_ID) }
}
