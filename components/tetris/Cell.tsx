'use client'
import { TETROMINO_COLORS } from '@/lib/tetris/constants'

interface CellProps {
  color: string | null   // null = empty, string = hex color
  isGhost?: boolean
}

export default function Cell({ color, isGhost }: CellProps) {
  if (!color) {
    return (
      <div style={{
        width: 30, height: 30, boxSizing: 'border-box',
        backgroundColor: '#0d0d14',
        border: '1px solid #1a1a24',
      }} />
    )
  }

  // Find bevel colors
  const entry = Object.values(TETROMINO_COLORS).find(c => c.base === color)
  const light = entry?.light ?? '#ffffff'
  const dark = entry?.dark ?? '#000000'

  return (
    <div style={{
      width: 30, height: 30, boxSizing: 'border-box',
      backgroundColor: color,
      border: `1px solid ${dark}`,
      boxShadow: `inset 1px 1px 0 ${light}, inset -1px -1px 0 ${dark}`,
      opacity: isGhost ? 0.25 : 1,
    }} />
  )
}
