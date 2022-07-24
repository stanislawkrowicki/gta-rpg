import gulp from 'gulp'
import * as log from 'fancy-log'
import https from 'https'
import fs from 'fs'
import { createGulpEsbuild } from 'gulp-esbuild'

import ServerConfig from './server.config.js'
import ServerConfigUtils from './utils/ServerConfigUtils.js'

const gulpEsbuild = createGulpEsbuild({});

const DIST_FOLDER = 'dist'

const downloadFile = async (url, destination) => {
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

const downloadBinaryWindows = async (cb) => {
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

const downloadModels = async (cb) => {
    const urls = [
        'https://cdn.altv.mp/data/release/data/vehmodels.bin',
        'https://cdn.altv.mp/data/release/data/vehmods.bin',
        'https://cdn.altv.mp/data/release/data/clothes.bin'
    ]

    let existing = 0
    let downloaded = 0

    for (const url of urls) {
        const splitUrl = url.split('/')
        const fileName = splitUrl[splitUrl.length - 1]

        if (fs.existsSync(DIST_FOLDER + '/data/' + fileName)) {
            existing++
            if (existing === urls.length) {
                cb()
                return
            }
            continue
        }

        log.info(`Downloading ${fileName}...`)

        downloadToDist(url, '/data/' + fileName)
            .then(() => {
                log.info('Finished downloading ' + fileName)
                downloaded++
                if (downloaded === urls.length) cb()
            })
            .catch((err) => {
                log.error('Failed to download ' + fileName)
                throw err
            })
    }
}

const downloadJSModule = async (cb, platform) => {
    const moduleMap = {
        win32: [
            'https://cdn.altv.mp/js-module/release/x64_win32/modules/js-module/libnode.dll',
            'https://cdn.altv.mp/js-module/release/x64_win32/modules/js-module/js-module.dll'
        ],
        linux: [
            'https://cdn.altv.mp/js-module/release/x64_linux/modules/js-module/libnode.so.102',
            'https://cdn.altv.mp/js-module/release/x64_linux/modules/js-module/libjs-module.so'
        ]
    }

    if (!(platform in moduleMap)) {
        throw 'There are no modules for your operating system.'
    }

    let downloaded = 0
    let existing = 0

    const urls = moduleMap[platform]
    for (const url of urls) {
        const splitUrl = url.split('/')
        const fileName = splitUrl[splitUrl.length - 1]

        if (fs.existsSync(DIST_FOLDER + '/modules/js-module/' + fileName)) {
            existing++
            if (urls.length === existing) {
                cb()
                return
            }
            continue
        }

        log.info(`Downloading ${fileName} for ${platform}`)
        downloadToDist(url, '/modules/js-module/' + fileName).then(() => {
            log.info(`Finished downloading ${fileName}`)
            downloaded++
            if (downloaded === urls.length) cb()
        }).catch((err) => {
            log.error('Error downloading platform file')
            throw err
        })
    }
}

const downloadBytecodeModule = async (cb, platform) => {
    const moduleMap = {
        win32: 'https://cdn.altv.mp/js-bytecode-module/release/x64_win32/modules/js-bytecode-module.dll',
        linux: 'https://cdn.altv.mp/js-bytecode-module/release/x64_linux/modules/libjs-bytecode-module.so'
    }

    if (!(platform in moduleMap))
        throw 'There is no bytecode module for your operating system'

    const url = moduleMap[platform]
    const urlSplit = url.split('/')
    const fileName = urlSplit[urlSplit.length - 1]

    if (fs.existsSync(DIST_FOLDER + '/modules/' + fileName)) {
        cb()
        return
    }

    log.info(`Downloading ${fileName}`)
    downloadToDist(url, '/modules/' + fileName).then(() => {
        log.info(`Finished downloading ${fileName}`)
        cb()
    }).catch((err) => {
        log.error(`Error downloading ${fileName} for ${platform}`)
        throw err
    })
}

const downloadAllWindows = async (cb) => {
    await gulp.parallel('download:binary:windows', 'download:models', 'download:modules:windows')()
    cb()
}

const downloadAllLinux = async (cb) => {
    await gulp.parallel('download:binary:linux', 'download:models', 'download:modules:linux')()
    cb()
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

gulp.task('build:resources', async (done) => {
    gulp.series(
        async function buildScripts(done) {
            gulp.src('./resources/**/*.ts')
                .pipe(gulpEsbuild({
                    outdir: './test',
                    format: 'esm',
                    platform: 'node',
                }))
                .on('error', (error) => {
                    console.log(error);
                })
                .pipe(gulp.dest('./dist/resources/'))
                .on('end', done)
        },
        done()
    )()
})

async function build(done) {
    await gulp.series(
        'build:resources',
        async function buildServerCfg(done) {
            let cfg = ServerConfigUtils.getAsCfg(ServerConfig)

            fs.writeFileSync('dist/server.cfg', cfg.toString());

            done()
        }
    )()

    done()
}

gulp.task('build', build)

gulp.task('download:binary:windows', downloadBinaryWindows)
gulp.task('download:binary:linux', downloadBinaryLinux)
gulp.task('download:binary', downloadBinary)
gulp.task('download:models', downloadModels)
gulp.task('download:modules:windows', async (done) => {
    gulp.series(
        async (done) => {
            await downloadJSModule(done, 'win32')
        },
        async (done) => {
            await downloadBytecodeModule(done, 'win32')
        },
        done()
    )()
})

gulp.task('download:modules:linux',
    gulp.series(
        async (cb) => {
            await downloadJSModule(cb, 'linux')
        },
        async (cb) => {
            await downloadBytecodeModule(cb, 'linux')
        }
    )
)

gulp.task('download:windows', downloadAllWindows)
gulp.task('download:linux', downloadAllLinux)
gulp.task('download', downloadAll)

export default build