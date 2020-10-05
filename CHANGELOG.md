# Changelog

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
