import Color from './color.js';
import {
    getTextHeight
} from '../utils/font.js';
export default class Font {

    static get ARIAL(){
        return new Font({
            family: 'Arial',
            style: 'normal',
            variant: 'normal',
            color: 'black',
            size: 15,
            weight: 'normal'
        });
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

    set color(newColor){
        this._color = new Color(newColor);
    }

    _setFontDimensions() {
        this._dimensions = getTextHeight({
            fontFamily: this._family,
            fontSize: this._size,
            fontWeight: this._weight,
        });
    }
}