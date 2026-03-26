'use client'
import MiniGrid from './MiniGrid'
import type { TetrominoType } from '@/lib/tetris/types'

interface SidePanelProps {
  holdPiece: TetrominoType | null
  holdUsed: boolean
}

export default function SidePanel({ holdPiece, holdUsed }: SidePanelProps) {
  return (
    <div style={{
      width: 100, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8,
      padding: '12px 8px',
      backgroundColor: '#111118',
      border: '2px solid #2a2a3a',
      fontFamily: '"Press Start 2P", monospace',
    }}>
      <span style={{ fontSize: 8, color: '#555570', letterSpacing: '0.05em' }}>HOLD</span>
      <MiniGrid piece={holdPiece} isLocked={holdUsed} />
    </div>
  )
}
