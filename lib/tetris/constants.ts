import type { TetrominoType } from './types'

export const BOARD_COLS = 10
export const BOARD_ROWS = 20
export const CELL_SIZE = 30

// Piece shapes: [rotationState][cellIndex][row, col] offsets from top-left of bounding box
export const TETROMINO_SHAPES: Record<TetrominoType, [number, number][][]> = {
  I: [
    [[1,0],[1,1],[1,2],[1,3]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[0,1],[1,1],[2,1],[3,1]],
  ],
  O: [
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
  ],
  T: [
    [[0,1],[1,0],[1,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,1]],
    [[1,0],[1,1],[1,2],[2,1]],
    [[0,1],[1,0],[1,1],[2,1]],
  ],
  S: [
    [[0,1],[0,2],[1,0],[1,1]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[1,1],[1,2],[2,0],[2,1]],
    [[0,0],[1,0],[1,1],[2,1]],
  ],
  Z: [
    [[0,0],[0,1],[1,1],[1,2]],
    [[0,2],[1,1],[1,2],[2,1]],
    [[1,0],[1,1],[2,1],[2,2]],
    [[0,1],[1,0],[1,1],[2,0]],
  ],
  J: [
    [[0,0],[1,0],[1,1],[1,2]],
    [[0,1],[0,2],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[1,1],[2,0],[2,1]],
  ],
  L: [
    [[0,2],[1,0],[1,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,1]],
    [[1,0],[1,1],[1,2],[2,0]],
    [[0,1],[1,0],[1,1],[2,1]],
  ],
}

export const TETROMINO_COLORS: Record<TetrominoType, { base: string; light: string; dark: string }> = {
  I: { base: '#00F0F0', light: '#80FFFF', dark: '#007878' },
  O: { base: '#F0F000', light: '#FFFF80', dark: '#787800' },
  T: { base: '#A000F0', light: '#D080FF', dark: '#500078' },
  S: { base: '#00F000', light: '#80FF80', dark: '#007800' },
  Z: { base: '#F00000', light: '#FF8080', dark: '#780000' },
  J: { base: '#0000F0', light: '#8080FF', dark: '#000078' },
  L: { base: '#F0A000', light: '#FFD080', dark: '#785000' },
}

// Drop interval in ms per level
export const LEVEL_SPEEDS: number[] = [
  800, 717, 633, 550, 467, 383, 300, 217, 133, 100
]

export const getSpeed = (level: number): number =>
  LEVEL_SPEEDS[Math.min(level - 1, LEVEL_SPEEDS.length - 1)]

export const SCORE_TABLE: Record<number, number> = { 1: 100, 2: 300, 3: 500, 4: 800 }

// SRS wall kick data for JLSTZ pieces (0-indexed rotation states)
// Format: [fromState][kickIndex][dc, dr] — dc=col offset, dr=row offset (screen coords, down+)
// Source: tetris.wiki/Super_Rotation_System — (x,y) with y-up converted: dc=x, dr=-y
export const WALL_KICKS_JLSTZ: Record<string, [number, number][]> = {
  '0>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '1>0': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '1>2': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '2>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '2>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '3>2': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '3>0': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '0>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
}

// SRS wall kick data for I piece
// Source: tetris.wiki/Super_Rotation_System — (x,y) with y-up converted: dc=x, dr=-y
export const WALL_KICKS_I: Record<string, [number, number][]> = {
  '0>1': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  '1>0': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  '1>2': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  '2>1': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  '2>3': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  '3>2': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  '3>0': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  '0>3': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
}

export const ALL_TETROMINOS: TetrominoType[] = ['I','O','T','S','Z','J','L']
