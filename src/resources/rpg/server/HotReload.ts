import watch from 'node-watch'
import path from 'path'
import alt from 'alt-server'

export default class HotReload {
    static timeout: any

    static startWatching() {
        return watch(
            path.join(alt.rootDir, 'resources'),
            { recursive: true, delay: 100 },
            function (event, strPath) {
                if (!this.timeout) {
                    this.timeout = setTimeout(() => {
                        HotReload.reload(strPath)
                    }, 500)
                }
            }
        )
    }

    static reload(strPath: string) {
        alt.log('~c~' + `Detected changes in resource, reloading...`)

        // force altv-esbuild to reload the resource
        // @ts-ignore
        alt.emit('consoleCommand', 'res')
    }
}
