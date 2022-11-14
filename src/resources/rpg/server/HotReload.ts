import watch from 'node-watch'
import path from 'path'
import alt from 'alt-server'
import Clients from './core/client/Clients'
import Sessions from './core/sessions/Sessions'

export default class HotReload {
    static timeout: any

    static startWatching() {
        return watch(
            path.join(alt.rootDir, 'resources'),
            { recursive: true, delay: 100 },
            function (event, strPath) {
                if (!this.timeout) {
                    this.timeout = setTimeout(async () => {
                        await HotReload.reload(strPath)
                    }, 500)
                }
            }
        )
    }

    static async reload(strPath: string) {
        alt.log('~c~' + `Detected changes in resource, running pre reload actions...`)
        HotReload.runPreReloadActions()

        // force altv-esbuild to reload the resource
        // @ts-ignore
        alt.emit('consoleCommand', 'res')
    }

    static async runPreReloadActions() {
        for (let i = 0; i < Clients.length; i++) {
            Sessions.updateClientPlayedTimeTotal(Clients[i])
        }

        Clients.splice(0, Clients.length)
    }
}
