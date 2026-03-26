'use client'
import { TETROMINO_SHAPES, TETROMINO_COLORS } from '@/lib/tetris/constants'
import type { TetrominoType } from '@/lib/tetris/types'

interface MiniGridProps {
  piece: TetrominoType | null
  isLocked?: boolean
}

export default function MiniGrid({ piece, isLocked }: MiniGridProps) {
  const grid: (string | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null))

  if (piece) {
    const cells = TETROMINO_SHAPES[piece][0]
    const color = TETROMINO_COLORS[piece].base
    cells.forEach(([row, col]) => {
      if (row >= 0 && row < 4 && col >= 0 && col < 4) grid[row][col] = color
    })
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 20px)',
      gridTemplateRows: 'repeat(4, 20px)',
      width: 80, height: 80,
      backgroundColor: '#0d0d14',
      border: '1px solid #2a2a3a',
      opacity: isLocked ? 0.3 : 1,
      filter: isLocked ? 'grayscale(1)' : 'none',
    }}>
      {grid.flat().map((color, i) => {
        const entry = color ? Object.values(TETROMINO_COLORS).find(c => c.base === color) : null
        return (
          <div key={i} style={{
            width: 20, height: 20, boxSizing: 'border-box',
            backgroundColor: color ?? 'transparent',
            border: color ? `1px solid ${entry?.dark ?? '#000'}` : '1px solid transparent',
            boxShadow: color && entry ? `inset 1px 1px 0 ${entry.light}, inset -1px -1px 0 ${entry.dark}` : 'none',
          }} />
        )
      })}
    </div>
  )
}
