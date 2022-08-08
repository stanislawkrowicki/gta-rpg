export default class Cfg {
    rawContent = ''

    addProperty(key, value) {
        this.rawContent += key + ': ' + value + '\n'
    }

    addPropertiesFromObject(object) {
        const entries = Object.entries(object)

        for(let i = 0; i < entries.length; i++) {
            const entry = entries[i]

            const key = entries[i][0]
            const value = entries[i][1]

            this.addProperty(key, JSON.stringify(value))
        }
    }

    toString() {
        return this.rawContent
    }
}