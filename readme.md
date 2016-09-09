# abcq

Generates character combinations from numbers: `a b c ... aa ab ac ... foo fop foq`

[Documentation](https://pixelass.github.io/abcq/)

[![npm](https://img.shields.io/npm/v/abcq.svg)](https://www.npmjs.com/package/abcq)
[![GitHub license](https://img.shields.io/github/license/pixelass/abcq.svg)](https://github.com/pixelass/abcq/blob/master/LICENSE)
[![Travis](https://img.shields.io/travis/pixelass/abcq.svg)](https://travis-ci.org/pixelass/abcq)
[![David](https://img.shields.io/david/pixelass/abcq.svg)](https://david-dm.org/pixelass/abcq)
[![David](https://img.shields.io/david/dev/pixelass/abcq.svg)](https://david-dm.org/pixelass/abcq#info=devDependencies&view=table)
[![GitHub issues](https://img.shields.io/github/issues/pixelass/abcq.svg)](https://github.com/pixelass/abcq/issues)
[![GitHub forks](https://img.shields.io/github/forks/pixelass/abcq.svg)](https://github.com/pixelass/abcq/network)
[![GitHub stars](https://img.shields.io/github/stars/pixelass/abcq.svg)](https://github.com/pixelass/abcq/stargazers)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


* Convert numbers to character combinations.
* Count by character combination
* Create unique ids
* Create simple hashes

```shell
npm i abcq
```

## Basic usage

```js
const shortid = new abcQ()

shortid.generate()
// -> a
shortid.generate()
// -> b
shortid.charsAt(1234567890)
// -> clRjXk
```

## When unicorns make love

Use an `Array` for `chars` if it contains special characters.
Set the counter to modify the start point

```js
const unicornLove = new abcQ({
  chars: ['🦄','💖'],
  counter: 42
})

unicornLove.generate()
// -> 🦄💖💖🦄💖
unicornLove.charsAt(8)
// -> 🦄💖🦄
```

## Use with cssmodules (+ browserify)

```js
const browserify = require('browserify')
const cssModulesify = require('css-modulesify')
const abcQ = require('abcq')

function generator() {
  const shortid = new abcQ()
  this.names = {}
  return (name, file) => {
    const obj = this.names[file] || {}
    if (!(name in obj)) {
      obj[name] = shortid.generate()
    }
    this.names[file] = obj
    return obj[name]
  }
}

const entries = 'index.js'
const output = 'style.css'
const generateScopedName = new generator()

const b = browserify({entries})
b.plugin(cssModulesify, {output, generateScopedName})
```

## Options

### `chars`
* type: { Array | String }
* default: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

### `counter`
* type: { Number }
* default: -1

## Methods

### `generate`

```js
const abc = new abcQ()
abc.generate()
// -> a
abc.generate()
// -> b
```

### `charsAt`

```js
const abc = new abcQ()
abc.charsAt(1234567890)
// -> clRjXk
```
