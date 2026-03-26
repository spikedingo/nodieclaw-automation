'use client'
import { useEffect, useRef } from 'react'
import { getSpeed } from '../constants'

export function useGameLoop(
  isActive: boolean,
  level: number,
  onTick: () => void
) {
  const tickRef = useRef(onTick)
  tickRef.current = onTick

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => tickRef.current(), getSpeed(level))
    return () => clearInterval(interval)
  }, [isActive, level])
}
