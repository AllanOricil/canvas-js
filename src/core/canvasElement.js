import { syntaxHighlight } from '../utils/json.js';
import Position from '../transforms/position.js';
import Padding from '../styles/padding.js';
import Transform from '../transforms/transform.js';
import EventEmitter from './eventEmitter.js';

export default class CanvasElement {

    constructor({
        name,
        padding,
        dimension,
        position,
        rotation,
        parent
    }, canvas) {
        this._eventEmitter = new EventEmitter();
        this._id = +new Date() + Math.random() * 100000;
        this._name = name;
        this._selected = false;
        this._hover = false;
        this._transform = new Transform({
            position: position || undefined,
            dimension: dimension || undefined,
            rotation: rotation || undefined
        });
        this._oldPosition = position ? new Position(position) : undefined;
        this._padding = padding ? new Padding(padding) : undefined;
        this._parent = parent || undefined;
        this._children = [];
        this._canvas = canvas || undefined;
        this._draw = true;
    }

    createEvent(event) {
        return new CustomEvent(event, {
            detail: this,
        });
    }

    contains(point) {
        if(this._shape)
            return this._canvas.ctx.isPointInPath(this._shape.path, point.x, point.y, 'nonzero');
        else 
            return false;
    }

    toString(){
        return {
            id: this._id,
            name: this._name
        };
    }

    prettier() {
        return syntaxHighlight(this.toString());
    }

    on(event, callback) {
        this._eventEmitter.on(event, callback);
    }

    emit(event, data) {
        this._eventEmitter.emit(event, data);
    }

    set state(newState) {
        if (this.states.includes(newState))
            this.emit(newState, {
                detail: this
            });
    }

    get shape() {
        return this._shape;
    }

    get padding() {
        return this._padding;
    }

    get dimension() {
        return this._transform.dimension;
    }

    get position() {
        return this._transform.position;
    }

    get children() {
        return this._children;
    }

    get parent() {
        return this._parent;
    }

    set position(newValue) {
        this._oldPosition = new Position(this._transform.position);
        this._transform.position.x = newValue.x;
        this._transform.position.y = newValue.y;
    }

    get oldPosition() {
        return this._oldPosition;
    }
}