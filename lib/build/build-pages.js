/*
 * Runs in: Node - Build Application
 * This file builds out the general web pages (like the about page). A simple
 * static site generator. It uses `partials` and `layouts`.
 */
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const { getLocaleMenu } = require('./build-helpers.js')

const basepath = path.normalize(path.join(__dirname, '../..'))
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

  // Only process '.hbs' files
  if (!filename.match('[.]hbs')) {
    console.log('Non-HBS file found!', filename)
    return
  }

  const content = {
    header: buildHeader(filename),
    body: fs.readFileSync(path.join(inputFolder, filename)).toString()
  }

  //Insert Script on index-page
  if (filename.match('index[.]hbs')) {
    content.script = '<script src="../../lib/index-challenge-handler.js"></script>'
  }

  builtContent = layoutTemplate(content)
  fs.writeFileSync(path.join(outputFolder, filename.replace('\.hbs', '\.html')), builtContent)
})
console.log('Built pages!')

/*
 * Function to get Header
 */
function buildHeader (filename) {
  const source = fs.readFileSync(path.join(partialsFolder, 'header.hbs')).toString()
  const template = Handlebars.compile(source)

  const content = {
    pageTitle: filename.replace('\.hbs', ''),
    localeMenu: new Handlebars.SafeString(getLocaleMenu())
  }
  // Index without specific page-title
  if (content.pageTitle === 'index') {
    delete content.pageTitle
  }

  return template(content)
}
