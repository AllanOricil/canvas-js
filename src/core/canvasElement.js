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
        parent,
        nonReactiveToIO,
    }, canvas) {
        if(!name) throw new Error('Every Canvas Element must have a name.');
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
        this._padding = padding ? new Padding(padding) : Padding.NONE;
        this._parent = parent || undefined;
        this._children = [];
        this._canvas = canvas || undefined;
        this._draw = true;
        this._reactToIoEvents = nonReactiveToIO !== false;
    }

    createEvent(event) {
        return new CustomEvent(event, {
            detail: this,
        });
    }

    contains(point) {
        if(this._shape && this._shape._path)
            return this._canvas._ctx.isPointInPath(this._shape._path, point.x, point.y, 'nonzero');
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

    set position({x, y}) {
        this._transform.position = {x, y};
        if(this._shape){
            this._shape._transform.position = {x, y};
        }
    }

}