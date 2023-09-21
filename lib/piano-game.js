import { Application, Container, Graphics, TextStyle, Text } from "pixi.js"
import keyboard from './keyboard'

class PianoGame {
    #_app
    #_battleground
    #_keyDrop

    #_state

    #_keyDropPositionY = 0
    #_keyDropTriggered = false

    constructor() {
        this.#_app = new Application({ background: '#000' })
        document.body.appendChild(this.#_app.view)

        this.#renderBattleground()
        this.#bindAllKeys()

        // set game state
        this.#_state = this.#play

        // start game loop
        this.#_app.ticker.add((delta) => this.#gameLoop(delta))
    }

    #gameLoop(delta) {
        // Update the current game state:
        this.#_state(delta)
    }

    #play(delta) {
        this.#_keyDrop.clear()
        if (this.#_keyDropPositionY < this.#_app.screen.bottom && !this.#_keyDropTriggered) {
            this.#_keyDropPositionY += 0.5
            this.#_keyDrop.beginFill(0xff0000).drawRect(0, this.#_keyDropPositionY, 88, 44).endFill()
        }
    }

    #renderBattleground() {
        this.#_battleground = new Container()
        this.#_app.stage.addChild(this.#_battleground)

        this.#_keyDrop = new Graphics()
        this.#_keyDrop.beginFill(0xff0000).drawRect(0, 0, 88, 44).endFill()
        this.#_battleground.addChild(this.#_keyDrop)
    }

    #bindAllKeys() {
        const h = keyboard('h')
        h.release = () => {
            /**
             * ------- 44 --------
             *        good
             * ------- 34 --------
             *        decent
             * ------- 26 --------
             *      excellent
             * ------- 18 --------
             *        decent
             * ------- 10 --------
             *        good
             * -------- 0 --------
             */
            const distance = this.#_app.screen.bottom - this.#_keyDropPositionY
            if (distance <= 44 && distance >= 0) {
                this.#_keyDropTriggered = true
                if (distance <= 34 && distance >= 10) {
                    if (distance <= 26 && distance >= 18) {
                        // excellent
                        this.#addText('excellent', 88, this.#_keyDropPositionY - 11)
                    } else {
                        // decent
                        this.#addText('decent', 88, this.#_keyDropPositionY - 11)
                    }
                } else {
                    // good
                    this.#addText('good', 88, this.#_keyDropPositionY - 11)
                }
            }
        }
    }

    #addText(text, x, y) {
        const style = new TextStyle({
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

        const richText = new Text(text, style)
        richText.x = x
        richText.y = y

        this.#_app.stage.addChild(richText)

        setTimeout(() => {
            richText.destroy()
        }, 1000)
    }
}

export default PianoGame