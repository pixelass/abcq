/**
 * @file index.js
 * @module abcQ
 * @overview Number to character combination coverter
 *
 * @author Gregor Adams <greg@pixelass.com>
 * @licence The MIT License (MIT) - See file 'LICENSE' in this project.
 */

/**
 * all lowercase and uppercase letters of the alphabet.
 * Does not include special characters, numbers, puctuation or similar
 * @type {String}
 */
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

class abcQ {
  /**
   * [constructor description]
   * @param  {Object} [options={}] Set options to configure the output when
   *                               generating ids or converting numbers
   * @param  {String|Array} options.chars The list of characters to combine. It can be an `Array`
   *                                      or a `String`. If the list contains special characters,
   *                                      emojis or similar it should be an `Array`.
   * @param  {Number} options.counter The counter can be initialized with this value. If you want
   *                                  to start with some longer names try setting `counter: 100000`.
   *                                   The default value is set to `-1` any lower value will return `null`
   * @return {this} returns an instance of itself
   * @example
   * const unicornLove = new abcQ({
   *   chars: ['🦄','💖'],
   *   counter: 42
   * })
   */
  constructor (options = {}) {
    /**
     * The default config is used as a fallback if options
     * were missing
     * @private
     * @type {Object}
     * @property {String} chars Defults to all uppercase and lowercase characters of the alphabet
     * @property {Number} counter Defults to `-1`
     */
    const defaults = {
      chars: alphabet,
      counter: -1
    }
    /**
     * The defaults extended by the options.
     * @private
     * @type {Object}
     */
    this.options = Object.assign(defaults, options)
    /**
     * The list of characters to combine. It can be an `Array` or a `String`.
     * If the list contains special characters, emojis or similar it should be
     * an `Array`.
     * @type {String|Array}
     * @private
     */
    this.chars = this.options.chars
    /**
     * initial value for the counter. Cannot be lower than `-1`
     * @type {Number}
     * @private
     */
    this.counter = this.options.counter
    /**
     * Object to store already generated combinations.
     * If a this object contains a requested value it will be returned
     * instead of canverting it again
     * @type {Object}
     * @private
     */
    this.storage = {}
  }

  /**
   * Method to generate the next string.
   *
   * This method is not affected by calling other methods.
   * It will always return the next combination of characters
   *
   * @return {String} Returns the next character combination
   * @example
   * const shortid = new abcQ({
   *   chars: 'ab'
   * })
   * let counter = 0
   * do {
   *   console.log(shortid.generate())
   * } while (++counter < 10)
   * // -> a b aa ab ba bb aaa aab aba abb
   */
  generate () {
    return this.charsAt(++this.counter)
  }

  /**
   * Method to cenvert a number into a combination of characters
   *
   * This method does not affect any other method. This method can be called multiple times before
   * calling `generate`
   * Only converts a number when requested the first time. If the number
   * has been converted before it will be taken from the storage.
   *
   * @param  {Number} i A number greater than `-1`. Given a list of `"ab"
   *                  the following will  be returned
   *                  - 0 -> "a"
   *                  - 1 -> "b"
   *                  - 2 -> "aa"
   *                  - 3 -> "ab"
   *                  - ...
   * @return {String} Returns the character combination of the number
    * @example
   * const shortid = new abcQ({
   *   chars: 'ab'
   * })
   * console.log(shortid.charAt(0))
   * // -> "a"
   * console.log(shortid.charAt(9))
   * // -> "abb"
   * console.log(shortid.generate())
   * // -> "a"
   * console.log(shortid.generate())
   * // -> "b"
   */
  charsAt (i) {
    /*
     * check if the number is smaller than 0.
     * Then return `null` or check if the number has been generated before.
     * Then return the number from the storage or continue
     */
    if (i < 0) {
      return null
    }
    /*
     * Check for the next slot. A slot is generated when the number in the
     * current slot is greater than the number of characters in the list.
     * If a slot is `0` it will not be counted. Instead the value is used as a flag
     * This means the fist slot has a `0`-based index while the next slots are `1`-based
     * ### Example
     * - 'ab': 1; `slots = [1,0]  -> "b"`
     * - 'ab': 2; `slots = [2,1]   -> "aa"`
     * - 'ab': 9; `slots = [9,5,3] -> "abb"`
     */
    const nextSlot = ~~(i / this.chars.length)

    /*
     * Combine all previous slots.
     * @todo refactor to `do` when jsdoc supports it
     * @example
     * const previousSlots = do {
     *   if (nextSlot > 0) {
     *     this.charsAt(nextSlot)
     *   } else {
     *     ''
     *   }
     * }
     */
    const previousSlots = nextSlot ? this.charsAt(nextSlot - 1) : ''
    /* add the current slot */
    const currentSlot = this.chars[i % this.chars.length]
    const combination = previousSlots + currentSlot

    /*
     * Save the value for faster usage when needed again.
     * Then return the combination
     */
    this.storage[i] = combination
    return combination
  }
}

export default abcQ
