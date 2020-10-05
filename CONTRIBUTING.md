# Contributing to Git-it

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Contributions are more than welcome! Checkout e.g. the [good first issue](https://github.com/Git-it-App/git-it-electron/labels/good%20first%20issue) label for ideas!

---

**📣 Provide a description in your Issue/Pull Request.** In your pull request please explain what the problem was (with gifs or screenshots would be fantastic!) and how your changes fix it. 

🚫 🙀 :fire: _No description provided._ :fire: 🙀 🚫

---

**Code style is [JS Standard](http://standardjs.com) and no ES6 syntax** :tada: but open to relevant new methods.
Best run `npm run test` after you're done with your changes, to see if there is an error in the syntax.

Changes to the content of the pages must be made in the `resources/content` directory. For more information on how the app works, **see the [documentation](docs.md)**.

## Building Locally

If you want to build this locally you'll need [Node.js](https://nodejs.org) on your computer. Then clone this repository, install dependencies and launch the app:

```bash
$ git clone https://github.com/Git-it-App/git-it-electron
$ cd git-it-electron
$ npm install
$ npm start
```

## Packaging for OS X, Windows or Linux

Here's how to create a Git-it executable for Windows, OS X and Linux. You'll need [Node.js](https://nodejs.org) on your computer and [Wine](https://www.winehq.org/) if you're packaging for Windows from a non Windows machine (more on this below).

#### Use Node.js 10

To package a release you'll need **at least Node.js version 10** on your computer.

To check your version of npm:

```bash
$ npm -v
```

### Clone and Install Dependencies

Clone this repository and install the dependencies:

```bash
$ git clone https://github.com/Git-it-App/git-it-electron
$ cd git-it-electron
$ npm install
```

### Package

If you have made any changes to the code or you just cloned this project from github,
you'll need to rebuild all of the challenges and/or pages.
If you haven't, skip to the next step!

```bash
$ npm run build-all
```

### OS X, Linux, Windows

Each generated folder is put in the `/out` directory.

```bash
$ npm run pack-mac
```

This will output the contents of the application to a folder at `../out/Git-it-darwin-x64`.

```bash
$ npm run pack-lin
```

This will output the contents of the application to a folder at `../out/Git-it-linux-x64`.
```bash
$ npm run pack-win
```

A note from `electron-packager`, the module we use to package these apps:

> **Building Windows apps from non-Windows platforms**

> Building an Electron app for the Windows platform with a custom icon requires
editing the `Electron.exe` file. Currently, electron-packager uses [node-rcedit](https://github.com/atom/node-rcedit)
to accomplish this. A Windows executable is bundled in that node package and
needs to be run in order for this functionality to work, so on non-Windows
platforms, [Wine](https://www.winehq.org/) needs to be installed. On OS X, it is
installable via [Homebrew](http://brew.sh/).

This will output the contents of the application to a folder at `../out/Git-it-win32-ia32`.

## Extract content changes
In case you changed some text within the english original content, don't forget to extract your changes. This will copy your stuff into the translation-files, so the content will be available on Transifex for translations.
```bash
npm run i18n:extract
```

## Translations to other languages

### Wrong or missing Translations
The [Git-it Project on Transifex](https://www.transifex.com/git-it/git-it-electron) is the place to manage our translations. Just login there (with your GitHub Account) and you'll be able to help improving and adding translations.

If you want to add a completely new language to this project, here are some steps you need to do:

### Add locale code
First, edit `config/i18next.config.js` and add your Language to the `appLanguages` Object. You can use any editor you like.

```bash
$ vim config/i18next.config.js
```

Before colon is your language code, it must look like '\<lang\>-\<location\>'. '\<lang\>' is your language, e.g. for German 'de' is the language code. '\<location\>' is your location code, e.g. for Germany 'DE' is the location code. If you don't know what your language/location code is, you can find it [here](http://www.lingoes.net/en/translator/langcode.htm).  
_The language code *MUST* be all lowercase, and location code *MUST* be all uppercase._

**Then best create a pull-request with your change, so i know about your plans.**

### Translate the content
The Content of git-it is translated using i18next, which parses the text into json-files. A simple way to track and manage these translations is to use [Transifex](https://www.transifex.com), which allows for free subscriptions to open-source projects like Git-it.
To translate the content into your language, head over to the [Git-it Project on Transifex](https://www.transifex.com/git-it/git-it-electron). It might be necessary to first request your language to be activated for our project, but once this is done, you can start translating. Once a resource is fully translated, Transifex will automatically push the content back to GitHub and with our next release you'll be live. :muscle::tada:
