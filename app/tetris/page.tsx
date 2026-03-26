'use client'
import { useTetris } from '@/lib/tetris/hooks/useTetris'
import { useGameLoop } from '@/lib/tetris/hooks/useGameLoop'
import { useKeyboard } from '@/lib/tetris/hooks/useKeyboard'
import GameBoard from '@/components/tetris/GameBoard'
import SidePanel from '@/components/tetris/SidePanel'
import InfoPanel from '@/components/tetris/InfoPanel'
import { useRef } from 'react'

export default function TetrisPage() {
  const {
    state, ghost,
    start, restart, pauseToggle,
    moveLeft, moveRight, softDrop, hardDrop,
    rotateCW, rotateCCW, hold, gravityTick
  } = useTetris()

  const prevHighScore = useRef(state.highScore)
  const isNewBest = state.gameStatus === 'GAME_OVER' && state.score > 0 && state.score >= state.highScore && state.score > prevHighScore.current

  useGameLoop(state.gameStatus === 'PLAYING', state.level, gravityTick)

  useKeyboard({
    onLeft:  moveLeft,
    onRight: moveRight,
    onDown:  softDrop,
    onUp:    rotateCW,
    onSpace: () => {
      if (state.gameStatus === 'IDLE') { start(); return }
      if (state.gameStatus === 'GAME_OVER') { restart(); return }
      hardDrop()
    },
    onZ:     rotateCCW,
    onC:     hold,
    onP:     pauseToggle,
    onR:     restart,
    onEnter: () => {
      if (state.gameStatus === 'IDLE') start()
      else if (state.gameStatus === 'GAME_OVER') restart()
    },
  })

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '"Press Start 2P", monospace',
    }}>
      <h1 style={{ fontSize: 10, color: '#555570', marginBottom: 16, letterSpacing: '0.2em' }}>
        TETRIS
      </h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <SidePanel holdPiece={state.holdPiece} holdUsed={state.holdUsed} />
        <GameBoard
          board={state.board}
          currentPiece={state.currentPiece}
          ghost={ghost}
          gameStatus={state.gameStatus}
          score={state.score}
          highScore={state.highScore}
          isNewBest={isNewBest}
          onStart={start}
          onRestart={restart}
        />
        <InfoPanel
          nextPiece={state.nextPiece}
          score={state.score}
          level={state.level}
          linesCleared={state.linesCleared}
          highScore={state.highScore}
        />
      </div>
    </main>
  )
}
