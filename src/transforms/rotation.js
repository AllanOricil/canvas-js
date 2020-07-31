import Position from "./position";

export default class Rotation {
    constructor({
        angle,
        referential
    }) {
        this._angle = angle;
        this._referential = referential ? new Position(referential) : new Position({
            x: 0,
            y: 0
        });
    }

    get angle() {
        return this._angle;
    }

    set angle(newValue) {
        this._angle = newValue;
    }

    get referential() {
        return this._referential;
    }
}