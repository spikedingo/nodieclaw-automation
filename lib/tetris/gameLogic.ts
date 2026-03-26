import type { Cell, Piece, TetrominoType, RotationState } from './types'
import {
  BOARD_COLS, BOARD_ROWS, TETROMINO_SHAPES, TETROMINO_COLORS,
  WALL_KICKS_JLSTZ, WALL_KICKS_I, SCORE_TABLE, ALL_TETROMINOS
} from './constants'

export function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null))
}

export function getNextBag(existingBag: TetrominoType[]): TetrominoType[] {
  if (existingBag.length > 0) return existingBag
  const bag = [...ALL_TETROMINOS]
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return bag
}

export function drawFromBag(bag: TetrominoType[]): { piece: TetrominoType; bag: TetrominoType[] } {
  const newBag = bag.length === 0 ? getNextBag([]) : bag
  const [piece, ...rest] = newBag
  return { piece, bag: rest.length === 0 ? getNextBag([]) : rest }
}

export function spawnPiece(type: TetrominoType): Piece {
  return { type, rotation: 0, col: 3, row: -1 }
}

export function getPieceCells(piece: Piece): [number, number][] {
  return TETROMINO_SHAPES[piece.type][piece.rotation].map(
    ([dr, dc]) => [piece.row + dr, piece.col + dc]
  )
}

export function isValidPosition(board: Cell[][], piece: Piece): boolean {
  const cells = getPieceCells(piece)
  return cells.every(([row, col]) => {
    if (col < 0 || col >= BOARD_COLS) return false
    if (row >= BOARD_ROWS) return false
    if (row < 0) return true  // allow above board
    return board[row][col] === null
  })
}

export function getGhostPiece(board: Cell[][], piece: Piece): Piece {
  let ghost = { ...piece }
  while (isValidPosition(board, { ...ghost, row: ghost.row + 1 })) {
    ghost = { ...ghost, row: ghost.row + 1 }
  }
  return ghost
}

export function lockPiece(board: Cell[][], piece: Piece): Cell[][] {
  const newBoard = board.map(row => [...row])
  const cells = getPieceCells(piece)
  const color = TETROMINO_COLORS[piece.type].base
  cells.forEach(([row, col]) => {
    if (row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS) {
      newBoard[row][col] = color
    }
  })
  return newBoard
}

export function clearLines(board: Cell[][]): { board: Cell[][]; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null))
  const linesCleared = BOARD_ROWS - newBoard.length
  const emptyRows = Array.from({ length: linesCleared }, () => Array(BOARD_COLS).fill(null))
  return { board: [...emptyRows, ...newBoard], linesCleared }
}

export function calcScore(linesCleared: number, level: number): number {
  return (SCORE_TABLE[linesCleared] ?? 0) * level
}

export function rotatePiece(
  board: Cell[][],
  piece: Piece,
  direction: 'cw' | 'ccw'
): Piece | null {
  const newRotation = direction === 'cw'
    ? ((piece.rotation + 1) % 4) as RotationState
    : ((piece.rotation + 3) % 4) as RotationState

  const rotated: Piece = { ...piece, rotation: newRotation }
  const kickKey = `${piece.rotation}>${newRotation}`
  const kicks = piece.type === 'I' ? WALL_KICKS_I : WALL_KICKS_JLSTZ
  const kickData = kicks[kickKey] ?? [[0, 0]]

  for (const [dc, dr] of kickData) {
    const kicked: Piece = { ...rotated, col: rotated.col + dc, row: rotated.row + dr }
    if (isValidPosition(board, kicked)) return kicked
  }
  return null  // rotation failed
}

export function loadHighScore(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem('tetris_highscore') ?? '0', 10)
}

export function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('tetris_highscore', String(score))
}
