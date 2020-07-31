export default class Padding {
    constructor({
        top,
        right,
        bottom,
        left
    }) {
        this._top = top;
        this._right = right;
        this._bottom = bottom;
        this._left = left;
    }

    get top() {
        return this._top;
    }

    get right() {
        return this._right;
    }

    get bottom() {
        return this._bottom;
    }

    get left() {
        return this._left;
    }

    set top(newValue) {
        this._top = newValue;
    }

    set right(newValue) {
        this._right = newValue;
    }

    set bottom(newValue) {
        this._bottom = newValue;
    }

    set left(newValue) {
        this._left = newValue;
    }
}