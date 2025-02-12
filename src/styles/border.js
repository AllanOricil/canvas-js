import Color from './color.js';
export default class Border {

    static get SMALL(){
        return new Border({
            radius: 0,
            lineWidth: 1
        });
    }

    constructor({
        radius,
        color,
        lineWidth
    }) {
        this._radius = radius || 0;
        this._lineWidth = lineWidth || 0;
        this._color = color ? new Color(color) : null;
    }

    set color(newColor) {
        this._color = new Color(newColor);
    }
}