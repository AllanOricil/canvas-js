import Color from './color.js';
import CanvasImage from '../core/canvasImage.js';

export default class Background {
    constructor({
        color,
        image
    }) {
        this._color = color ? new Color(color) : null;
        this._image = image ? new CanvasImage({
            image
        }) : null;
    }

    set color(newColor){
        this._color = new Color(newColor);
    }

    set Image(newImage){
        this._image = new CanvasImage(newImage);
    }

}