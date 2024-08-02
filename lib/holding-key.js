class HoldingKey {
  /**
   * @type KeyDrop
   */
  #keyDrop

  #timer

  constructor(keyDrop, tickingCb) {
    this.#keyDrop = keyDrop
    this.#timer = setInterval(() => {
      tickingCb()
    }, 500)
  }

  get keyDrop() {
    return this.#keyDrop
  }

  set keyDrop(value) {
    this.#keyDrop = value
  }

  get timer() {
    return this.#timer
  }

  set timer(value) {
    this.#timer = value
  }

  clear() {
    this.keyDrop = undefined
    clearInterval(this.#timer)
  }
}

export default HoldingKey
