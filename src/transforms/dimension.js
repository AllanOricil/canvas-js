export default class Dimension {

    constructor({
        width,
        height
    }) {
        this._width = width;
        this._height = height;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    set width(newValue) {
        this._width = newValue;
    }

    set height(newValue) {
        this._height = newValue;
    }
}