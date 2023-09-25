import { Rectangle } from "pixi.js";

const KEY_DROP_WIDTH = 88
const KEY_DROP_HEIGHT = 44

class KeyDrop extends Rectangle {
    #triggered = false

    constructor(x, y) {
        super(x, y, KEY_DROP_WIDTH, KEY_DROP_HEIGHT)
    }

    set triggered(value) {
        this.#triggered = value
    }

    get triggered() {
        return this.#triggered
    }
}

export default KeyDrop