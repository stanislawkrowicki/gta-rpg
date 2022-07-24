import fs from 'fs'

async function getResourcesInFolder(path) {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(file => file.isDirectory())
        .map(file => file.name)
}

export default {
    name: "RPG Server",
    host: '127.0.0.1',
    port: 7788,
    players: 512,
    announce: false,
    gamemode: "RPG",
    website: '<website>',
    language: 'en',
    description: "RPG Server",
    debug: true,
    modules: [
        'js-module',
        'js-bytecode-module'
    ],
    resources: await getResourcesInFolder('resources/')
}

