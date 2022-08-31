import { SHA256 } from 'jscrypto/es6'

export default class Password {
    static hashPassword(password: string, onFinish: (hash: string) => void) {
        onFinish(SHA256.hash(password).toString())
    }
}
