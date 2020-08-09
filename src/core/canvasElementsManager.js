export default class CanvasElementsManager {

    constructor() {
        this._canvasElementMap = new Map();
        [...Array(100).keys()].forEach(layer => {
            this._canvasElementMap.set(layer, new Map());
        });
        this._canvasElementLayerMap = new Map();

        this._canvasElementsToDraw = [];
        this._reactiveCanvasElements = [];
    }

    getLayer(z) {
        return this._canvasElementMap.get(z);
    }

    getCanvasElementLayerByName(name) {
        return this.getLayer(this._canvasElementLayerMap.get(name));
    }

    getCanvasElementByName(name) {
        const layer = this.getCanvasElementLayerByName(name);
        return layer ? layer.get(name) : null;
    }

    addCanvasElement(entity) {
        const layer = this.getLayer(entity._z || 0);
        layer.set(entity._name, entity);
        this._canvasElementLayerMap.set(entity._name, entity._z);
        this._setReactiveAndToDrawCanvasElements();
    }

    removeCanvasElementByName(name) {
        const entityLayer = this.getCanvasElementLayerByName(name);
        return entityLayer.delete(name);
    }

    clearLayer(z) {
        const layer = this.getLayer(z);
        if (layer) layer.clear();
    }

    getCanvasElementsInLayer(z){
        return this.getLayer(z).values();
    }

    moveCanvasElementToLayer(canvasElement, newLayer){
        this.removeCanvasElementByName(canvasElement._name);
        canvasElement._z = newLayer;
        this.addCanvasElement(canvasElement);
        this._setReactiveAndToDrawCanvasElements();
    }

    _setReactiveAndToDrawCanvasElements(){
        this._reactiveCanvasElements = [];
        this._canvasElementsToDraw = [];
        for (let [layer, layerCanvasElements] of this._canvasElementMap.entries()) {
            layerCanvasElements.forEach(canvasElement => {
                if(canvasElement._draw) this._canvasElementsToDraw.push(canvasElement);
                if(canvasElement._reactToIoEvents) this._reactiveCanvasElements.push(canvasElement);
            });
        }
    }
}