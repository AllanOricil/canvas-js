export default class Dimension {

    constructor({
        width,
        height
    }) {
        this._width = width;
        this._height = height;
    }

    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }

    set width(newWidth){
        this._width = newWidth;
    }

    set height(newHeight){
        this._height = newHeight;
    }
}