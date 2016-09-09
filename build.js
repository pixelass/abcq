const fs = require('fs')
const Log = require('log')
const browserify = require('browserify')
const babelify = require('babelify')
const errorify = require('errorify')
const uglifyify = require('uglifyify')
const exec = require('child_process').exec

const log = new Log('info')


const fileMap = {
  'dist.js': 'abcq'
}

const files = Object.keys(fileMap)
const srcFolder = `${__dirname}/src`
const buildFolder = `${__dirname}/dist`


exec(`rm -rf ${buildFolder}`, (err) => {
  if (err) {
    throw error
  }
  fs.mkdir(buildFolder)
  files.forEach(file => {
    const inFile = `${srcFolder}/${file}`
    const outFile = `${buildFolder}/${fileMap[file]}`
    const b = browserify({
      entries: [inFile],
      plugin: [errorify]
    })
    const u = browserify({
      entries: [inFile],
      plugin: [errorify]
    })
    u.transform({
      global: true
    }, 'uglifyify')

    function bundle() {
      b.bundle().pipe(fs.createWriteStream(`${outFile}.js`))
      u.bundle().pipe(fs.createWriteStream(`${outFile}.min.js`))
    }

    b.on('log',  message => log.info(message))
    b.on('error',  message => log.error(message))
    u.on('log',  message => log.info(message))
    u.on('error',  message => log.error(message))
    bundle()
  })
})