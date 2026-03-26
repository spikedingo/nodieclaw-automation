'use client'
import MiniGrid from './MiniGrid'
import type { TetrominoType } from '@/lib/tetris/types'

interface InfoPanelProps {
  nextPiece: TetrominoType
  score: number
  level: number
  linesCleared: number
  highScore: number
}

const CONTROLS = [
  ['←→', 'Move'],
  ['↑', 'Rotate CW'],
  ['Z', 'Rotate CCW'],
  ['↓', 'Soft Drop'],
  ['SPC', 'Hard Drop'],
  ['C', 'Hold'],
  ['P', 'Pause'],
  ['R', 'Restart'],
]

export default function InfoPanel({ nextPiece, score, level, linesCleared, highScore }: InfoPanelProps) {
  const font: React.CSSProperties = { fontFamily: '"Press Start 2P", monospace' }

  return (
    <div style={{
      width: 120, display: 'flex', flexDirection: 'column', gap: 12,
      padding: '12px 10px',
      backgroundColor: '#111118',
      border: '2px solid #2a2a3a',
      ...font,
    }}>
      <Section label="NEXT"><MiniGrid piece={nextPiece} /></Section>
      <Divider />
      <Section label="SCORE">
        <span style={{ fontSize: 11, color: '#e0e0ff' }}>{score.toString().padStart(7, '0')}</span>
      </Section>
      <Section label="LEVEL">
        <span style={{ fontSize: 12, color: '#e0e0ff' }}>{level.toString().padStart(2, '0')}</span>
      </Section>
      <Section label="LINES">
        <span style={{ fontSize: 12, color: '#e0e0ff' }}>{linesCleared.toString().padStart(3, '0')}</span>
      </Section>
      <Divider />
      <Section label="BEST">
        <span style={{ fontSize: 11, color: '#F0F000' }}>{highScore.toString().padStart(7, '0')}</span>
      </Section>
      <Divider />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 6, color: '#555570', marginBottom: 4 }}>CONTROLS</span>
        {CONTROLS.map(([key, desc]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            <span style={{ fontSize: 6, color: '#00f0f0' }}>{key}</span>
            <span style={{ fontSize: 6, color: '#555570' }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 6, color: '#555570', letterSpacing: '0.05em' }}>{label}</span>
      {children}
    </div>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #2a2a3a', margin: 0 }} />
}
