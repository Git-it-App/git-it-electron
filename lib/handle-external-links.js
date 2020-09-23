/*
 * Runs in: Renderer-Process
 * This file is used by every web page to make sure all links that are not local
 * are opened in the users default browser.
 */
const shell = require('electron').shell

// Execute after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href]')

  // On each external link add an event-listener, prevent default and open manually.
  links.forEach(link => {
    const url = link.getAttribute('href')
    if (url.startsWith('http')) {
      link.addEventListener('click', event => {
        event.preventDefault()
        shell.openExternal(url)
      })
    }
  })
})
