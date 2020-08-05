import Position from "./position";
import Dimension from "./dimension";
import Rotation from "./rotation";
import Scale from "./scale";

export default class Transform {

    static get POSITION() {
        return new Position({
            x: 0,
            y: 0
        });
    }

    static get DIMENSION() {
        return new Dimension({
            width: 0,
            height: 0,
        });
    }

    static get ROTATION() {
        return new Rotation({
            angle: 0
        });
    }

    static get SCALE() {
        return new Scale({
            horizontal: 1,
            vertical: 1
        });
    }

    constructor({
        position,
        dimension,
        rotation,
        scale
    }) {
        this._position = position ? new Position(position) : Transform.POSITION;
        this._dimension = dimension ? new Dimension(dimension) : Transform.DIMENSION;
        this._rotation = rotation ? new Rotation(rotation) : Transform.ROTATION;
        this._scale = scale ? new Scale(scale) : Transform.SCALE;

        this._oldPosition = new Position(this._position);
        this._oldDimension = new Dimension(this._dimension);
        this._oldRotation = new Rotation(this._rotation) ;
        this._oldScale = new Scale(this._scale);
    }

    set position({x, y}) {
        this._oldPosition._x = this._position._x;
        this._oldPosition._y = this._position._y;
        this._position._x = x;
        this._position._y = y;
    }

    set dimension({width, height}) {
        this._oldDimension.width = this._dimension._width;
        this._oldDimension.height = this._dimension._height;
        this._dimension.width = width;
        this._dimension.height = height;
    }

    set rotation({angle}) {
        this._oldRotation._angle = this._rotation._angle;
        this._rotation._angle = angle;
    }

    set scale({horizontal, vertical}) {
        this._oldScale._horizontal = this._scale._horizontal;
        this._oldScale._vertical = this._scale._vertical;
        this._scale._horizontal = horizontal;
        this._scale._vertical = vertical;
    }

    get oldTransform(){
        return {
            position: this._oldPosition,
            dimension: this._oldDimension,
            rotation: this._oldRotation,
            scale: this._oldScale
        };
    }

}