export default class CanvasElementsManager {

    constructor() {
        this._canvasElementMap = new Map();
        [...Array(100).keys()].forEach(layer => {
            this._canvasElementMap.set(layer, new Map());
        });
        this._canvasElementLayerMap = new Map();
    }

    getLayer(z) {
        return this._canvasElementMap.get(z);
    }

    getCanvasElementLayerByName(name) {
        return this.getLayer(this._canvasElementLayerMap.get(name));
    }

    getCanvasElementByName(name) {
        const layer = this.getCanvasElementLayerByName(name);
        const entity = layer.get(name);
        return entity;
    }

    addCanvasElement(entity, canvas) {
        entity._canvas = canvas;
        const layer = this.getLayer(entity._z || 0);
        layer.set(entity._name, entity);
        this._canvasElementLayerMap.set(entity._name, entity._z);
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

    get canvasElements() {
        let canvasElementsToDraw = [];
        for (let [layer, layerCanvasElements] of this._canvasElementMap.entries()) {
            layerCanvasElements.forEach(canvasElement => {
                if(canvasElement._draw) canvasElementsToDraw.push(canvasElement);
            });
        }
        return canvasElementsToDraw;
    }
}