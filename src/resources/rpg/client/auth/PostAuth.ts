import natives from 'natives'
import Chat from '../chat/Chat'

export default function postAuth() {
    if (!Chat.isInitialized) Chat.initialize()

    natives.displayRadar(true)
}
