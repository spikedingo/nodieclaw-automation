'use client'
import { useReducer, useCallback, useEffect } from 'react'
import type { GameState } from '../types'
import {
  createEmptyBoard, drawFromBag, spawnPiece, isValidPosition,
  getGhostPiece, lockPiece, clearLines, calcScore, rotatePiece,
  loadHighScore, saveHighScore
} from '../gameLogic'

type Action =
  | { type: 'START' }
  | { type: 'RESTART' }
  | { type: 'PAUSE_TOGGLE' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'ROTATE_CW' }
  | { type: 'ROTATE_CCW' }
  | { type: 'HOLD' }
  | { type: 'GRAVITY_TICK' }

function makeInitialState(): GameState {
  const bag = drawFromBag([])
  const next = drawFromBag(bag.bag)
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: bag.piece,
    holdPiece: null,
    holdUsed: false,
    bag: next.bag,
    score: 0,
    highScore: 0,
    level: 1,
    linesCleared: 0,
    gameStatus: 'IDLE',
  }
}

function spawnNext(state: GameState): GameState {
  const piece = spawnPiece(state.nextPiece)
  if (!isValidPosition(state.board, piece)) {
    const newHigh = Math.max(state.score, state.highScore)
    if (newHigh > state.highScore) saveHighScore(newHigh)
    return { ...state, gameStatus: 'GAME_OVER', highScore: newHigh, currentPiece: null }
  }
  const { piece: nextType, bag } = drawFromBag(state.bag)
  return { ...state, currentPiece: piece, nextPiece: nextType, bag, holdUsed: false }
}

function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'START') {
    const highScore = loadHighScore()
    const s = makeInitialState()
    return spawnNext({ ...s, highScore, gameStatus: 'PLAYING' })
  }

  if (action.type === 'RESTART') {
    const highScore = state.highScore
    const s = makeInitialState()
    return spawnNext({ ...s, highScore, gameStatus: 'PLAYING' })
  }

  if (action.type === 'PAUSE_TOGGLE') {
    if (state.gameStatus === 'PLAYING') return { ...state, gameStatus: 'PAUSED' }
    if (state.gameStatus === 'PAUSED') return { ...state, gameStatus: 'PLAYING' }
    return state
  }

  if (state.gameStatus !== 'PLAYING' || !state.currentPiece) return state

  const piece = state.currentPiece

  if (action.type === 'MOVE_LEFT') {
    const moved = { ...piece, col: piece.col - 1 }
    return isValidPosition(state.board, moved) ? { ...state, currentPiece: moved } : state
  }

  if (action.type === 'MOVE_RIGHT') {
    const moved = { ...piece, col: piece.col + 1 }
    return isValidPosition(state.board, moved) ? { ...state, currentPiece: moved } : state
  }

  if (action.type === 'ROTATE_CW') {
    const rotated = rotatePiece(state.board, piece, 'cw')
    return rotated ? { ...state, currentPiece: rotated } : state
  }

  if (action.type === 'ROTATE_CCW') {
    const rotated = rotatePiece(state.board, piece, 'ccw')
    return rotated ? { ...state, currentPiece: rotated } : state
  }

  if (action.type === 'SOFT_DROP') {
    const moved = { ...piece, row: piece.row + 1 }
    if (isValidPosition(state.board, moved)) {
      return { ...state, currentPiece: moved, score: state.score + 1 }
    }
    // Lock
    const newBoard = lockPiece(state.board, piece)
    const { board, linesCleared } = clearLines(newBoard)
    const addScore = calcScore(linesCleared, state.level)
    const totalLines = state.linesCleared + linesCleared
    const newLevel = Math.floor(totalLines / 10) + 1
    const newScore = state.score + addScore
    const newHigh = Math.max(newScore, state.highScore)
    if (newHigh > state.highScore) saveHighScore(newHigh)
    return spawnNext({ ...state, board, linesCleared: totalLines, level: newLevel, score: newScore, highScore: newHigh })
  }

  if (action.type === 'HARD_DROP') {
    const ghost = getGhostPiece(state.board, piece)
    const rowsDropped = ghost.row - piece.row
    const newBoard = lockPiece(state.board, ghost)
    const { board, linesCleared } = clearLines(newBoard)
    const addScore = calcScore(linesCleared, state.level) + rowsDropped * 2
    const totalLines = state.linesCleared + linesCleared
    const newLevel = Math.floor(totalLines / 10) + 1
    const newScore = state.score + addScore
    const newHigh = Math.max(newScore, state.highScore)
    if (newHigh > state.highScore) saveHighScore(newHigh)
    return spawnNext({ ...state, board, linesCleared: totalLines, level: newLevel, score: newScore, highScore: newHigh })
  }

  if (action.type === 'HOLD') {
    if (state.holdUsed) return state
    if (!state.holdPiece) {
      const { piece: nextType, bag } = drawFromBag(state.bag)
      return spawnNext({
        ...state,
        holdPiece: piece.type,
        nextPiece: nextType,
        bag,
        holdUsed: true,
        currentPiece: null,
      })
    }
    const held = state.holdPiece
    return spawnNext({
      ...state,
      holdPiece: piece.type,
      nextPiece: held,
      holdUsed: true,
      currentPiece: null,
    })
  }

  if (action.type === 'GRAVITY_TICK') {
    const moved = { ...piece, row: piece.row + 1 }
    if (isValidPosition(state.board, moved)) {
      return { ...state, currentPiece: moved }
    }
    // Lock on gravity
    const newBoard = lockPiece(state.board, piece)
    const { board, linesCleared } = clearLines(newBoard)
    const addScore = calcScore(linesCleared, state.level)
    const totalLines = state.linesCleared + linesCleared
    const newLevel = Math.floor(totalLines / 10) + 1
    const newScore = state.score + addScore
    const newHigh = Math.max(newScore, state.highScore)
    if (newHigh > state.highScore) saveHighScore(newHigh)
    return spawnNext({ ...state, board, linesCleared: totalLines, level: newLevel, score: newScore, highScore: newHigh })
  }

  return state
}

export function useTetris() {
  const [state, dispatch] = useReducer(reducer, null, makeInitialState)

  useEffect(() => {
    dispatch({ type: 'START' })
  }, [])

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])
  const pauseToggle = useCallback(() => dispatch({ type: 'PAUSE_TOGGLE' }), [])
  const moveLeft = useCallback(() => dispatch({ type: 'MOVE_LEFT' }), [])
  const moveRight = useCallback(() => dispatch({ type: 'MOVE_RIGHT' }), [])
  const softDrop = useCallback(() => dispatch({ type: 'SOFT_DROP' }), [])
  const hardDrop = useCallback(() => dispatch({ type: 'HARD_DROP' }), [])
  const rotateCW = useCallback(() => dispatch({ type: 'ROTATE_CW' }), [])
  const rotateCCW = useCallback(() => dispatch({ type: 'ROTATE_CCW' }), [])
  const hold = useCallback(() => dispatch({ type: 'HOLD' }), [])
  const gravityTick = useCallback(() => dispatch({ type: 'GRAVITY_TICK' }), [])

  const ghost = state.currentPiece && state.gameStatus === 'PLAYING'
    ? getGhostPiece(state.board, state.currentPiece)
    : null

  return { state, ghost, start, restart, pauseToggle, moveLeft, moveRight, softDrop, hardDrop, rotateCW, rotateCCW, hold, gravityTick }
}
