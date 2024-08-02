import {TextStyle} from "pixi.js";

export const KEY_DROP_TRIGGER_TYPE = {
  Instant: 'instant',
  Holding: 'holding'
}
export const KEY_DROP_WIDTH = 78
export const KEY_DROP_HEIGHT = 30
export const LEFT_PADDING = 12
export const RIGHT_PADDING = 12
export const FPS = 60 // frame / second
export const SPEED = 1 // distance / frame
export const GAP = 24
export const CANVAS_WIDTH = LEFT_PADDING + RIGHT_PADDING + 7 * GAP + 8 * KEY_DROP_WIDTH
export const CANVAS_HEIGHT = 600

export const BOTTOM_OFFSET = KEY_DROP_HEIGHT

export const DEFAULT_TEXT_STYLE = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 11,
  fill: ['#ffffff'], // gradient
  wordWrap: true,
  wordWrapWidth: 440,
})

export const KEY_PRESSED_TEXT_STYLE = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 11,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
})

export const MUSIC_KEYS = [
  { label: 'A', keyCode: 'A', col: 0 },
  { label: 'A', keyCode: 'a', col: 0 },
  { label: 'S', keyCode: 'S', col: 1 },
  { label: 'S', keyCode: 's', col: 1 },
  { label: 'D', keyCode: 'D', col: 2 },
  { label: 'D', keyCode: 'd', col: 2 },
  { label: 'F', keyCode: 'F', col: 3 },
  { label: 'F', keyCode: 'f', col: 3 },
  { label: 'H', keyCode: 'H', col: 4 },
  { label: 'H', keyCode: 'h', col: 4 },
  { label: 'J', keyCode: 'J', col: 5 },
  { label: 'J', keyCode: 'j', col: 5 },
  { label: 'K', keyCode: 'K', col: 6 },
  { label: 'K', keyCode: 'k', col: 6 },
  { label: 'L', keyCode: 'L', col: 7 },
  { label: 'L', keyCode: 'l', col: 7 },
]

export const MUSIC_KEYS_TRIGGER_AREA = [
  [0], [0], [0], [0], [0], [0], [0], [0]
]