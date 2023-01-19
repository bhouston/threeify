import { hashFloat3 } from '../core/hash';
export class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    getHashCode() {
        return hashFloat3(this.x, this.y, this.z);
    }
    clone(result = new Vec3()) {
        return result.set(this.x, this.y, this.z);
    }
    copy(v) {
        return this.set(v.x, v.y, v.z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    setComponent(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error(`index is out of range: ${index}`);
        }
        return this;
    }
    getComponent(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error(`index is out of range: ${index}`);
        }
    }
}
Vec3.NUM_COMPONENTS = 3;
//# sourceMappingURL=Vec3.js.map