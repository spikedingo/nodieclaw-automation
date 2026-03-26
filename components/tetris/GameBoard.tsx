'use client'
import Cell from './Cell'
import type { Cell as CellType, Piece, GameStatus } from '@/lib/tetris/types'
import { getPieceCells, getGhostPiece } from '@/lib/tetris/gameLogic'
import { TETROMINO_COLORS } from '@/lib/tetris/constants'

interface GameBoardProps {
  board: CellType[][]
  currentPiece: Piece | null
  ghost: Piece | null
  gameStatus: GameStatus
  score: number
  highScore: number
  isNewBest: boolean
  onStart: () => void
  onRestart: () => void
}

export default function GameBoard({
  board, currentPiece, ghost, gameStatus, score, highScore, isNewBest, onStart, onRestart
}: GameBoardProps) {
  // Build render grid
  const renderGrid: (CellType | 'ghost')[][] = board.map(row => [...row] as (CellType | 'ghost')[])

  // Paint ghost
  if (ghost) {
    getPieceCells(ghost).forEach(([row, col]) => {
      if (row >= 0 && row < 20 && col >= 0 && col < 10 && renderGrid[row][col] === null) {
        renderGrid[row][col] = 'ghost'
      }
    })
  }

  // Paint current piece
  if (currentPiece) {
    const color = TETROMINO_COLORS[currentPiece.type].base
    getPieceCells(currentPiece).forEach(([row, col]) => {
      if (row >= 0 && row < 20 && col >= 0 && col < 10) {
        renderGrid[row][col] = color
      }
    })
  }

  const ghostColor = ghost ? TETROMINO_COLORS[ghost.type].base : null

  return (
    <div style={{ position: 'relative' }}>
      {/* Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 30px)',
        gridTemplateRows: 'repeat(20, 30px)',
        width: 300, height: 600,
        backgroundColor: '#0d0d14',
        border: '2px solid #3a3a5a',
        boxShadow: '0 0 20px rgba(0,240,240,0.25), 0 0 40px rgba(0,240,240,0.10), inset 0 0 20px rgba(0,0,0,0.8)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scanline effect */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }} />

        {/* Cells */}
        {renderGrid.flat().map((cell, i) => {
          const isGhostCell = cell === 'ghost'
          return (
            <Cell
              key={i}
              color={isGhostCell ? ghostColor : (cell as CellType)}
              isGhost={isGhostCell}
            />
          )
        })}
      </div>

      {/* Overlays */}
      {gameStatus === 'IDLE' && (
        <Overlay bg="rgba(10,10,20,0.92)">
          <p style={{ fontSize: 28, color: '#00f0f0', textShadow: '0 0 20px #00f0f0', marginBottom: 24 }}>TETRIS</p>
          <p style={{ fontSize: 9, color: '#e0e0ff', animation: 'blink 1s step-end infinite' }}>PRESS ENTER TO START</p>
          {highScore > 0 && <p style={{ fontSize: 7, color: '#555570', marginTop: 16 }}>BEST: {highScore.toString().padStart(7,'0')}</p>}
        </Overlay>
      )}

      {gameStatus === 'PAUSED' && (
        <Overlay bg="rgba(10,10,20,0.82)">
          <p style={{ fontSize: 14, color: '#e0e0ff', marginBottom: 12 }}>PAUSED</p>
          <p style={{ fontSize: 7, color: '#555570' }}>PRESS P TO RESUME</p>
        </Overlay>
      )}

      {gameStatus === 'GAME_OVER' && (
        <Overlay bg="rgba(10,10,20,0.88)">
          <p style={{ fontSize: 14, color: '#F00000', textShadow: '0 0 12px #F00000', marginBottom: 20 }}>GAME OVER</p>
          <p style={{ fontSize: 7, color: '#555570', marginBottom: 4 }}>SCORE</p>
          <p style={{ fontSize: 13, color: '#e0e0ff', marginBottom: 16 }}>{score.toString().padStart(7,'0')}</p>
          {isNewBest && <p style={{ fontSize: 8, color: '#F0F000', marginBottom: 12 }}>NEW BEST!</p>}
          <p style={{ fontSize: 7, color: '#555570', animation: 'blink 1s step-end infinite' }}>PRESS ENTER TO RESTART</p>
        </Overlay>
      )}
    </div>
  )
}

function Overlay({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundColor: bg,
      fontFamily: '"Press Start 2P", monospace',
    }}>
      {children}
    </div>
  )
}
