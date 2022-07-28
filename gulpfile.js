import gulp from 'gulp'
import * as log from 'fancy-log'
import https from 'https'
import fs from 'fs'
import {createGulpEsbuild} from 'gulp-esbuild'
import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from "svelte-preprocess"

import ServerConfig from './server.config.js'
import ServerConfigUtils from './utils/ServerConfigUtils.js'

const gulpEsbuild = createGulpEsbuild({})

const DIST_FOLDER = 'dist'

const downloadFile = (url, destination) => {
    if (!fs.existsSync(destination))
        fs.open(destination, 'w', (err) => {
            if (err) throw err
        })

    const file = fs.createWriteStream(destination)

    return new Promise((resolve, reject) => {
        https
            .get(url, (response) => {
                response.pipe(file)

                file.on('finish', () => {
                    file.close()
                    resolve()
                })
            })
            .on('error', (err) => {
                fs.unlink(destination, (err) => {
                    if (err) throw err
                })
                reject(err)
            })
    })
}

const downloadToDist = async (url, destination) => {
    if (!fs.existsSync(DIST_FOLDER + '/' + destination)) {
        let directoryTree = DIST_FOLDER

        if (destination.includes('/')) {
            const directories = destination.split('/')
            for (let i = 0; i < directories.length - 1; i++)
                directoryTree += '/' + directories[i]
        }

        fs.mkdirSync(directoryTree, {recursive: true})
    }

    return downloadFile(url, DIST_FOLDER + '/' + destination)
}

const downloadBinaryLinux = async (cb) => {
    const url = 'https://cdn.altv.mp/server/release/x64_linux/altv-server'
    const path = 'altv-server'

    if (fs.existsSync(DIST_FOLDER + '/' + path)) {
        cb()
        return
    }

    log.info('Missing executable for Linux, downloading...')
    downloadToDist(url, path)
        .then(() => {
            log.info('Executable download finished')
            cb()
        })
        .catch((err) => {
            log.error('Failed to download server executable.')
            throw err
        })
}

const downloadBinaryWindows = (cb) => {
    const url = 'https://cdn.altv.mp/server/release/x64_win32/altv-server.exe'
    const path = 'altv-server.exe'

    if (fs.existsSync(DIST_FOLDER + '/' + path)) {
        cb()
        return
    }

    log.info('Missing executable for Windows, downloading...')
    downloadToDist(url, path)
        .then(() => {
            log.info('Executable download finished')
            cb()
        })
        .catch((err) => {
            log.error('Failed to download server executable.')
            throw err
        })
}

const downloadBinary = async (cb) => {
    switch (process.platform) {
    case 'win32':
        await downloadBinaryWindows(cb)
        break
    case 'linux':
        await downloadBinaryLinux(cb)
        break
    default:
        log.error('There are no alt:V binaries for your OS.')
        throw 'There are no alt:V binaries for your OS.'
    }
}

const downloadModels = async (done) => {
    const urls = [
        'https://cdn.altv.mp/data/release/data/vehmodels.bin',
        'https://cdn.altv.mp/data/release/data/vehmods.bin',
        'https://cdn.altv.mp/data/release/data/clothes.bin',
    ]

    let existing = 0
    let downloaded = 0

    for (const url of urls) {
        const splitUrl = url.split('/')
        const fileName = splitUrl[splitUrl.length - 1]

        if (fs.existsSync(DIST_FOLDER + '/data/' + fileName)) {
            existing++
            if (existing === urls.length) {
                done()
                return
            }
            continue
        }

        log.info(`Downloading ${fileName}...`)

        await downloadToDist(url, '/data/' + fileName)
            .then(() => {
                log.info('Finished downloading ' + fileName)
                downloaded++
                if (downloaded === urls.length) done()
            })
            .catch((err) => {
                log.error('Failed to download ' + fileName)
                throw err
            })
    }
}

const downloadJSModule = async (platform) => {
    const moduleMap = {
        win32: [
            'https://cdn.altv.mp/js-module/release/x64_win32/modules/js-module/libnode.dll',
            'https://cdn.altv.mp/js-module/release/x64_win32/modules/js-module/js-module.dll',
        ],
        linux: [
            'https://cdn.altv.mp/js-module/release/x64_linux/modules/js-module/libnode.so.102',
            'https://cdn.altv.mp/js-module/release/x64_linux/modules/js-module/libjs-module.so',
        ],
    }

    if (!(platform in moduleMap)) {
        throw 'There are no modules for your operating system.'
    }

    let downloaded = 0
    let existing = 0

    const urls = moduleMap[platform]

    await new Promise((finish, fail) => {
        for (const url of urls) {
            const splitUrl = url.split('/')
            const fileName = splitUrl[splitUrl.length - 1]

            if (fs.existsSync(DIST_FOLDER + '/modules/js-module/' + fileName)) {
                existing++
                if (urls.length === existing) {
                    finish()
                    return
                }
                continue
            }

            log.info(`Downloading ${fileName} for ${platform}`)
            downloadToDist(url, '/modules/js-module/' + fileName)
                .then(() => {
                    log.info(`Finished downloading ${fileName}`)
                    downloaded++
                    if (downloaded === urls.length) finish()
                })
                .catch((err) => {
                    log.error('Error downloading platform file')
                    fail()
                    throw err
                })
        }
    })
}

const downloadBytecodeModule = (platform) => {
    const moduleMap = {
        win32: 'https://cdn.altv.mp/js-bytecode-module/release/x64_win32/modules/js-bytecode-module.dll',
        linux: 'https://cdn.altv.mp/js-bytecode-module/release/x64_linux/modules/libjs-bytecode-module.so',
    }

    if (!(platform in moduleMap))
        throw 'There is no bytecode module for your operating system'

    const url = moduleMap[platform]
    const urlSplit = url.split('/')
    const fileName = urlSplit[urlSplit.length - 1]

    if (fs.existsSync(DIST_FOLDER + '/modules/' + fileName)) {
        // cb()
        return
    }

    log.info(`Downloading ${fileName}`)

    return downloadToDist(url, '/modules/' + fileName)
        .then(() => {
            log.info(`Finished downloading ${fileName}`)
        })
        .catch((err) => {
            log.error(`Error downloading ${fileName} for ${platform}`)
            throw err
        })
}

const downloadAllWindows = async (cb) => {
    await new Promise((finish) => {
        gulp.parallel(
            'download:binary:windows',
            'download:models',
            'download:modules:windows'
        )(() => {
            cb()
            finish()
        })
    })
}

const downloadAllLinux = async (cb) => {
    await new Promise((finish) => {
        gulp.parallel(
            'download:binary:linux',
            'download:models',
            'download:modules:linux'
        )(() => {
            cb()
            finish()
        })
    })
}

const downloadAll = async (cb) => {
    switch (process.platform) {
    case 'win32':
        await downloadAllWindows(cb)
        break
    case 'linux':
        await downloadAllLinux(cb)
        break
    default:
        throw 'There are no required alt:V files for your OS.'
    }
}

const buildResource = (path, done) => {
    path = path.replace(/\\/g, '/')
    const resourceName = path.split('/resources/')[1].split('/')[0]
    const resourceType = path.split(`/${resourceName}/`)[1].split('/')[0]

    let esbuildConfig = {}

    switch (resourceType) {
    case 'client':
        esbuildConfig = {
            outfile: 'index.js',
            format: 'esm',
            platform: 'node',
            bundle: true,
            external: [
                'alt-client',
                'natives'
            ]
        }
        break
    case 'server':
        esbuildConfig = {
            outfile: 'index.js',
            format: 'esm',
            platform: 'node',
            bundle: true,
            external: [
                'alt-server',
                'dotenv',
                'mongoose'
            ]
        }
        break
    default:
        throw `Can not determine resource ${resourceName} type. Expected server/client, got ${resourceType}`
    }

    gulp.src(path)
        .pipe(
            gulpEsbuild(esbuildConfig)
        )
        .on('error', (err) => {
            if (err) {
                log.error(
                    `Error while building resource ${resourceName} ${resourceType}`
                )
                throw err
            }
        })
        .pipe(
            gulp.dest(
                `${DIST_FOLDER}/resources/${resourceName}/${resourceType}/`
            )
        )
        .on('end', () => {
            if (done) done()
        })
}

gulp.task('build:resources', (done) => {
    gulp.series(
        async function buildClientScripts(done) {
            const directories = fs
                .readdirSync('./src/resources/', {withFileTypes: true})
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)

            directories.forEach((resource) => {
                buildResource(
                    `./src/resources/${resource}/client/index.ts`,
                    done
                )
            })
        },
        async function buildServerScripts(done) {
            const directories = fs
                .readdirSync('./src/resources/', {withFileTypes: true})
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)

            directories.forEach((resource) => {
                buildResource(`./src/resources/${resource}/server/index.ts`, done)
            })
        },
        async function buildWebViews() {
            const directories = fs
                .readdirSync('./src/resources/', {withFileTypes: true})
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)

            for (const resource of directories) {
                const path = `./src/resources/${resource}/client/webviews`
                if (!fs.existsSync(path)) continue

                const webViews = fs
                    .readdirSync(path, {withFileTypes: true})
                    .filter((dirent) => dirent.isDirectory())
                    .map((dirent) => dirent.name)

                for (const webView of webViews) {
                    await buildWebViewAsync(`${path}/${webView}/index.ts`)
                }
            }
        },
        async function moveClientAssets(done) {
            gulp.src('./src/resources/**/client/assets')
                .pipe(gulp.dest(`./${DIST_FOLDER}/resources/`))
                .on('end', done)
        },
        async function buildConfigs(done) {
            gulp.src('./src/resources/**/*.cfg')
                .pipe(gulp.dest(`./${DIST_FOLDER}/resources/`))
                .on('end', done)
        }
    )(done)
})

const buildWebView = (path, done) => {
    path = path.replace(/\\/g, '/')

    const resourceName = path.split('/resources/')[1].split('/')[0]
    const webviewName = path.split('/webviews/')[1].split('/')[0]

    const distWebviewPath = `${DIST_FOLDER}/resources/${resourceName}/client/webviews/${webviewName}/`

    if (!fs.existsSync(distWebviewPath))
        fs.mkdirSync(distWebviewPath, {recursive: true})

    fs.writeFileSync(`${DIST_FOLDER}/resources/${resourceName}/client/webviews/${webviewName}/index.html`,
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <script src="index.js" defer></script>\n' +
        '    <link rel="stylesheet" href="index.css">\n' +
        '</head>\n' +
        '<body>\n' +
        '</body>\n' +
        '</html>')

    gulp.src(path)
        .pipe(gulpEsbuild({
            entryPoints: [`./index.ts`],
            bundle: true,
            outdir: `./`,
            mainFields: ["svelte", "browser", "module", "main"],
            minify: false,
            sourcemap: "inline",
            splitting: true,
            write: true,
            format: `esm`,
            plugins: [
                esbuildSvelte({
                    preprocess: sveltePreprocess(),
                }),
            ],
        }))
        .pipe(gulp.dest(`./${DIST_FOLDER}/resources/${resourceName}/client/webviews/${webviewName}/`))
        .on('end', () => {
            if (done) done()
        })
}

const buildWebViewAsync = async (path) => {
    return new Promise((resolve) => {
        buildWebView(path, resolve)
    })
}

const build = (done) => {
    return gulp.series('build:resources', async function buildServerCfg(done) {
        let cfg = ServerConfigUtils.getAsCfg(await ServerConfig())

        fs.writeFileSync('dist/server.cfg', cfg.toString())

        done()
    })(done)
}

const watchClientScripts = () => {
    const watcher = gulp.watch('./src/resources/**/client/**/*.ts')

    watcher.on('error', (err) => {
        log.error('Client file watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} client changed, rebuilding...`)
        buildResource(path, () => {
            log.info(`Successfully rebuilt ${resourceName} client`)
        })
    })
}

const watchServerScripts = () => {
    const watcher = gulp.watch('./src/resources/**/server/**/*.ts')

    watcher.on('error', (err) => {
        log.error('Server file watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} client changed, rebuilding...`)
        buildResource(path, () => {
            log.info(`Successfully rebuilt ${resourceName} server`)
        })
    })
}

const watchClientAssets = () => {
    const watcher = gulp.watch('./src/resources/**/client/assets/')

    watcher.on('error', (err) => {
        log.error('Client assets watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} assets changed, distributing...`)

        gulp.src(`./src/resources/${resourceName}/client/assets/`)
            .pipe(gulp.dest(`./${DIST_FOLDER}/resources/${resourceName}/client/assets`))
            .on('end', () => {
                log.info(
                    `Successfully distributed changed ${resourceName} assets`
                )
            })
    })
}

const watchWebViews = (watcher) => {
    watcher.on('error', (err) => {
        log.error('Client web watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]
        const webviewName = path.split('/webviews/')[1].split('/')[0]

        log.info(`Detected change in ${resourceName} webview ${webviewName}, running Svelte compiler...`)

        if (path.endsWith('.svelte')) {
            let split = path.split('/')
            split[split.length - 1] = 'index.ts'
            path = split.join('/')
        }

        buildWebView(path, () => {
            log.info(`Successfully compiled ${resourceName} webview ${webviewName}.`)
        })
    })
}

const watchWebViewsEntry = () => {
    watchWebViews(gulp.watch('./src/resources/**/client/webviews/**/*.ts'))
}

const watchWebViewsSvelte = () => {
    watchWebViews(gulp.watch('./src/resources/**/client/webviews/**/*.svelte'))
}

const watchResourceConfig = () => {
    const watcher = gulp.watch('./src/resources/**/resource.cfg')

    watcher.on('error', (err) => {
        log.error('Resource config watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')
        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} config changed, distributing...`)

        gulp.src(`./src/resources/${resourceName}/resource.cfg`)
            .pipe(gulp.dest(`./${DIST_FOLDER}/resources/${resourceName}/`))
            .on('end', () => {
                log.info(`Successfully distributed ${resourceName} config`)
            })
    })
}

const watch = () => {
    gulp.series('build', gulp.parallel(
        'watch:client',
        'watch:server',
        'watch:webview',
        'watch:assets',
        'watch:config'
    ))()
}

gulp.task('download:binary:windows', downloadBinaryWindows)
gulp.task('download:binary:linux', downloadBinaryLinux)
gulp.task('download:binary', downloadBinary)
gulp.task('download:models', downloadModels)
gulp.task(
    'download:modules:windows',
    gulp.series(
        async function downloadingJSModule() {
            return downloadJSModule('win32')
        },
        async function downloadingBytecodeModule() {
            return downloadBytecodeModule('win32')
        }
    )
)

gulp.task(
    'download:modules:linux',
    gulp.series(
        async (cb) => {
            await downloadJSModule('linux')
            cb()
        },
        async (cb) => {
            await downloadBytecodeModule('linux')
            cb()
        }
    )
)

gulp.task('download:windows', downloadAllWindows)
gulp.task('download:linux', downloadAllLinux)
gulp.task('download', downloadAll)

gulp.task('build', build)

gulp.task('watch:client', watchClientScripts)
gulp.task('watch:server', watchServerScripts)
gulp.task('watch:assets', watchClientAssets)
gulp.task('watch:config', watchResourceConfig)
gulp.task('watch:webview:entry', watchWebViewsEntry)
gulp.task('watch:webview:svelte', watchWebViewsSvelte)
gulp.task('watch:webview', gulp.parallel('watch:webview:entry', 'watch:webview:svelte'))
gulp.task('watch', watch)

export default watch