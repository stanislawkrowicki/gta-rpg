import Cfg from './Cfg.js'
import fs from 'fs'

export default class {
    currentResourceConfigPath = ''
    currentResourceConfig = {
        'type': 'js',
        'main': 'server/index.js',
        'client-main': 'client/index.js',
        'bundle': false
    }

    resourceConfigKeys = ['type', 'client-type', 'main', 'client-main', 'client-files',
        'required-permissions', 'optional-permissions', 'deps']
    esbuildConfigKeys = ['bundle', 'external']

    requiredKeys = ['type', 'main']

    constructor(path) {
        this.buildFromFile(path)
    }

    buildFromFile(path) {
        const data = fs.readFileSync(path)
        const json = JSON.parse(data.toString())

        this.currentResourceConfigPath = path
        this.build(json)
    }

    build(config) {
        this.requiredKeys.forEach((key) => {
            if (!Object.hasOwn(this.currentResourceConfig, key))
                throw `${this.currentResourceConfigPath} config is missing required key: ${key}`
        })

        Object.assign(this.currentResourceConfig, config)
    }

    getEsbuildCfg() {
        let esbuildConfig = {bundle: false, external: []}

        Object.entries(this.currentResourceConfig).forEach(([key, val]) => {
            if (this.esbuildConfigKeys.includes(key))
                esbuildConfig[key] = val
        })

        return esbuildConfig
    }

    getAsCfg() {
        let cfg = new Cfg()

        let resourceConfig = {}

        Object.entries(this.currentResourceConfig).forEach(([key, val]) => {
            if (this.resourceConfigKeys.includes(key))
                resourceConfig[key] = val
        })

        cfg.addPropertiesFromObject(resourceConfig)

        return cfg
    }
}