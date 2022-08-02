import typegoose from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'

const { prop } = typegoose

export default class GameDeviceSchema {
    @prop() hwidHash: string
    @prop() hwidExHash: string

    @prop() isBanned?: boolean

    @prop({ ref: () => AccountSchema }) accounts?: Ref<AccountSchema>[]
}