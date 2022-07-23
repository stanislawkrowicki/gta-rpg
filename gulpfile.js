const gulp = require('gulp')
const log = require('fancy-log')

const https = require('https')
const fs = require('fs')

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

const downloadToDist = (url, destination) => {
    if (!fs.existsSync(destination)) {
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

const downloadBinaryLinux = (cb) => {
    const url = 'https://cdn.altv.mp/server/release/x64_linux/altv-server'
    const path = '/altv-server'

    if (fs.existsSync(path)) {
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
    const path = '/altv-server.exe'

    if (fs.existsSync(path)) {
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

const downloadBinary = (cb) => {
    switch (process.platform) {
        case 'win32':
            downloadBinaryWindows(cb)
            break
        case 'linux':
            downloadBinaryLinux(cb)
            break
        default:
            log.error('There are no alt:V binaries for your OS.')
            throw 'There are no alt:V binaries for your OS.'
    }
}

const downloadModels = (cb) => {
    const urls = [
        'https://cdn.altv.mp/data/release/data/vehmodels.bin',
        'https://cdn.altv.mp/data/release/data/vehmods.bin',
        'https://cdn.altv.mp/data/release/data/clothes.bin'
    ]

    let downloaded = 0

    for (const url of urls) {
        const splitUrl = url.split('/')
        const fileName = splitUrl[splitUrl.length - 1]

        if (fs.existsSync(DIST_FOLDER + '/data/' + fileName)) continue

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

const downloadJSModule = (cb, platform) => {
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
            if (urls.length == existing) {
                cb()
                return
            }
            continue
        }

        log.info(`Downloading ${fileName} for ${platform}`)
        downloadToDist(url, '/modules/js-module/' + fileName).then(() => {
            log.info(`Finished downloading ${fileName}`)
            downloaded++
            if (downloaded == urls.length) cb()
        }).catch((err) => {
            log.error('Error downloading platform file')
            throw err
        })
    }
}

const downloadBytecodeModule = (cb, platform) => {
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

const downloadAllWindows = (cb) => {
    gulp.parallel('download:binary:windows', 'download:models', 'download:modules:windows')()
    cb()
}

const downloadAllLinux = (cb) => {
    gulp.parallel('download:binary:linux', 'download:models', 'download:modules:linux')()
    cb()
}

const downloadAll = (cb) => {
    switch (process.platform) {
        case 'win32':
            downloadAllWindows(cb)
            break
        case 'linux':
            downloadAllLinux(cb)
            break
        default:
            log.error('There are no alt:V files for your OS.')
            throw 'There are no alt:V files for your OS.'
    }
}

gulp.task('download:binary:windows', downloadBinaryWindows)
gulp.task('download:binary:linux', downloadBinaryLinux)
gulp.task('download:binary', downloadBinary)
gulp.task('download:models', downloadModels)
gulp.task('download:modules:windows', gulp.series((cb) => {
    downloadJSModule(cb, 'win32')
}, (cb) => {
    downloadBytecodeModule(cb, 'win32')
}))
gulp.task('download:modules:linux', gulp.series((cb) => {
    downloadJSModule(cb, 'linux')
}, (cb) => {
    downloadBytecodeModule(cb, 'linux')
}))
gulp.task('download', downloadAll)
exports.default = downloadAll