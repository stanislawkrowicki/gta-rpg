import Chat from '../chat/Chat'

export default function postAuth() {
    if (!Chat.isInitialized) Chat.initialize()
}
