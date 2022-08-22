import gulp from 'gulp'
import * as log from 'fancy-log'
import https from 'https'
import fs from 'fs'
import {createGulpEsbuild} from 'gulp-esbuild'
import { esbuildDecorators } from '@anatine/esbuild-decorators'
import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from "svelte-preprocess"
import esbuildPluginGLSL from 'esbuild-plugin-glsl'

import ServerConfig from './server.config.js'
import ServerConfigUtils from './utils/ServerConfigUtils.js'
import ResourceConfig from "./utils/ResourceConfig.js"
import ifdefPlugin from "esbuild-ifdef"

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

const downloadBinaryLinux = async (done) => {
    const url = 'https://cdn.altv.mp/server/release/x64_linux/altv-server'
    const path = 'altv-server'

    if (fs.existsSync(DIST_FOLDER + '/' + path)) {
        done()
        return
    }

    log.info('Missing executable for Linux, downloading...')
    downloadToDist(url, path)
        .then(() => {
            log.info('Executable download finished')
            done()
        })
        .catch((err) => {
            log.error('Failed to download server executable.')
            throw err
        })
}

const downloadBinaryWindows = (done) => {
    const url = 'https://cdn.altv.mp/server/release/x64_win32/altv-server.exe'
    const path = 'altv-server.exe'

    if (fs.existsSync(DIST_FOLDER + '/' + path)) {
        done()
        return
    }

    log.info('Missing executable for Windows, downloading...')
    downloadToDist(url, path)
        .then(() => {
            log.info('Executable download finished')
            done()
        })
        .catch((err) => {
            log.error('Failed to download server executable.')
            throw err
        })
}

const downloadBinary = async (done) => {
    switch (process.platform) {
    case 'win32':
        await downloadBinaryWindows(done)
        break
    case 'linux':
        await downloadBinaryLinux(done)
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

const downloadAllWindows = async (done) => {
    await new Promise((finish) => {
        gulp.parallel(
            'download:binary:windows',
            'download:models',
            'download:modules:windows'
        )(() => {
            done()
            finish()
        })
    })
}

const downloadAllLinux = async (done) => {
    await new Promise((finish) => {
        gulp.parallel(
            'download:binary:linux',
            'download:models',
            'download:modules:linux'
        )(() => {
            done()
            finish()
        })
    })
}

const downloadAll = async (done) => {
    switch (process.platform) {
    case 'win32':
        await downloadAllWindows(done)
        break
    case 'linux':
        await downloadAllLinux(done)
        break
    default:
        throw 'There are no required alt:V files for your OS.'
    }
}

const buildResource = (path, done) => {
    path = path.replace(/\\/g, '/')
    const resourceName = path.split('/resources/')[1].split('/')[0]
    const resourceType = path.split(`/${resourceName}/`)[1].split('/')[0]
    const indexPath = `./src/resources/${resourceName}/${resourceType}/index.ts`
    const resourceCfgPath = `./src/resources/${resourceName}/resource.json`

    if (!fs.existsSync(resourceCfgPath))
        throw `Resource ${resourceName} has no resource.json!`

    const resourceCfg = new ResourceConfig(resourceCfgPath)
    const resourceEsbuildCfg = resourceCfg.getEsbuildCfg()

    let esbuildConfig = {}

    switch (resourceType) {
    case 'client':
        esbuildConfig = {
            outfile: 'index.js',
            format: 'esm',
            platform: 'node',
            bundle: resourceEsbuildCfg.bundle,
            plugins: [
                ifdefPlugin.default({
                    variables: {
                        SERVER: false,
                        CLIENT: true
                    }
                })
            ],
            external: resourceEsbuildCfg.external
        }
        break
    case 'server':
        esbuildConfig = {
            outfile: 'index.js',
            format: 'esm',
            platform: 'node',
            bundle: resourceEsbuildCfg.bundle,
            plugins: [
                esbuildDecorators(),
                ifdefPlugin.default({
                    variables: {
                        SERVER: true,
                        CLIENT: false
                    }
                })
            ],
            external: resourceEsbuildCfg.external
        }
        break
    default:
        throw `Can not determine resource ${resourceName} type. Expected server/client, got ${resourceType}`
    }

    gulp.src(indexPath)
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
                    .filter((dirent) => dirent.isDirectory() && dirent.name !== 'components')
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
        async function moveStaticWebViews(done) {
            gulp.src('./src/resources/**/client/webviews/*.html')
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
            sourcemap: false,
            splitting: true,
            write: true,
            format: `esm`,
            plugins: [
                esbuildPluginGLSL(),
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

const buildServerConfig = async (done) => {
    let cfg = ServerConfigUtils.getAsCfg(await ServerConfig())

    fs.writeFileSync(`${DIST_FOLDER}/server.cfg`, cfg.toString())

    done()
}

const buildResourceConfigs = (done) => {
    const directories = fs
        .readdirSync('./src/resources/', {withFileTypes: true})
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)

    directories.forEach((resource) => {
        const path = `./src/resources/${resource}/resource.json`
        if (!fs.existsSync(path))
            throw `Resource ${resource} has no resource.json!`

        let resCfg = new ResourceConfig(path)

        fs.writeFileSync(`./${DIST_FOLDER}/resources/${resource}/resource.cfg`, resCfg.getAsCfg().toString())
    })

    done()
}

const buildLogsConsumer = (done) => {
    gulp.src('./src/logs-consumer/consumer.ts')
        .pipe(gulpEsbuild({
            outfile: 'consumer.js',
            format: 'esm',
            platform: 'node'
        }))
        .on('error', (err) => {
            if (err) {
                log.error(
                    `Error while building logs consumer`
                )
                throw err
            }
        })
        .pipe(
            gulp.dest(
                `${DIST_FOLDER}/logs-consumer/`
            )
        )
        .on('end', done)
}

const build = (done) => {
    return gulp.series('build:resources', buildServerConfig, buildLogsConsumer, buildResourceConfigs)(done)
}

const watchClientScripts = () => {
    const watcher = gulp.watch('./src/resources/*/client/**/*.ts')

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
    const watcher = gulp.watch('./src/resources/*/server/**/*.ts')

    watcher.on('error', (err) => {
        log.error('Server file watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} server changed, rebuilding...`)
        buildResource(path, () => {
            log.info(`Successfully rebuilt ${resourceName} server`)
        })
    })
}

const watchSharedScripts = () => {
    const watcher = gulp.watch('./src/resources/*/shared/**/*')

    watcher.on('error', (err) => {
        log.error('Shared file watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} shared changed, rebuilding server and client...`)
        buildResource(`./src/resources/${resourceName}/server/index.ts`, () => {
            log.info(`Successfully rebuilt ${resourceName} server`)
        })
        buildResource(`./src/resources/${resourceName}/client/index.ts`, () => {
            log.info(`Successfully rebuilt ${resourceName} client`)
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
    watchWebViews(gulp.watch(['./src/resources/**/client/webviews/**/*.ts', '!./src/resources/**/client/webviews/components']))
}

const watchWebViewsSvelte = () => {
    watchWebViews(gulp.watch(['./src/resources/**/client/webviews/**/*.svelte', '!./src/resources/**/client/webviews/components']))
}

const watchStaticWebViews = () => {
    const watcher = gulp.watch('./src/resources/**/client/webviews/*.html')

    watcher.on('error', (err) => {
        log.error('Static WebViews watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')

        const resourceName = path.split('/resources/')[1].split('/')[0]
        const file = path.split('/webviews/')[1]

        gulp.src(`./src/resources/${resourceName}/client/webviews/${file}`)
            .pipe(gulp.dest(`./${DIST_FOLDER}/resources/`))
            .on('end', () => {
                log.info(`Successfully built resource ${resourceName} static webview ${file}`)
            })
    })
}

const watchResourceConfig = () => {
    const watcher = gulp.watch('./src/resources/**/resource.json')

    watcher.on('error', (err) => {
        log.error('Resource config watcher threw an error.')
        throw err
    })

    watcher.on('all', (_, path) => {
        path = path.replace(/\\/g, '/')
        const resourceName = path.split('/resources/')[1].split('/')[0]

        log.info(`Resource ${resourceName} config changed, building...`)

        let resCfg = new ResourceConfig(path)
        fs.writeFileSync(`./${DIST_FOLDER}/resources/${resourceName}/resource.cfg`, resCfg.getAsCfg().toString())

        log.info(`Successfully built resource ${resourceName} config`)
    })
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
        async (done) => {
            await downloadJSModule('linux')
            done()
        },
        async (done) => {
            await downloadBytecodeModule('linux')
            done()
        }
    )
)

gulp.task('download:windows', downloadAllWindows)
gulp.task('download:linux', downloadAllLinux)
gulp.task('download', downloadAll)

gulp.task('build', build)
gulp.task('build:logs_consumer', buildLogsConsumer)

gulp.task('watch:client', watchClientScripts)
gulp.task('watch:server', watchServerScripts)
gulp.task('watch:shared', watchSharedScripts)
gulp.task('watch:assets', watchClientAssets)
gulp.task('watch:resource:config', watchResourceConfig)
gulp.task('watch:webview:entry', watchWebViewsEntry)
gulp.task('watch:webview:svelte', watchWebViewsSvelte)
gulp.task('watch:webview:static', watchStaticWebViews)
gulp.task('watch:webview', gulp.parallel('watch:webview:entry', 'watch:webview:svelte', 'watch:webview:static'))

const watch = () => {
    gulp.series('build', gulp.parallel(
        'watch:client',
        'watch:server',
        'watch:shared',
        'watch:webview',
        'watch:assets',
        'watch:resource:config',
    ))()
}

gulp.task('watch', watch)

export default watch