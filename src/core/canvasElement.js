import { syntaxHighlight } from '../utils/json.js';
import Padding from '../styles/padding.js';
import Transform from '../transforms/transform.js';

export default class CanvasElement {

    constructor({
        name,
        padding,
        dimension,
        position,
        rotation,
        parent,
        nonReactiveToIO,
        z
    }, canvas) {
        if(!name) throw new Error('Every Canvas Element must have a name.');
        if(!canvas) throw new Error('Every Canvas Element must be in a Canvas.');
        this._id = +new Date() + Math.random() * 100000;
        this._z = z;
        this._canvas = canvas || undefined;
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
        this._draw = true;
        this._reactToIoEvents = nonReactiveToIO !== false;
    }

    emit(eventName){
        this._canvas._el.dispatchEvent(
            new CustomEvent(
                eventName, 
                {
                    detail: this,
                }
            )
        );
    }

    draw(){}

    clear(){}

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

    select(){}

    deselect(){}

    mousedown(e){}

    click(e){}

    clickout(){}

    dblckick(e){}

    mouseup(e){}

    wheel(e){}

    mousemove({x, y}){}

    mouseenter(e){}

    mouseleave(e){}

    moveToLayer(newLayer){
        this._canvas._canvasElementsManager.moveCanvasElementToLayer(this, newLayer);
    }

    set position({x, y}) {
        this._transform.position = {x, y};
        if(this._shape){
            this._shape._transform.position = {x, y};
        }
    }

    set name(newName){
        this._canvas._canvasElementsManager.getCanvasElementLayerByName(this._name).delete(this._name);
        this._canvas._canvasElementsManager._canvasElementLayerMap.delete(this._name);
        this._name = newName;
        this._canvas._canvasElementsManager.getLayer(this._z).set(this._name, this);
        this._canvas._canvasElementsManager._canvasElementLayerMap.set(newName, this._z);
    }

}