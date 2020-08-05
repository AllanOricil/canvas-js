export default class Position {

    constructor({
        x,
        y
    }) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return parseInt(this._x ? this._x.toFixed(0): 0);
    }

    get y() {
        return parseInt(this._y ? this._y.toFixed(0): 0);
    }
}