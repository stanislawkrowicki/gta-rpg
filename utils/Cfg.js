export default class Cfg {
    rawContent = ''
    addProperty(key, value) {
        this.rawContent += key + ': ' + value + '\n'
    }
    toString() {
        return this.rawContent
    }
}