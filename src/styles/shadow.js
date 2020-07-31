import Color from "./color";

export default class Shadow {
    constructor({
        offsetX,
        offsetY,
        color,
        blur
    }) {
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._color = new Color(color);
        this._blur = blur;
    }

    get offsetX() {
        return this._offsetX;
    }

    get offsetY() {
        return this._offsetY;
    }

    get color() {
        return this._color;
    }

    set color(newColor){
        this._color = new Color(newColor);
    }

    get blur() {
        return this._blur;
    }
}