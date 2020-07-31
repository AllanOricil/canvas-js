import Color from './color.js';
import {
    getTextHeight
} from '../utils/font.js';
export default class Font {

    static get FONT(){
        return {
            family: 'Arial',
            style: 'normal',
            variant: 'normal',
            color: 'rgb(212,212,212)',
            size: 50,
            weight: 'bold',
        };
    }

    constructor({
        family,
        style,
        variant,
        color,
        size,
        weight
    }) {
        this._family = family;
        this._style = style;
        this._variant = variant;
        this._color = new Color(color);
        this._size = size;
        this._weight = weight;
        this._setFontDimensions();
    }

    set family(newValue) {
        this._family = newValue;
        this._setFontDimensions();
    }

    set fontSize(newValue) {
        this._fontSize = newValue;
        this._setFontDimensions();
    }

    set fontWeight(newValue) {
        this._fontSize = newValue;
        this._setFontDimensions();
    }

    get font2Canvas() {
        return `${this._style || ''} ${this._variant || ''} ${this._weight || ''} ${this._size ? this._size + 'px' : ''} ${this._family || ''}`;
    }

    get family() {
        return this._family;
    }

    get style() {
        return this._style;
    }

    get variant() {
        return this._variant;
    }

    get color() {
        return this._color;
    }

    set color(newColor){
        this._color = new Color(newColor);
    }

    get size() {
        return this._size;
    }

    get weight() {
        return this._weight;
    }

    get dimensions() {
        return this._dimensions;
    }

    _setFontDimensions() {
        this._dimensions = getTextHeight({
            fontFamily: this._family,
            fontSize: this._size,
            fontWeight: this._weight,
        });
    }
}