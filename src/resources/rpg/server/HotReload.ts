import watch from 'node-watch'
import path from 'path'
import alt from 'alt-server'

export default class HotReload {
    static startWatching() {
        return watch(path.join(alt.rootDir, 'resources'), { recursive: true, delay: 1000 }, function(event, strPath) {
            const parts = strPath.split(path.sep)

            let resourceNameIndex = 0

            for(; resourceNameIndex < parts.length; ++resourceNameIndex) {
                if(parts[resourceNameIndex] === 'resources') {
                    resourceNameIndex++
                    break
                }
            }

            const resourceName = parts[resourceNameIndex]

            alt.restartResource(resourceName)

            alt.log('~c~' + `Detected changes in resource, reloading...`)
        })
    }
}