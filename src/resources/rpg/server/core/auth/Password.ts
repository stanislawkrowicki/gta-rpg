import crypto from 'crypto'

export default class Password {
    static hashClientHashedPassword(clientHashedPassword: string, hwidHash: string, onFinish: (hash: string) => void) {
        crypto.pbkdf2(clientHashedPassword, hwidHash, 4, 64, 'sha256', (err, derivedKey) => {
            if (err) throw err

            onFinish(derivedKey.toString('hex'))
        })
    }
}