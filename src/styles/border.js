import Color from './color.js';
export default class Border {
    constructor({
        radius,
        color,
        lineWidth,
        selected,
        hover
    }) {
        this._radius = radius || 0;
        this._lineWidth = lineWidth || 0;
        this._color = color ? new Color(color) : null;
        this._selected = selected ? new Border({
            lineWidth: selected.lineWidth,
            color: selected.color
        }) : null;
        this._hover = hover ? new Border({
            lineWidth: hover.lineWidth,
            color: hover.color
        }) : null;
    }

    get radius() {
        return this._radius;
    }

    set radius(newValue) {
        this._radius = newValue;
    }

    get color() {
        return this._color;
    }

    set color(newColor) {
        this._color = new Color(newColor);
    }

    get selected() {
        return this._selected;
    }

    get hover() {
        return this._hover;
    }

    get lineWidth() {
        return this._lineWidth;
    }

    set lineWidth(newLineWidth){
        this._lineWidth = newLineWidth;
    }
}