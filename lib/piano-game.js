import {Application, Container, Graphics, Text} from 'pixi.js';
import keyboard from './keyboard'
import KeyDrop from "./key-drop.js";
import {SONG} from "./song.js";
import {
  BOTTOM_OFFSET,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_TEXT_STYLE,
  KEY_DROP_HEIGHT,
  KEY_DROP_TRIGGER_TYPE,
  KEY_DROP_WIDTH,
  KEY_PRESSED_TEXT_STYLE,
  MUSIC_KEYS,
  MUSIC_KEYS_TRIGGER_AREA,
  SPEED
} from "./constant.js";
import HoldingKey from "./holding-key.js";

class PianoGame {
  #app = new Application({ background: '#000', width: CANVAS_WIDTH, height: CANVAS_HEIGHT })
  #battleground = new Container()
  #keyDropsGraphic = new Graphics()
  #keyDropsTriggerAreaGraphics = new Graphics()

  #state

  /**
   * @type {Array<Array<KeyDrop>>}
   */
  #keyDrops = [] // suppose to be a two-dimensional array with 8 sub-arrays

  #gameStateText = new Text('New game', DEFAULT_TEXT_STYLE)
  #score = 0
  #scoreText = new Text('Score', DEFAULT_TEXT_STYLE)

  #holdingKeyMap = {}

  constructor() {
    // append all objects
    document.body.appendChild(this.#app.view)
    this.#app.stage.addChild(this.#battleground)
    this.#battleground.addChild(this.#keyDropsGraphic)
    this.#battleground.addChild(this.#keyDropsTriggerAreaGraphics)

    this.#app.stage.addChild(this.#gameStateText)
    this.#gameStateText.position.set(this.#app.screen.right - 88, this.#app.screen.top + 16)
    this.#app.stage.addChild(this.#scoreText)
    this.#scoreText.position.set(this.#app.screen.right - 88, this.#app.screen.top + 32)
    this.#renderKeysTriggerArea()

    this.#reset()

    this.#bindAllKeys()

    // start game loop
    this.#app.ticker.add((delta) => this.#gameLoop(delta))
  }

  #newGame(delta) {
  }

  #gameLoop(delta) {
    this.#state(delta)
    this.#updateStateText()
    this.#updateScoreText()
  }

  #pause(delta) {
  }

  #gameOver(delta) {
  }

  #addHoldingKey(col, keyDrop) {
    this.#holdingKeyMap[col] = new HoldingKey(keyDrop, () => {
      this.#score += 7
    })
  }

  #clearHoldingKey(col) {
    if (this.#holdingKeyMap[col]) {
      this.#holdingKeyMap[col].clear()
      this.#holdingKeyMap[col] = undefined
    }
  }

  #play(delta) {
    this.#keyDropsGraphic.clear()
    this.#keyDropsGraphic.beginFill(0xff0000)
    this.#keyDrops.forEach((keyDropsCol, col) => {
      keyDropsCol.forEach((kd, i) => {
        kd.y += SPEED
        if (kd.top < this.#app.screen.bottom && !kd.triggered) {
          this.#keyDropsGraphic.drawShape(kd)
        } else {
          this.#clearHoldingKey(col)
          keyDropsCol.splice(i ,1)
        }
      })
    })
    this.#keyDropsGraphic.endFill()

    let hasKeyLeft = false
    this.#keyDrops.forEach(keyDropsCol => {
      if (keyDropsCol.length) {
        hasKeyLeft = true
      }
    })
    if (!hasKeyLeft) {
      this.#state = this.#gameOver
    }
  }

  #reset() {
    this.#state = this.#newGame
    this.#keyDrops = SONG.map((colTimes, col) => {
      return colTimes.map(time => new KeyDrop(time, col, this.#app.screen.width, this.#app.screen.height))
    })
    this.#keyDropsGraphic.clear()
    this.#keyDropsGraphic.beginFill(0xff0000)
    this.#keyDrops.forEach(keyDropsCol => {
      keyDropsCol.forEach(kd => this.#keyDropsGraphic.drawShape(kd))
    })
    this.#keyDropsGraphic.endFill()
    this.#score = 0
  }

  #bindAllKeys() {
    MUSIC_KEYS.forEach(mk => {
      const k = keyboard(mk.keyCode)
      k.press = () => this.#musicKeyPressed(mk.col)
      k.release = () => this.#musicKeyReleased(mk.col)
    })

    const enter = keyboard('Enter')
    enter.release = () => {
      if (this.#state === this.#newGame || this.#state === this.#pause) {
        this.#state = this.#play
      } else if (this.#state === this.#play) {
        this.#state = this.#pause
      }
    }

    const r = keyboard('r')
    r.release = () => {
      if (this.#state === this.#pause || this.#state === this.#gameOver) {
        this.#reset()
      }
    }
  }

  #musicKeyPressed(col) {
    if (this.#state === this.#play) {
      const keyDropsByCol = this.#keyDrops[col]
      const nextKeyDrop = keyDropsByCol[0]
      if (nextKeyDrop) {
        const intersection = Math.abs(this.#app.screen.bottom - nextKeyDrop.bottom) // closer to 0 means better, 0 = perfect
        switch (nextKeyDrop.triggerType) {
          case KEY_DROP_TRIGGER_TYPE.Instant:
            if (intersection <= BOTTOM_OFFSET) {
              nextKeyDrop.triggered = true
              if (intersection <= (BOTTOM_OFFSET * 0.33)) {
                this.#addText('excellent', nextKeyDrop.right, this.#app.screen.bottom - BOTTOM_OFFSET)
                this.#score += 92
              } else if (intersection <= (KEY_DROP_HEIGHT * 0.66)) {
                this.#addText('decent', nextKeyDrop.right, this.#app.screen.bottom - BOTTOM_OFFSET)
                this.#score += 50
              } else if (intersection <= KEY_DROP_HEIGHT) {
                this.#addText('good', nextKeyDrop.right, this.#app.screen.bottom - BOTTOM_OFFSET)
                this.#score += 28
              }
            }
            break
          case KEY_DROP_TRIGGER_TYPE.Holding:
            if (intersection <= BOTTOM_OFFSET) {
              this.#addText('hold!', nextKeyDrop.right, this.#app.screen.bottom - BOTTOM_OFFSET)
              this.#addHoldingKey(col, nextKeyDrop)
            }
            break
        }

      }
    }
  }

  #musicKeyReleased(col) {
    if (this.#state === this.#play) {
      this.#clearHoldingKey(col)
    }
  }

  #addText(text, x, y) {
    const richText = new Text(text, KEY_PRESSED_TEXT_STYLE)
    richText.x = x
    richText.y = y

    this.#app.stage.addChild(richText)

    setTimeout(() => {
      richText.destroy()
    }, 700)
  }

  #updateStateText() {
    let gameStateText = 'New game'
    if (this.#state === this.#pause) {
      gameStateText = `Paused`
    } else if (this.#state === this.#gameOver) {
      gameStateText = `Game over`
    } else if (this.#state === this.#play) {
      gameStateText = `Playing`
    }
    this.#gameStateText.text = gameStateText
  }

  #updateScoreText() {
    this.#scoreText.text = `Score: ${Math.ceil(this.#score)}`
  }

  #renderKeysTriggerArea() {
    const areas = MUSIC_KEYS_TRIGGER_AREA.map((colTimes, col) => {
      return colTimes.map(time => new KeyDrop(time, col, this.#app.screen.width, this.#app.screen.height))
    })
    this.#keyDropsTriggerAreaGraphics.clear()
    this.#keyDropsTriggerAreaGraphics.lineStyle(1, 0xffffff, 1)
    areas.forEach((keyDropsCol, index) => {
      // draw trigger area shape
      keyDropsCol.forEach(kd => {
        this.#keyDropsTriggerAreaGraphics.drawShape(kd)
      })

      // draw trigger area key text
      const keyText = new Text(MUSIC_KEYS.find(mk => mk.col === index).label, DEFAULT_TEXT_STYLE)
      const textX = keyDropsCol[0].x + (KEY_DROP_WIDTH - 4) / 2
      const textY = keyDropsCol[0].y + (KEY_DROP_HEIGHT - 8) / 2
      keyText.position.set(textX, textY)
      this.#app.stage.addChild(keyText)
    })
    this.#keyDropsTriggerAreaGraphics.endFill()
  }

}

export default PianoGame
