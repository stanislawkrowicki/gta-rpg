import alt from 'alt-server'

export default class VehicleStorehouse {
    static initialize() {
        const shape = new alt.ColshapeCylinder(-695.195617675781, 283.94725036621094, 83.85205078125, 30, 100)
        shape.playersOnly = true

        alt.on('entityEnterColshape', (colshape, player) => {
            if (colshape !== shape) return

            alt.log('enter')
        })
    }
}