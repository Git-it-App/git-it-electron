# Changelog

## Version 5.2.0 (2021-04-15)
### Enhancements
- Translateable images ([#185](https://github.com/Git-it-App/git-it-electron/pull/185))

### Fixes
- Fix branching description ([#221](https://github.com/Git-it-App/git-it-electron/pull/200))
- Small Readme Changes ([#200](https://github.com/Git-it-App/git-it-electron/pull/200))
- Small Text changes ([#186](https://github.com/Git-it-App/git-it-electron/pull/186))
- Translation updates
- Dependency updates


## Version 5.1.1 (2020-12-18)
### Fixes
- Show better error if no username configured ([#179](https://github.com/Git-it-App/git-it-electron/pull/179))
- Fix image sizes ([#177](https://github.com/Git-it-App/git-it-electron/pull/177))
- Slightly enlarge default window ([#176](https://github.com/Git-it-App/git-it-electron/pull/176))
- Fix translation insertion ([#175](https://github.com/Git-it-App/git-it-electron/pull/175))
- Refactor CSS using sass - slight UI changes ([#171](https://github.com/Git-it-App/git-it-electron/pull/171))
- Don't enable verify, if selectedDir is empty ([#165](https://github.com/Git-it-App/git-it-electron/pull/165))
- Fix Build-Badge ([#159](https://github.com/Git-it-App/git-it-electron/pull/159))
- Move to Github Actions ([#158](https://github.com/Git-it-App/git-it-electron/pull/158))
- Move ipc-Handlers from main to specific file ([#157](https://github.com/Git-it-App/git-it-electron/pull/157))
- Updated dependencies


## Version 5.1.0 (2020-11-04)
### Enhancements
- Supporting Right-to-Left languages now ([#152](https://github.com/Git-it-App/git-it-electron/pull/152)) (Thanks, [@akamfoad](https://github.com/akamfoad) for your support here!)
- New, complete Kurdish Translation! (Thanks, [@akamfoad](https://github.com/akamfoad)!)
- Storing Verify-Results, so beeing able to reload and translate them afterwards ([#119](https://github.com/Git-it-App/git-it-electron/pull/119))
- Store separate Verify-Directories where different ([#114](https://github.com/Git-it-App/git-it-electron/pull/114))
- Moved the repository to the new Git-it-App Organisation ([#112](https://github.com/Git-it-App/git-it-electron/pull/112))
- Removed portable Git, on Windows now using System-Git, too. ([#108](https://github.com/Git-it-App/git-it-electron/pull/108))
- Some large Code-Cleanup ([#99](https://github.com/Git-it-App/git-it-electron/pull/99))

### Fixes
- Update Spinkit and fix spinner ([#156](https://github.com/Git-it-App/git-it-electron/pull/156))
- Build index like other page-files ([#155](https://github.com/Git-it-App/git-it-electron/pull/155))
- Moving currentChallenge to Header-Meta ([#113](https://github.com/Git-it-App/git-it-electron/pull/113))
- Clarify Handlebars-Files by changing file-extensions ([#109](https://github.com/Git-it-App/git-it-electron/pull/109))
- Updated link to interactive Tutorial ([#103](https://github.com/Git-it-App/git-it-electron/pull/103))
- Translation updates (Thanks, [@Ther3tyle](https://github.com/Ther3tyle)(Korean)!)
- Updated dependencies


## Version 5.0.0 (2020-09-23)
**Most interesting changes since v4.4.0:**
### Enhancements
- New Polish translation! (Thanks, [@JachuPL](https://github.com/JachuPL)!) ([#83](https://github.com/Git-it-App/git-it-electron/pull/83))
- New German translation!
- Moved translations from separate files to i18next and Transifex, making it possible to track and translate content-changes ([#13](https://github.com/Git-it-App/git-it-electron/pull/13))
- New link to a nice GUI-overview [jlord/#257](https://github.com/jlord/git-it-electron/pull/257)

### Fixes
- Fixed path to GitHub collaborator-settings ([#87](https://github.com/Git-it-App/git-it-electron/pull/87))
- Fix: Changed Git-installation to pure Git without GitHub-Desktop ([#76](https://github.com/Git-it-App/git-it-electron/pull/76))
- Cleaned up build, removed unused files ([#75](https://github.com/Git-it-App/git-it-electron/pull/75))
- Fixed challenge-verifications, replaced deprecated request with axios ([#9](https://github.com/Git-it-App/git-it-electron/pull/9))
- Fixed js-error on repository-link ([#5](https://github.com/Git-it-App/git-it-electron/pull/5))
- Fixed standard-linting ([#4](https://github.com/Git-it-App/git-it-electron/pull/4))
- Bumped **all dependencies**, and especially:
    - Electron from v1.4.3 to v10.1.1
    - Electron-Packager from v8.0.0 to v15.1.0
    - Handlebars from v3.0.3 to v4.7.6
    - Standard from v5.4.1 to v14.3.4
    - Security-audit fixes
    - Fixed corresponding breaking changes
