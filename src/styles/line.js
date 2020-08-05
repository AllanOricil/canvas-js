import Color from "./color";

export default class Line {
    constructor({
        weight,
        color,
        enableBezierCurves,
        dashed,
        lineCap
    }) {
        this._weight = weight;
        this._color = new Color(color);
        this._enableBezierCurves = enableBezierCurves;
        this._dashed = dashed;
        this._lineCap = lineCap || 'round';
    }
}