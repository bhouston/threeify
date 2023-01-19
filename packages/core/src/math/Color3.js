import { hashFloat3 } from '../core/hash';
export class Color3 {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    getHashCode() {
        return hashFloat3(this.r, this.g, this.b);
    }
    clone(result = new Color3()) {
        return result.set(this.r, this.g, this.b);
    }
    copy(v) {
        return this.set(v.r, v.g, v.b);
    }
    set(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }
    setComponent(index, value) {
        switch (index) {
            case 0:
                this.r = value;
                break;
            case 1:
                this.g = value;
                break;
            case 2:
                this.b = value;
                break;
            default:
                throw new Error(`index is out of range: ${index}`);
        }
        return this;
    }
    getComponent(index) {
        switch (index) {
            case 0:
                return this.r;
            case 1:
                return this.g;
            case 2:
                return this.b;
            default:
                throw new Error(`index is out of range: ${index}`);
        }
    }
}
Color3.NUM_COMPONENTS = 3;
//# sourceMappingURL=Color3.js.map