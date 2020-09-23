/*
 * Runs in: Node - Build Application
 * This file builds out the general web pages (like the about page). A simple
 * static site generator. It uses `partials` and `layouts`.
 */
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const { getLocaleMenu } = require('./build-helpers.js')

const basepath = path.normalize(path.join(__dirname, '..'))
const inputFolder = path.join(basepath, 'resources', 'content', 'pages')
const outputFolder = path.join(basepath, 'built', 'pages')
const partialsFolder = path.join(basepath, 'resources', 'content', 'partials')

const pageFiles = fs.readdirSync(inputFolder)
const layout = fs.readFileSync(path.join(basepath, 'resources', 'layouts', 'page.hbs')).toString()
const layoutTemplate = Handlebars.compile(layout)

// If output-folder does not exist, create it
try {
  fs.accessSync(outputFolder)
} catch (e) {
  fs.mkdirSync(outputFolder, { recursive: true })
}

// Process page-files one by one.
pageFiles.forEach(filename => {
  let builtContent = ''

  // Only process '.html' files
  if (!filename.match('\\.html')) {
    console.log('Non-HTML file found!', filename)
    return
  }

  if (filename === 'index.html') {
    builtContent = buildIndex(filename)
  } else {
    const content = {
      header: buildHeader(filename),
      body: fs.readFileSync(path.join(inputFolder, filename)).toString()
    }
    builtContent = layoutTemplate(content)
  }
  fs.writeFileSync(path.join(outputFolder, filename), builtContent)
})
console.log('Built pages!')

/*
 * Function to get Header
 */
function buildHeader (filename) {
  const source = fs.readFileSync(path.join(partialsFolder, 'header.html')).toString()
  const template = Handlebars.compile(source)
  const content = {
    pageTitle: filename.replace(/.html/, ''),
    localeMenu: new Handlebars.SafeString(getLocaleMenu())
  }
  return template(content)
}

/*
 * Index is not processed within pages-template, but handled here separately.
 */
function buildIndex (filename) {
  const source = fs.readFileSync(path.join(inputFolder, filename)).toString()
  const template = Handlebars.compile(source)
  const content = {
    localemenu: new Handlebars.SafeString(getLocaleMenu())
  }
  return template(content)
}
