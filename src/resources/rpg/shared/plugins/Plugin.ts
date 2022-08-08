import type { ServerEvent, ClientEvent } from '../../shared/events/Events'

export type EventFunction = () => void

export abstract class ServerPluginPart {
    events: ServerEvent
}

export abstract class ClientPluginPart {
    events: ClientEvent
}
