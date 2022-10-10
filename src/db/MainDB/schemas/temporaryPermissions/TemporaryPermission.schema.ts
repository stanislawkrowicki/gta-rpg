import typegoose from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'

const { prop } = typegoose

export default class TemporaryPermissionSchema {
    @prop({ ref: () => AccountSchema }) account: Ref<AccountSchema>

    expireAt: Date

    key: string
    value: boolean
}
