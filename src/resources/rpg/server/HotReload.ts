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
        const parts = strPath.split(path.sep)

        let resourceNameIndex = 0

        for (; resourceNameIndex < parts.length; ++resourceNameIndex) {
            if (parts[resourceNameIndex] === 'resources') {
                resourceNameIndex++
                break
            }
        }

        const resourceName = parts[resourceNameIndex]

        alt.restartResource(resourceName)

        alt.log('~c~' + `Detected changes in resource, reloading...`)
    }
}