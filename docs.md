# Documentation

How does this thing work? Below are general descriptions of directories and content. Inside of each file, comments describe what that file's job is.

## Directories & Files
- **assets** Project assets like css, fonts and images.
- **config** Containing config files, currently only for internationalisation.
- **lib** All the JavaScript files for the app.
    - **verify** The JavaScript files for each challenge that verify if the challenge is completed or not.
- **menus** The app's menu layout.
- **resources** Contains the Content-Resources
    - **content** The main Content of pages and challenges, which will then be compiled & bundled to the final html-files.
        - **challenges** Main content of the challenges to be used in generating the final full HTML for each challenge page
        - **pages** Main content of non-challenge pages to be used with a template to generate full HTML.
        - **partials** HTML bits that are shared between either challenges or non-challenges pages, to be used in order to generate full HTML for pages.
    - **i18n** The translation-json-files. Translations are managed on Transifex.
    - **layouts** Handlebars templates to compile pages.
- **tests** App's test files.
- **empty-data.json** The starter file that is duplicated and stored on the user's computer with their challenge completed statuses as they go through the lessons.
- **main.js** App's main process file which spins up the renderer view for the pages.
- **package.json** App's details and dependencies.

### Relationships
Files and directories are grouped by their relationship in the app. Electron apps have a main process, which controls the lifecycle of the app, and the browser process, which is each HTML page that is spun up by the main process.

**Main Process: Application Code**
`main.js` controls the life of the app (start, quit) and the browser windows that make up the main app experience (what HTML files to show and what size). It is the app's **main process**. The `lib` and `lib/verify` directories contain all the code that the browser views, the app's **browser process**, use. Some of these communicate with the main process by sending and receiving messages.

**Browser Process: Pages & Assets**
The pages that the app displays are HTML, just like a website. The `assets` directory contains the CSS, images and fonts used in each view. Each page is built with it's main content (`pages`) and drops that into a template (`layouts`) along with the shared HTML elements (`partials`) like headers and footers.

**Browser Process: Scripts**
The `lib` directory contains scripts that each page uses. Inside of `lib/verify` are scripts for each challenge that tell it how to verify that challenge. The scripts `helpers.js` and `user-data.js` are shared between scripts.

**Templating**
There are scripts, templates and partials involved with generating the HTML pages. The main content for the challenges and non-challenge pages are within `resources/content/challenges` and `resources/content/pages`. The directory `resources/layouts` contains the templates, `resources/partials` the partials that are combined with the main content files according to the template. The scripts `lib/build-page.js` and `lib/build-challenges.js` put it all in motion to generate the final HTML output which is placed inside a `built`-folder. You can run these scripts from the command line.
