/**
 * @file index.js
 * @module abcQ
 * @overview Number / character combination encoder / decoder
 *
 * @author Gregor Adams <greg@pixelass.com>
 * @licence The MIT License (MIT) - See file 'LICENSE' in this project.
 */

declare namespace Abcq {
	type String = string;
	type Number = number;
	type Characters = string | string[];
	type generate = () => String;
	type encode = (input: Number) => String | null;
	type decode = (input: String) => Number | null;
	interface Options {
		chars?: Characters;
		counter?: Number;
	}
	interface Config {
		chars: Characters;
		counter: Number;
	}
}

/**
 * all lowercase and uppercase letters of the alphabet.
 * Does not include special characters, numbers, puctuation or similar
 * @type {String}
 * @private
 */
const alphabet: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

class Abcq {
	private readonly chars: string | string[];
	private counter: Abcq.Number;
	/**
	 * [constructor description]
	 * @param  {Abcq.Options} [options={}]
	 * Set options to configure the output when generating ids or converting numbers
	 * @param  {Abcq.Characters} options.chars
	 * The list of characters to combine. It can be an `Array`  or a `String`.
	 * If the list contains special characters, emojis or similar it should be
	 * an `Array`.
	 * @param  {Abcq.Number} options.counter
	 * The counter can be initialized with this value. If you want to start with
	 * some longer names try setting `counter: 100000`.The default value is set
	 * to `-1` any lower value will return `null`
	 * @return {Abcq}
	 * returns an instance of itself
	 * @example
	 * const unicornLove = new abcQ({
	 *   chars: ['🦄','💖'],
	 *   counter: 42
	 * })
	 */
	public constructor(options: Abcq.Options = {}) {
		/**
		 * The default config is used as a fallback if options
		 * were missing
		 * @private
		 * @type {Abcq.Config}
		 * @property {Abcq.Characters} chars Defults to all uppercase and lowercase characters of the alphabet
		 * @property {Abcq.Number} counter Defults to `-1`
		 */
		const config: Abcq.Config = {
			chars: alphabet,
			counter: -1,
			...options
		};

		/**
		 * The list of characters to combine. It can be an `Array` or a `String`.
		 * If the list contains special characters, emojis or similar it should be
		 * an `Array`.
		 * @type {Abcq.Characters}
		 * @private
		 */
		this.chars = config.chars;
		/**
		 * initial value for the counter. Cannot be lower than `-1`
		 * @type {number}
		 * @private
		 */
		this.counter = config.counter;
	}

	/**
	 * Method to generate the next string.
	 *
	 * This method is not affected by calling other methods.
	 * It will always return the next combination of characters
	 *
	 * @return {Abcq.String}
	 * Returns the next character combination
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
	public generate: Abcq.generate = () => this.encode(++this.counter);

	/**
	 * Method to encode a number into a combination of characters
	 *
	 * This method does not affect any other method.
	 * This method can be called multiple times before calling `generate`
	 *
	 * @param  {Abcq.Number} i
	 * A number greater than `-1`. Given a list of `"ab" the following will  be returned:
	 *
	 * - 0 -> "a"
	 * - 1 -> "b"
	 * - 2 -> "aa"
	 * - 3 -> "ab"
	 * - ...
	 * @return {Abcq.String}
	 * Returns the character combination of the number
	 * @example
	 * const shortid = new abcQ({
	 *   chars: 'ab'
	 * })
	 * console.log(shortid.encode(0))
	 * // -> "a"
	 * console.log(shortid.encode(9))
	 * // -> "abb"
	 */
	public encode: Abcq.encode = (i: Abcq.Number) => {
		/*
		 * Check if the number is smaller than 0.
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
		 * - 'ab': 1; `slots = [1, 0]    -> "b"`
		 * - 'ab': 2; `slots = [2, 1]    -> "aa"`
		 * - 'ab': 9; `slots = [9 ,5, 2] -> "abb"`
		 */
		const nextSlot: number = ~~(i / this.chars.length);

		/* Combine and return all slots. */
		const previousSlots: string = nextSlot ? this.encode(nextSlot - 1) : "";
		const currentSlot: string = this.chars[i % this.chars.length];
		return `${previousSlots}${currentSlot}` as Abcq.String;
	};

	/**
	 * Method to decode a combination of characters into a number
	 *
	 * This method does not affect any other method.
	 * This method can be called multiple times before calling `generate`
	 *
	 * @param  {Abcq.String} str
	 * Character combination to decode. Must contain only valid characters, Given a list of `"ab" the following will
	 * be returned
	 *  - "a"  -> 0
	 *  - "b"  -> 1
	 *  - "aa" -> 2
	 *  - "ab" -> 3
	 *  - ...
	 * @return {Abcq.Number}
	 * Returns the index of the input string
	 * @example
	 * const shortid = new abcQ({
	 *   chars: 'ab'
	 * })
	 * console.log(shortid.decode('a'))
	 * // -> o
	 * console.log(shortid.decode('abb'))
	 * // -> 9
	 */
	public decode: Abcq.decode = (str: string) => {
		/*
		 * Check if the string contains invalid characters.
		 * Then return `null` or continue
		 */
		if (str.replace(new RegExp(`[${this.chars}]`, "g"), "") !== "") {
			return null;
		}

		/* Build the index for the given string */
		let i = 0;
		let counter = str.length;
		/* For every slot add the result.
		 * Adds all slots to return a `1`-based index
		 */
		while (counter--) {
			const pow = Math.pow(this.chars.length, str.length - 1 - counter);
			i += (this.chars.indexOf(str[counter]) + 1) * pow;
		}
		/* Subtract `1` to switch back to a `0`-based index */
		return i - 1;
	};
}

export default Abcq;
