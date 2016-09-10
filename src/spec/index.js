/* global describe, it */

import {expect} from 'chai'
import ABCQ from '..'

describe('ABCQ', () => {
  it('should throw an error if called as a function', () => {
    expect(ABCQ).to.throw(Error)
    expect(ABCQ).to.throw(TypeError)
    expect(ABCQ).to.throw(TypeError, /Cannot call a class as a function/)
  })

  it('can have multiple instances', () => {
    const a1 = new ABCQ()
    const a2 = new ABCQ()
    const check1 = a1.generate()
    const check2 = a2.generate()
    expect(check1).to.equal(check2)
  })

  describe('generate', () => {
    const abc = new ABCQ()
    it('should start with "a"', () => {
      const check = abc.generate()
      expect(check).to.equal('a')
    })
    it('should continue with "b"', () => {
      const check = abc.generate()
      expect(check).to.equal('b')
    })
  })

  describe('encode', () => {
    const abc = new ABCQ()
    it('should encode 0 to "a"', () => {
      const check = abc.encode(0)
      expect(check).to.equal('a')
    })
    it('should encode 1 to "b"', () => {
      const check = abc.encode(1)
      expect(check).to.equal('b')
    })
    it('should encode 51 to "Z"', () => {
      const check = abc.encode(51)
      expect(check).to.equal('Z')
    })
    it('should encode 52 to "aa"', () => {
      const check = abc.encode(52)
      expect(check).to.equal('aa')
    })
    it('should encode 19854 to "gqQ"', () => {
      const check = abc.encode(19854)
      expect(check).to.equal('gqQ')
    })
    it('should return null for -1', () => {
      const check = abc.encode(-1)
      expect(check).to.equal(null)
    })
  })

  describe('decode', () => {
    const abc = new ABCQ()
    it('should decode "a" to 0', () => {
      const check = abc.decode('a')
      expect(check).to.equal(0)
    })
    it('should decode "b" to 1', () => {
      const check = abc.decode('b')
      expect(check).to.equal(1)
    })
    it('should decode "Z" to 51', () => {
      const check = abc.decode('Z')
      expect(check).to.equal(51)
    })
    it('should decode "aa" to 52', () => {
      const check = abc.decode('aa')
      expect(check).to.equal(52)
    })
    it('should decode "gqQ" to 19854', () => {
      const check = abc.decode('gqQ')
      expect(check).to.equal(19854)
    })
    it('should return null for "-"', () => {
      const check = abc.decode('-')
      expect(check).to.equal(null)
    })
    it('should return null for "_"', () => {
      const check = abc.decode('_')
      expect(check).to.equal(null)
    })
  })

  describe('options', () => {
    describe('chars', () => {
      const abc = new ABCQ({
        chars: 'ab'
      })
      it('should allow to set chars', () => {
        const check = abc.chars
        expect(check).to.equal('ab')
      })
      it('should decode "a" to 0', () => {
        const check = abc.decode('a')
        expect(check).to.equal(0)
      })
      it('should decode "b" to 1', () => {
        const check = abc.decode('b')
        expect(check).to.equal(1)
      })
      it('should decode "babab" to 51', () => {
        const check = abc.decode('babab')
        expect(check).to.equal(51)
      })
      it('should decode "babba" to 52', () => {
        const check = abc.decode('babba')
        expect(check).to.equal(52)
      })
      it('should decode "aabbabbaabaaaa" to 19854', () => {
        const check = abc.decode('aabbabbaabaaaa')
        expect(check).to.equal(19854)
      })
    })

    describe('counter', () => {
      const abc = new ABCQ({
        counter: 1
      })
      it('should allow to set the counter', () => {
        const check = abc.counter
        expect(check).to.equal(1)
      })
      it('should start generate at "c"', () => {
        const check = abc.generate()
        expect(check).to.equal('c')
      })
      it('should continue generate at "d"', () => {
        const check = abc.generate()
        expect(check).to.equal('d')
      })
      it('should encode 19854 to "gqQ"', () => {
        const check = abc.encode(19854)
        expect(check).to.equal('gqQ')
      })
      it('should decode "gqQ" to 19854', () => {
        const check = abc.decode('gqQ')
        expect(check).to.equal(19854)
      })
    })
  })
})
