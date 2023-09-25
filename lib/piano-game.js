import { Application, Container, Graphics, TextStyle, Text } from "pixi.js"
import keyboard from './keyboard'
import KeyDrop from "./key-drop"

class PianoGame {
    #app
    #battleground
    #keyDropsGraphic

    #state

    #keyDrops = []

    constructor() {
        this.#app = new Application({ background: '#000' })
        document.body.appendChild(this.#app.view)

        this.#renderBattleground()
        this.#bindAllKeys()

        // start game loop
        this.#app.ticker.add((delta) => this.#gameLoop(delta))
    }

    #gameLoop(delta) {
        // Update the current game state:
        this.#state(delta)
    }

    #pause(delta) {
    }

    #gameOver(delta) {
    }

    #play(delta) {
        this.#keyDropsGraphic.clear()
        this.#keyDropsGraphic.beginFill(0xff0000)
        this.#keyDrops.forEach((kd, i) => {
            kd.y += 0.5
            if (kd.y < this.#app.screen.bottom && !kd.triggered) {
                this.#keyDropsGraphic.drawShape(kd)
            } else {
                this.#keyDrops.splice(i, 1)
            }
        })
        this.#keyDropsGraphic.endFill()

        if (!this.#keyDrops.length) {
            this.#state = this.#gameOver
        }
    }

    #reset() {
        this.#state = this.#pause
        this.#keyDrops = [new KeyDrop(0, 100), new KeyDrop(0, 0), new KeyDrop(0, -100)]

        this.#keyDropsGraphic.clear()
        this.#keyDropsGraphic.beginFill(0xff0000)
        this.#keyDrops.forEach(kd => this.#keyDropsGraphic.drawShape(kd))
        this.#keyDropsGraphic.endFill()
    }

    #renderBattleground() {
        this.#battleground = new Container()
        this.#app.stage.addChild(this.#battleground)
        this.#keyDropsGraphic = new Graphics()
        this.#battleground.addChild(this.#keyDropsGraphic)

        this.#reset()
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
            if (this.#state === this.#play) {
                const nextKeyDrop = this.#keyDrops[0]
                if (nextKeyDrop) {
                    const distance = this.#app.screen.bottom - nextKeyDrop.y
                    if (distance <= 44 && distance >= 0) {
                        nextKeyDrop.triggered = true
                        if (distance <= 34 && distance >= 10) {
                            if (distance <= 26 && distance >= 18) {
                                // excellent
                                this.#addText('excellent', 88, nextKeyDrop.y - 11)
                            } else {
                                // decent
                                this.#addText('decent', 88, nextKeyDrop.y - 11)
                            }
                        } else {
                            // good
                            this.#addText('good', 88, nextKeyDrop.y - 11)
                        }
                    }
                }
            }
        }
        
        const enter = keyboard('Enter')
        enter.release = () => {
            if (this.#state === this.#pause) {
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

        this.#app.stage.addChild(richText)

        setTimeout(() => {
            richText.destroy()
        }, 1000)
    }
}

export default PianoGame