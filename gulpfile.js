import gulp from 'gulp'
import * as log from 'fancy-log'
import https from 'https'
import fs from 'fs'
import gulpEsbuild from 'gulp-esbuild'
import { esbuildDecorators } from '@anatine/esbuild-decorators'
import { altvEsbuild } from 'altv-esbuild'
import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import esbuildPluginGLSL from 'esbuild-plugin-glsl'
import ifdefPlugin from 'esbuild-ifdef'

const DIST_FOLDER = 'dist'
const SRC_FOLDER = 'src'
const GAMEMODE_RESOURCE_NAME = 'rpg'

const altvBranch = process.env['ALTV_BRANCH'] | 'release'
const isDevMode = !(process.env['ENVIRONMENT'] === 'prod')

const SERVER_CFG = `
name: "RPG Server"
host: "127.0.0.1"
port: 7788
players: 512
announce: false
connectionQueue: true
gamemode: "RPG"
website: "<website>"
language: "en"
description: "RPG Server"
debug: ${isDevMode}
modules: ["js-module","js-bytecode-module"]
resources: ["${GAMEMODE_RESOURCE_NAME}"]
`

const GAMEMODE_CFG = `
type: "js"
main: "server/index.js"
client-main: "client/index.js"
required-permissions: ["Screen Capture"]
client-files: ["client/webviews/*"]
`

const prepareDirectory = (path) => {
    if (!fs.existsSync(path)) {
        let directoryTree = DIST_FOLDER + '/'

        if (path.includes('/')) {
            const directories = path.split('/')
            for (let i = 0; i < directories.length - 1; i++) directoryTree += '/' + directories[i]
        }

        fs.mkdirSync(directoryTree, { recursive: true })
    }
}

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
    prepareDirectory(destination)
    return downloadFile(url, DIST_FOLDER + '/' + destination)
}

const downloadExecutable = (done) => {
    let url = ''
    let fileName = ''

    switch (process.platform) {
        case 'win32':
            url = `https://cdn.altv.mp/server/${altvBranch}/x64_win32/altv-server.exe`
            fileName = 'altv-server.exe'
            break
        case 'linux':
            url = `https://cdn.altv.mp/server/${altvBranch}/x64_linux/altv-server`
            fileName = 'altv-server'
            break
        default:
            log.error('There are no alt:V binaries for your OS.')
            throw 'There are no alt:V binaries for your OS.'
    }

    if (fs.existsSync(DIST_FOLDER + '/' + fileName)) return

    log.info(`Downloading executable for ${process.platform}`)

    downloadToDist(url, fileName)
        .then(() => {
            log.info('Executable download finished')
            done()
        })
        .catch((err) => {
            log.error('Failed to download server executable.')
            throw err
        })
}

const downloadModels = async (done) => {
    const urls = [
        `https://cdn.altv.mp/data/${altvBranch}/data/vehmodels.bin`,
        `https://cdn.altv.mp/data/${altvBranch}/data/vehmods.bin`,
        `https://cdn.altv.mp/data/${altvBranch}/data/clothes.bin`,
    ]

    if (altvBranch === 'dev') urls.push(`https://cdn.altv.mp/data/${altvBranch}/data/pedmodels.bin`)

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
                log.info(`Finished downloading ${fileName}`)
                downloaded++
                if (downloaded === urls.length) done()
            })
            .catch((err) => {
                log.error(`Failed to download ${fileName}`)
                throw err
            })
    }
}

const downloadJSModule = async () => {
    const moduleMap = {
        win32: [
            `https://cdn.altv.mp/js-module/${altvBranch}/x64_win32/modules/js-module/libnode.dll`,
            `https://cdn.altv.mp/js-module/${altvBranch}/x64_win32/modules/js-module/js-module.dll`,
        ],
        linux: [
            `https://cdn.altv.mp/js-module/${altvBranch}/x64_linux/modules/js-module/libnode.so.102`,
            `https://cdn.altv.mp/js-module/${altvBranch}/x64_linux/modules/js-module/libjs-module.so`,
        ],
    }

    if (!(process.platform in moduleMap)) {
        throw 'There are no modules for your operating system.'
    }

    let downloaded = 0
    let existing = 0

    const urls = moduleMap[process.platform]

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

            log.info(`Downloading ${fileName} for ${process.platform}`)
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

const downloadBytecodeModule = () => {
    const moduleMap = {
        win32: `https://cdn.altv.mp/js-bytecode-module/${altvBranch}/x64_win32/modules/js-bytecode-module.dll`,
        linux: `https://cdn.altv.mp/js-bytecode-module/${altvBranch}/x64_linux/modules/libjs-bytecode-module.so`,
    }

    if (!(process.platform in moduleMap))
        throw 'There is no bytecode module for your operating system'

    const url = moduleMap[process.platform]
    const urlSplit = url.split('/')
    const fileName = urlSplit[urlSplit.length - 1]

    if (fs.existsSync(DIST_FOLDER + '/modules/' + fileName)) {
        return
    }

    log.info(`Downloading ${fileName}`)

    return downloadToDist(url, '/modules/' + fileName)
        .then(() => {
            log.info(`Finished downloading ${fileName}`)
        })
        .catch((err) => {
            log.error(`Error downloading ${fileName} for ${process.platform}`)
            throw err
        })
}

const downloadAll = async (done) => {
    await new Promise((finish) => {
        gulp.parallel(
            'download:executable',
            'download:models',
            'download:modules'
        )(() => {
            done()
            finish()
        })
    })
}

const buildGamemode = (done) => {
    const gamemodeDistPath = `${DIST_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}`
    const clientIndexPath = `${SRC_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/index.ts`
    const serverIndexPath = `${SRC_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/server/index.ts`

    prepareDirectory(`/resources/${GAMEMODE_RESOURCE_NAME}/`)
    fs.writeFileSync(gamemodeDistPath + '/resource.cfg', GAMEMODE_CFG)

    const clientEsbuildConfig = {
        outfile: 'index.js',
        format: 'esm',
        platform: 'node',
        bundle: true,
        sourcemap: isDevMode ? 'inline' : false,
        plugins: [
            altvEsbuild({
                mode: 'client',
                dev: {
                    enabled: isDevMode,
                    hotReload: false,
                    restartCommand: isDevMode,
                },
            }),
            ifdefPlugin.default({
                variables: {
                    SERVER: false,
                    CLIENT: true,
                },
            }),
        ],
    }

    const serverEsbuildConfig = {
        outfile: 'index.js',
        format: 'esm',
        platform: 'node',
        bundle: true,
        sourcemap: isDevMode ? 'inline' : false,
        plugins: [
            altvEsbuild({
                mode: 'server',
                dev: {
                    enabled: isDevMode,
                    hotReload: false,
                    restartCommand: isDevMode,
                },
            }),
            esbuildDecorators(),
            ifdefPlugin.default({
                variables: {
                    SERVER: true,
                    CLIENT: false,
                },
            }),
        ],
        external: [
            'dotenv',
            'mongoose',
            'node-watch',
            'amqplib',
            'redis-om',
            '@typegoose/typegoose',
        ],
    }

    gulp.src(clientIndexPath)
        .pipe(gulpEsbuild(clientEsbuildConfig))
        .on('error', (err) => {
            if (err) {
                log.error(`Error while building gamemode client`)
                throw err
            }
        })
        .pipe(gulp.dest(`${gamemodeDistPath}/client/`))
        .on('end', () => {
            if (done) done()
        })

    gulp.src(serverIndexPath)
        .pipe(gulpEsbuild(serverEsbuildConfig))
        .on('error', (err) => {
            if (err) {
                log.error(`Error while building gamemode server`)
                throw err
            }
        })
        .pipe(gulp.dest(`${gamemodeDistPath}/server/`))
        .on('end', () => {
            if (done) done()
        })
}

const buildWebView = (path, done) => {
    path = path.replace(/\\/g, '/')

    const webviewName = path.split('/webviews/')[1].split('/')[0]

    const distWebviewPath = `${DIST_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews/${webviewName}/`

    if (!fs.existsSync(distWebviewPath)) fs.mkdirSync(distWebviewPath, { recursive: true })

    fs.writeFileSync(
        `${DIST_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews/${webviewName}/index.html`,
        '<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <script src="index.js" defer></script>\n' +
            '    <link rel="stylesheet" href="index.css">\n' +
            '</head>\n' +
            '<body>\n' +
            '</body>\n' +
            '</html>'
    )

    gulp.src(path)
        .pipe(
            gulpEsbuild({
                entryPoints: [`./index.ts`],
                bundle: true,
                outdir: `./`,
                mainFields: ['svelte', 'browser', 'module', 'main'],
                minify: false,
                sourcemap: isDevMode,
                splitting: true,
                write: true,
                format: `esm`,
                plugins: [
                    esbuildPluginGLSL(),
                    esbuildSvelte({
                        preprocess: sveltePreprocess(),
                    }),
                ],
            })
        )
        .pipe(
            gulp.dest(
                `./${DIST_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews/${webviewName}/`
            )
        )
        .on('end', () => {
            if (done) done()
        })
}

const buildWebViewAsync = async (path) => {
    return new Promise((resolve) => {
        buildWebView(path, resolve)
    })
}

const buildWebviews = async () => {
    const webViews = fs
        .readdirSync(`${SRC_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews`, {
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isDirectory() && dirent.name !== 'components')
        .map((dirent) => dirent.name)

    for (const webView of webViews) {
        await buildWebViewAsync(
            `${SRC_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews/${webView}/index.ts`
        )
    }
}

const buildLogsConsumer = (done) => {
    gulp.src(`./${SRC_FOLDER}/logs-consumer/consumer.ts`)
        .pipe(
            gulpEsbuild({
                outfile: 'consumer.js',
                format: 'esm',
                platform: 'node',
            })
        )
        .on('error', (err) => {
            if (err) {
                log.error(`Error while building logs consumer`)
                throw err
            }
        })
        .pipe(gulp.dest(`${DIST_FOLDER}/logs-consumer/`))
        .on('end', done)
}

const writeServerConfig = (done) => {
    prepareDirectory('')
    fs.writeFileSync(`${DIST_FOLDER}/server.cfg`, SERVER_CFG)
    done()
}

const buildAll = (done) => {
    return gulp.series(
        'write:server_config',
        'build:gamemode',
        'build:webviews',
        'build:logs_consumer',
        'move:client_assets',
        'move:static_webviews'
    )(done)
}

const moveClientAssets = (done) => {
    gulp.src(`${SRC_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/assets/*`)
        .pipe(gulp.dest(`./${DIST_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/assets/`))
        .on('end', done)
}

const moveStaticWebviews = (done) => {
    gulp.src(`${SRC_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews/*.html`)
        .pipe(gulp.dest(`./${DIST_FOLDER}/resources/${GAMEMODE_RESOURCE_NAME}/client/webviews/`))
        .on('end', done)
}

gulp.task('download:executable', downloadExecutable)
gulp.task('download:models', downloadModels)
gulp.task('download:js_module', downloadJSModule)
gulp.task('download:bytecode_module', downloadBytecodeModule)
gulp.task('download:modules', gulp.series('download:js_module', 'download:bytecode_module'))
gulp.task('download', downloadAll)

gulp.task('move:client_assets', moveClientAssets)
gulp.task('move:static_webviews', moveStaticWebviews)

gulp.task('write:server_config', writeServerConfig)

gulp.task('build:gamemode', buildGamemode)
gulp.task('build:webviews', buildWebviews)
gulp.task('build:logs_consumer', buildLogsConsumer)
gulp.task('build', buildAll)
