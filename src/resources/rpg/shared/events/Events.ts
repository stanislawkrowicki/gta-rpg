const Events: any = {}

function add(packetModule: any): any {
    return packetModule.default.new()
}

Events.readyToUse = false

Events.initialize = (async () => {
    Events.Server = {
        chat: {
            Message: add(await import('./server/chat/Message')),
        }
    }
    Events.Client = {
        chat: {
            Message: add(await import('./client/chat/Message'))
        }
    }

    Events.readyToUse = true
})

export default Events