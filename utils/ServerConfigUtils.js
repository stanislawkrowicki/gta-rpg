import Cfg from './Cfg.js'

export default class {
    static getAsCfg(config) {
        let cfg = new Cfg()

        // if(config.name) {
        //     cfg.addProperty('name', config.name)
        // }
        //
        // if(config.host) {
        //     cfg.addProperty('host', config.host)
        // } else {
        //     cfg.addProperty('host', '0.0.0.0')
        // }
        //
        // if(config.port) {
        //     cfg.addProperty('port', config.port)
        // } else {
        //     cfg.addProperty('port', 7788)
        // }
        //
        // if(config.announce) {
        //     cfg.addProperty('announce', config.announce)
        // } else {
        //     cfg.addProperty('announce', false)
        // }
        //
        // if(config.debug) {
        //     cfg.addProperty('debug', config.announce)
        // } else {
        //     cfg.addProperty('debug', false)
        // }
        //
        // if(config.password) {
        //     cfg.addProperty('password', config.password)
        // }

        const entries = Object.entries(config)

        for(let i = 0; i < entries.length; i++) {
            const entry = entries[i]

            const key = entries[i][0]
            const value = entries[i][1]

            cfg.addProperty(key, JSON.stringify(value))
        }


        return cfg
    }
}