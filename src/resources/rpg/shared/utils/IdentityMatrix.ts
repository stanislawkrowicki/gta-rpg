import Matrix3 from './Matrix3'

export default class IdentityMatrix3 extends Matrix3 {
    constructor() {
        super(1, 0, 0, 0, 1, 0, 0, 0, 1)
    }
}
