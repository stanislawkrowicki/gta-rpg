import typegoose from '@typegoose/typegoose'
import type {Ref} from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'
import GameDeviceSchema from "../gameDevices/GameDevice.schema"

const { prop, modelOptions, Severity } = typegoose

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class SuspiciousEventSchema {
    @prop() eventID: number
    @prop() eventContent: object

    @prop({ ref: () => AccountSchema }) account?: Ref<AccountSchema>
    @prop({ ref: () => GameDeviceSchema }) gameDevice: Ref<GameDeviceSchema>

    @prop() timestamp: string
}