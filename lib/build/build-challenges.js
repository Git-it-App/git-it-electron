/*
 * Runs in: Node - Build Application
 * This file builds out the challenge web pages. A simple static site
 * generator. It uses `partials` and `layouts`.
 */
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const { getLocaleMenu, getCspHashes } = require('./build-helpers.js')

const basepath = path.normalize(path.join(__dirname, '../..'))
const inputFolder = path.join(basepath, 'resources', 'content', 'challenges')
const outputFolder = path.join(basepath, 'built', 'challenges')
const partialsFolder = path.join(basepath, 'resources', 'content', 'partials')

const challengeFiles = fs.readdirSync(inputFolder)
const allChallenges = getAllChallengesArray()
const layout = fs.readFileSync(path.join(basepath, 'resources', 'layouts', 'challenge.hbs')).toString()
const layoutTemplate = Handlebars.compile(layout)
const partialTemplates = getPartialTemplates()
const partialButtons = getPartialButtons()

const cspUsedFiles = [
  'lib/challenge-sidebar-handler.js',
  // 'lib/challenge-verify-handler.js',
  // 'lib/i18n-translate.js',
  // 'lib/handle-external-links.js'
]
const csp = getCspHashes(cspUsedFiles)

// If output-folder does not exist, create it
try {
  fs.accessSync(outputFolder)
} catch (e) {
  fs.mkdirSync(outputFolder, { recursive: true })
}

// Process challenge-files one by one
challengeFiles.forEach(filename => {
  // Only process '.hbs' files
  if (!filename.match('[.]hbs')) {
    console.log('Non-HBS file found!', filename)
    return
  }

  const content = {
    csp,
    header: buildHeader(filename),
    footer: buildFooter(filename),
    sidebar: buildSidebar(filename),
    body: buildBody(filename),
    shortName: makeShortName(filename)
  }
  const builtContent = layoutTemplate(content)
  fs.writeFileSync(path.join(outputFolder, content.shortName + '.html'), builtContent)
})
console.log('Built challenges!')

/*
 * Function to get Header
 */
function buildHeader (filename) {
  const pageTitle = makeTitleName(filename)

  const content = {
    pageTitle,
    localeMenu: new Handlebars.SafeString(getLocaleMenu())
  }
  return partialTemplates.header(content)
}

/*
 * Function to get Footer
 */
function buildFooter (filename) {
  const challengeNumber = filename.split('_')[0]
  const nearbyChallenges = getNearbyChallenges(challengeNumber)

  // No further content necessary apart from nearby Challenges
  return partialTemplates.chalFooter(nearbyChallenges)
}

/*
 * Get the sidebar-content
 */
function buildSidebar (filename) {
  const challengeNumber = parseInt(filename.split('_')[0])

  // Update currentChallenge-value
  allChallenges.forEach((challenge, index) => {
    allChallenges[index].currentChallenge = challenge.challengeNumber === challengeNumber
  })

  const content = {
    allChallenges
  }
  return partialTemplates.chalSidebar(content)
}

/*
 * Get the body content
 */
function buildBody (filename) {
  const source = fs.readFileSync(path.join(inputFolder, filename)).toString()
  const bodyTemplate = Handlebars.compile(source)

  // Only buttons are necessary
  return bodyTemplate(partialButtons)
}

/*
 * Search for previous and next challenge and return their name and url
 */
function getNearbyChallenges (challengeNumber) {
  const previousNumber = parseInt(challengeNumber, 10) - 1
  const nextNumber = parseInt(challengeNumber, 10) + 1
  let previousUrl = ''
  let previousName = ''
  let nextUrl = ''
  let nextName = ''

  if (previousNumber === 0) {
    previousName = 'All Challenges'
    previousUrl = path.join('../', 'pages', 'index.html')
  }

  if (nextNumber === 12) {
    nextName = 'Done!'
    nextUrl = path.join('../', 'pages', 'index.html')
  }

  challengeFiles.forEach(filename => {
    if (filename.startsWith(previousNumber.toString())) {
      previousName = makeTitleName(filename)
      previousUrl = makeShortName(filename) + '.html'
    }

    if (filename.startsWith(nextNumber.toString())) {
      nextName = makeTitleName(filename)
      nextUrl = makeShortName(filename) + '.html'
    }
  })

  return {
    previousName,
    previousUrl,
    nextName,
    nextUrl
  }
}

/*
 * Shorten Filename
 * Before: 10_merge_tada.hbs
 * After: merge_tada
 */
function makeShortName (filename) {
  return filename.split('/').pop().split('_')
    .slice(1).join('_').replace('hbs', '').replace('.', '')
}

/*
 * Create Challenge Title out of filename
 */
function makeTitleName (filename) {
  const shortName = makeShortName(filename).split('_').join(' ')
  return grammarize(shortName)
}

/*
 * Grammarize Challenge Name String
 */
function grammarize (name) {
  const wrongWords = ['arent', 'githubbin', 'its']
  const rightWords = ["aren't", 'GitHubbin', "it's"]
  let correctedName = name

  // Correct listed terms
  wrongWords.forEach((word, i) => {
    if (name.match(word)) {
      correctedName = name.replace(word, rightWords[i])
    }
  })

  // First Char to upper case
  correctedName = correctedName.charAt(0).toUpperCase() + correctedName.substr(1)

  return correctedName
}

/*
 * Array of Challenges for Sidebar
 * Done here to only compute once on build
 */
function getAllChallengesArray () {
  const allChallenges = challengeFiles.map(mapFilename => {
    return {
      challengeNumber: parseInt(mapFilename.split('_')[0]),
      shortName: makeShortName(mapFilename),
      titleName: makeTitleName(mapFilename),
      currentChallenge: false
    }
  })
  allChallenges.sort((a, b) => {
    // Simply use difference of challengeNumber to sort with <=>0
    return (a.challengeNumber - b.challengeNumber)
  })

  return allChallenges
}

/*
 * Load and compile partial templates once on build
 */
function getPartialTemplates () {
  return {
    header: Handlebars.compile(fs.readFileSync(path.join(partialsFolder, 'header.hbs')).toString().trim()),
    chalFooter: Handlebars.compile(fs.readFileSync(path.join(partialsFolder, 'chal-footer.hbs')).toString().trim()),
    chalSidebar: Handlebars.compile(fs.readFileSync(path.join(partialsFolder, 'chal-sidebar.hbs')).toString().trim())
  }
}

/*
 * Load partial-buttons once on build
 */
function getPartialButtons () {
  return {
    verify_button: fs.readFileSync(path.join(partialsFolder, 'verify-button.hbs')).toString().trim(),
    verify_directory_button: fs.readFileSync(path.join(partialsFolder, 'verify-directory-button.hbs')).toString().trim()
  }
}
