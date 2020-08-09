export default class Padding {

    static get NONE(){
        return new Padding({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });
    }

    constructor({
        top,
        right,
        bottom,
        left
    }) {
        this._top = top;
        this._right = right;
        this._bottom = bottom;
        this._left = left;
    }

}