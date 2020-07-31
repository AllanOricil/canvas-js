export default class Scale {
    constructor({
        horizontal,
        vertical
    }) {
        this._horizontal = horizontal;
        this._vertical = vertical;
    }

    get horizontal() {
        return this._horizontal;
    }

    get vertical() {
        return this._vertical;
    }

    set horizontal(newValue) {
        this._horizontal = newValue;
    }

    set vertical(newValue) {
        this._vertical = newValue;
    }
}