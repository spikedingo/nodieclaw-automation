'use client'
import { useEffect, useRef } from 'react'

interface KeyHandlers {
  onLeft: () => void
  onRight: () => void
  onDown: () => void
  onUp: () => void
  onSpace: () => void
  onZ: () => void
  onC: () => void
  onP: () => void
  onR: () => void
  onEnter: () => void
}

export function useKeyboard(handlers: KeyHandlers) {
  const ref = useRef(handlers)
  ref.current = handlers

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      switch (e.code) {
        case 'ArrowLeft':  e.preventDefault(); ref.current.onLeft(); break
        case 'ArrowRight': e.preventDefault(); ref.current.onRight(); break
        case 'ArrowDown':  e.preventDefault(); ref.current.onDown(); break
        case 'ArrowUp':    e.preventDefault(); ref.current.onUp(); break
        case 'Space':      e.preventDefault(); ref.current.onSpace(); break
        case 'KeyZ':       e.preventDefault(); ref.current.onZ(); break
        case 'KeyC':       e.preventDefault(); ref.current.onC(); break
        case 'KeyP':       e.preventDefault(); ref.current.onP(); break
        case 'KeyR':       e.preventDefault(); ref.current.onR(); break
        case 'Enter':      e.preventDefault(); ref.current.onEnter(); break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
