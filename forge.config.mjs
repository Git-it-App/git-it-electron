import { execFile } from 'child_process';
import { promisify } from 'util';
import { rimraf } from 'rimraf'

const execFileP = promisify(execFile);

async function generateAssets() {
    // Delete old builds
    await rimraf('built')

    // Builds can run in parallel
    const buildChallenges = execFileP('node', ['./lib/build/build-challenges.js'])
        .then( ({stdout, stderr}) => {
            if (stderr) throw stderr
            console.log(stdout)
        })
    const buildCss = execFileP('node', ['./lib/build/build-css.js'])
        .then( ({stdout, stderr}) => {
            if (stderr) throw stderr
            console.log(stdout)
        })
    const buildPages = execFileP('node', ['./lib/build/build-pages.js'])
        .then( ({stdout, stderr}) => {
            if (stderr) throw stderr
            console.log(stdout)
        })

    // But all builds need to be done to continue.
    await Promise.all([buildChallenges, buildCss, buildPages])
}

export default {
    hooks: {
        // Waiting for builds to be finished.
        generateAssets: generateAssets,
    },
    packagerConfig: {
        overwrite: true,
        icon: './assets/git-it', // Platform dependent extension comes automatically
        extraResource: [
            'resources/i18n'
        ],
        ignore: [
            '.github',
            'resources'
        ]
    },
    makers: [
        {
            name: '@electron-forge/maker-zip',
            platforms: ["darwin", "linux", "win32"],
            config: {
                appName: "Git-it",
            }
        }
    ]
}
