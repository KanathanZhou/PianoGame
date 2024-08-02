import {Rectangle} from "pixi.js";
import {
  BOTTOM_OFFSET,
  FPS,
  GAP,
  KEY_DROP_HEIGHT,
  KEY_DROP_TRIGGER_TYPE,
  KEY_DROP_WIDTH,
  LEFT_PADDING,
  SPEED
} from "./constant.js";

class KeyDrop extends Rectangle {
  /**
   * Whether the keyDrop is triggered or not
   * @type {boolean}
   */
  #triggered = false

  /**
   * The trigger type of the keyDrop
   * @type { 'instant' | 'holding' }
   */
  #triggerType = KEY_DROP_TRIGGER_TYPE.Instant

  constructor(time, col, canvasWidth, canvasHeight) {
    const initialX = col * (KEY_DROP_WIDTH + GAP) + LEFT_PADDING
    if (Array.isArray(time)) {
      const initialY = canvasHeight - (time[0] * FPS * SPEED) - BOTTOM_OFFSET
      const holdingKeyDropHeight = (time[1] - time[0]) * FPS * SPEED
      super(initialX, initialY, KEY_DROP_WIDTH, holdingKeyDropHeight)
      this.#triggerType = KEY_DROP_TRIGGER_TYPE.Holding
    } else {
      const initialY = canvasHeight - (time * FPS * SPEED) - BOTTOM_OFFSET
      super(initialX, initialY, KEY_DROP_WIDTH, KEY_DROP_HEIGHT)
      this.#triggerType = KEY_DROP_TRIGGER_TYPE.Instant
    }
  }

  get triggered() {
    return this.#triggered
  }

  set triggered(value) {
    this.#triggered = value
  }

  get triggerType() {
    return this.#triggerType
  }

  set triggerType(value) {
    this.#triggerType = value
  }
}

export default KeyDrop