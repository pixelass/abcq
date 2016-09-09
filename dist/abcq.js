(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

window.abcQ = _2.default;

},{"./":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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
var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

var abcQ = function () {
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
  function abcQ() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, abcQ);

    /**
     * The default config is used as a fallback if options
     * were missing
     * @private
     * @type {Object}
     * @property {String} chars Defults to all uppercase and lowercase characters of the alphabet
     * @property {Number} counter Defults to `-1`
     */
    var defaults = {
      chars: alphabet,
      counter: -1
    };
    /**
     * The defaults extended by the options.
     * @private
     * @type {Object}
     */
    this.options = Object.assign(defaults, options);
    /**
     * The list of characters to combine. It can be an `Array` or a `String`.
     * If the list contains special characters, emojis or similar it should be
     * an `Array`.
     * @type {String|Array}
     * @private
     */
    this.chars = this.options.chars;
    /**
     * initial value for the counter. Cannot be lower than `-1`
     * @type {Number}
     * @private
     */
    this.counter = this.options.counter;
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

  _createClass(abcQ, [{
    key: 'generate',
    value: function generate() {
      return this.charsAt(++this.counter);
    }

    /**
     * Method to cenvert a number into a combination of characters
     *
     * This method does not affect any other method. This method can be called multiple times before
     * calling `generate`
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

  }, {
    key: 'charsAt',
    value: function charsAt(i) {
      /*
       * check if the number is smaller than 0.
       * Then return `null` or continue
       */
      if (i < 0) {
        return null;
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
      var nextSlot = ~~(i / this.chars.length);

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
      var previousSlots = nextSlot ? this.charsAt(nextSlot - 1) : '';
      /* convert the current slot */
      var currentSlot = this.chars[i % this.chars.length];
      return previousSlots + currentSlot;
    }
  }]);

  return abcQ;
}();

exports.default = abcQ;

},{}]},{},[1]);
