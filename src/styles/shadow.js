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

    set color(newColor){
        this._color = new Color(newColor);
    }
}