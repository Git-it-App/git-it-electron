/*
 * Runs in: Node - Build Application
 * This file builds out the css using sass.
 */
const fs = require('fs')
const path = require('path')
const sass = require('sass')

const basepath = path.normalize(path.join(__dirname, '../..'))
const inputRootFile = path.join(basepath, 'assets', 'css', '__style_root.scss')
const outputFolder = path.join(basepath, 'built', 'styles')
const outputFile = path.join(outputFolder, 'style.css')

// If output-folder does not exist, create it
try {
  fs.accessSync(outputFolder)
} catch (e) {
  fs.mkdirSync(outputFolder, { recursive: true })
}

// Build css and write to file
const result = sass.compile(inputRootFile, {
  style: 'compressed',
})
fs.writeFileSync(outputFile, result.css)

console.log('Built styles!')
