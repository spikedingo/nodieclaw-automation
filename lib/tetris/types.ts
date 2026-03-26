export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
export type RotationState = 0 | 1 | 2 | 3
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
export type Cell = string | null  // null=empty, string=hex color of locked piece

export interface Piece {
  type: TetrominoType
  rotation: RotationState
  col: number
  row: number
}

export interface GameState {
  board: Cell[][]           // [row][col], 20 rows × 10 cols
  currentPiece: Piece | null
  nextPiece: TetrominoType
  holdPiece: TetrominoType | null
  holdUsed: boolean
  bag: TetrominoType[]
  score: number
  highScore: number
  level: number
  linesCleared: number
  gameStatus: GameStatus
}
