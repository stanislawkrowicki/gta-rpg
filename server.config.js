import fs from 'fs'
import 'dotenv/config'

const PRODUCTION_ENVIRONMENT = 'prod'

async function getResourcesInFolder(path) {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(file => file.isDirectory())
        .map(file => file.name)
}

export default {
    name: "RPG Server",
    host: process.env['SERVER_HOST'],
    port: 7788,
    players: 512,
    announce: false,
    gamemode: "RPG",
    website: '<website>',
    language: 'en',
    description: "RPG Server",
    debug: process.env['ENVIRONMENT'] !== PRODUCTION_ENVIRONMENT,
    modules: [
        'js-module',
        'js-bytecode-module'
    ],
    resources: await getResourcesInFolder('./src/resources/')
}

