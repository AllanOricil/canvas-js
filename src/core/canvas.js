import Position from '../transforms/position.js';
import Transform from '../transforms/transform.js';
import CanvasElementsManager from './canvasElementsManager.js';
import styles from '../../asssets/css/selection_cursor.css';

export default class Canvas {

    static get SCALE() {
        return {
            horizontal: 1,
            vertical: 1
        };
    }

    static get SCALELIMITS() {
        return {
            max: 2,
            min: 0.2,
            speed: 0.01
        };
    }

    static get FPS() {
        return 60;
    }

    static get CANDRAGCANVAS() {
        return true;
    }

    constructor({
        options,
        canvas
    }) {
        this._canvasElementsManager = new CanvasElementsManager();
        this._dpi = window.devicePixelRatio;
        this._el = canvas || document.getElementById('canvas');
        this._el.style.maxHeight = 'none';
        this._el.classList.add(styles['canvas:focus']);
        this._el.style.cursor = 'grab';
        this._el.style.backgroundImage = options.backgroundImage;
        this._el.style.backgroundColor = options.background && options.background.color ? options.background.color : null;
        this._fps = options.fps ? options.fps : Canvas.FPS;
        this._canMoveCanvasElements = options.canMoveCanvasElements !== false;
        this._canDragCanvas = options.canDragCanvas !== false;
        this._mouse = new Position({
            x: 0,
            y: 0
        });
        this._scaleLimits = options.zoom ? {
            max: options.zoom.max || Canvas.SCALELIMITS.max,
            min: options.zoom.min || Canvas.SCALELIMITS.min,
            speed: options.zoom.speed || Canvas.SCALELIMITS.speed
        } : Canvas.SCALELIMITS;

        this._transform = new Transform({
            position: {
                x: 0,
                y: 0
            },
            dimension: {
                width: this._el.parentElement.clientWidth,
                height: this._el.parentElement.clientHeight
            },
            scale: {
                horizontal: options.zoom.level,
                vertical: options.zoom.level
            }
        });

        this._el.width = this._el.parentElement.clientWidth;
        this._el.height = this._el.parentElement.clientHeight;
        this._el.setAttribute('width', this._el.parentElement.clientWidth);
        this._el.setAttribute('height', this._el.parentElement.clientHeight);

        if (typeof OffscreenCanvas !== "undefined") {
            if ('OffscreenCanvas' in window) {
                this._offscreenCanvas = this._el.transferControlToOffscreen();
            } else {
                this._offscreenCanvas = new OffscreenCanvas(this._transform._dimension.width, this._transform._dimension.height);
            }
            this._ctx = this._offscreenCanvas.getContext('2d');
        } else {
            this._ctx = this._el.getContext('2d');
        }

        this._isSelecting = false;
        this._selectionStartPosition = undefined;
        this._selectionWidth = undefined;
        this._selectionHeight = undefined;
        this._pressingCtrl = false;
        this._dragStartPosition = undefined;
        this._canvasElementDragStartPosition = undefined;
        this._currentTransformedCursor = undefined;
        this._isCanvasBeingDragged = false;
        this._selectedCanvasElements = [];
        this._isCanvasElementBeingDraggedSelected = false;
        this._canvasElementBeingDragged = null;
        this._cancelClick = false;
        this._canvasElementBeingHovered = null;
        
        this._el.addEventListener('mousedown', e => {
            this._el.setAttribute('tabindex', 1);
            if(this._canMoveCanvasElements && this._pressingCtrl){
                this._selectedCanvasElements.forEach((canvasElement) =>  {
                    canvasElement.clickout();
                });
                this._selectedCanvasElements = [];
                this._el.classList.add(styles.selection_cursor);
                this._isSelecting = true;
                this._selectionStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);
            }else{
                if (this._canvasElementBeingHovered &&
                    this._canMoveCanvasElements &&
                    !this._canvasElementBeingDragged &&
                    this._canvasElementBeingHovered._isDraggable
                ) {
                    if(this._selectedCanvasElements.length === 0){
                        this._canvasElementsManager._reactiveCanvasElements.forEach((canvasElement) =>  {
                            canvasElement.clickout(e);
                        });
                    }
                    this._el.style.cursor = 'grabbing';
                    this._canvasElementBeingDragged = this._canvasElementBeingHovered;
                    this._canvasElementDragStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);

                    for (let i = 0; i < this._selectedCanvasElements.length; i++) {
                        let selectedCanvasElement = this._selectedCanvasElements[i];
                        if(selectedCanvasElement._id === this._canvasElementBeingDragged._id){
                            this._isCanvasElementBeingDraggedSelected = true;
                            break;
                        }
                    }

                    if(!this._isCanvasElementBeingDraggedSelected){
                        this._selectedCanvasElements.forEach((canvasElement) =>  {
                            if(canvasElement._id !== this._canvasElementBeingDragged._id) canvasElement.clickout(e);
                        });
                        this._selectedCanvasElements = [];
                    }

                    this._canvasElementBeingHovered.mousedown(e);
                    
                }else{
                    this._canvasElementsManager._reactiveCanvasElements.forEach((canvasElement) =>  {
                        canvasElement.clickout(e);
                    });
                    
                    if(this._selectedCanvasElements.length !== 0) this._selectedCanvasElements = [];

                    if(this._canDragCanvas){
                        this._isCanvasBeingDragged = true;
                        this._el.style.cursor = 'grabbing';
                        this._dragStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);
                    }
                }
            }
            this._isCurrentFrameDirty = true;
        });

        let start = Date.now();
        this._el.addEventListener('mousemove', e => {
            if(Date.now() - start >= 12){
                this._mouse._x = e.offsetX;
                this._mouse._y = e.offsetY;
                this._currentTransformedCursor = this.getTransformedPoint(e.offsetX, e.offsetY);
                if(this._isSelecting){
                    this._selectedCanvasElements = [];
                    this._selectionEndPosition = this._currentTransformedCursor;
                    this._selectionWidth =  this._selectionEndPosition.x - this._selectionStartPosition.x;
                    this._selectionHeight =  this._selectionEndPosition.y - this._selectionStartPosition.y;

                    let _selectionX1 = this._selectionStartPosition.x;
                    let _selectionY1 = this._selectionStartPosition.y;
                    let _selectionX2 = this._selectionEndPosition.x;
                    let _selectionY2 = this._selectionEndPosition.y;
                    
                    if(this._selectionWidth < 0) {
                        const selectionStartXPosition = _selectionX1;
                        _selectionX1 = _selectionX2;
                        _selectionX2 = selectionStartXPosition;
                    };
                    if(this._selectionHeight < 0) {
                        const selectionStartYPosition = _selectionY1;
                        _selectionY1 = _selectionY2;
                        _selectionY2 = selectionStartYPosition;
                    };

                    let nonSelectedCanvasElements = [];
                    for (let i = this._canvasElementsManager._reactiveCanvasElements.length - 1; i >= 0; i--) {
                        let canvasElement = this._canvasElementsManager._reactiveCanvasElements[i];
                        if(
                            !(
                                canvasElement._transform._position.x > _selectionX2 || 
                                canvasElement._transform._position.x + canvasElement._transform._dimension.width < _selectionX1 ||
                                canvasElement._transform._position.y > _selectionY2 || 
                                canvasElement._transform._position.y + canvasElement._transform._dimension.height < _selectionY1
                            )
                        ){
                            this._selectedCanvasElements.push(canvasElement);
                        }else{
                            nonSelectedCanvasElements.push(canvasElement);
                        }
                    }
                    
                    nonSelectedCanvasElements.forEach(nonSelectedCanvasElement => nonSelectedCanvasElement.clickout(e));
                    this._selectedCanvasElements.forEach(selectedCanvasElement => selectedCanvasElement.mousedown(e));
                    this._isCurrentFrameDirty = true;
                }else{
                    if (this._isCanvasBeingDragged) {
                        this._ctx.translate(Math.floor(this._currentTransformedCursor.x - this._dragStartPosition.x), Math.floor(this._currentTransformedCursor.y - this._dragStartPosition.y));                       
                        this._dragStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);
                        this._isCurrentFrameDirty = true;
                    } else {
                        if (this._canvasElementBeingDragged) {
                            this._cancelClick = true;
                            const deltaX = Math.floor(this._currentTransformedCursor.x - this._canvasElementDragStartPosition.x);
                            const deltaY = Math.floor(this._currentTransformedCursor.y - this._canvasElementDragStartPosition.y);
                            if(this._isCanvasElementBeingDraggedSelected){
                                this._selectedCanvasElements.forEach(selectedCanvasElement => {
                                    selectedCanvasElement.mouseDrag({ deltaX, deltaY });
                                });
                            }else{
                                this._canvasElementBeingDragged.mouseDrag({ deltaX, deltaY });
                            }
                            this._canvasElementDragStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);
                            this._isCurrentFrameDirty = true;
                        } else {
                            if(this._canvasElementBeingHovered && this._canvasElementBeingHovered.contains(this._mouse)){
                                this._canvasElementBeingHovered.mousemove(this._mouse);
                                this._isCurrentFrameDirty = true;
                            }else{
                                if(this._canvasElementBeingHovered){
                                    this._canvasElementBeingHovered.mouseleave( this._mouse);
                                    this._canvasElementBeingHovered = null;
                                }
                                for (let i = this._canvasElementsManager._reactiveCanvasElements.length - 1; i >= 0; i--) {
                                    let canvasElement = this._canvasElementsManager._reactiveCanvasElements[i];
                                    if (canvasElement.contains(this._mouse)) {
                                        this._canvasElementBeingHovered = canvasElement;
                                        canvasElement.mouseenter(this._mouse);
                                        break;
                                    }
                                }
                                this._isCurrentFrameDirty = true;
                            }
                        }
                    }
                }
                start = Date.now();
            }
        });

        this._el.addEventListener('mouseup', e => {
            if(this._isSelecting){
                this._isSelecting = false;
                this._selectionWidth = undefined;
                this._selectionHeight = undefined;
                this._el.classList.remove(styles.selection_cursor);
            }else{
                if(this._canvasElementBeingDragged) {
                    this._canvasElementBeingDragged.mouseup(e);
                    this._canvasElementBeingDragged = null;
                }
                this._isCanvasElementBeingDraggedSelected = false;
                this._isCanvasBeingDragged = false;
                this._el.style.cursor = 'grab';
            }
            this._isCurrentFrameDirty = true;
        });

        this._el.addEventListener('click', e => {
            if (this._cancelClick) {
                this._cancelClick = false;
            } else {
                if (this._canvasElementBeingHovered) {
                    this._canvasElementBeingHovered.click(e);
                    this._isCurrentFrameDirty = true;
                }
            }
        });

        this._el.addEventListener('dblclick', e => {
            if (this._cancelClick) {
                this._cancelClick = false;
            } else {
                if (this._canvasElementBeingHovered) {
                    this._canvasElementBeingHovered.dblclick(e);
                    this._isCurrentFrameDirty = true;
                }
            }
        });

        /*this._el.addEventListener('mouseout', e => {
            this._isCanvasBeingDragged = false;
            this._selectedCanvasElements = [];
            this._canvasElementBeingDragged = null;
            this._cancelClick = false;
        });*/
        
        this._el.addEventListener('wheel', e => {
            if(Date.now() - start >= 12){
                this._currentTransformedCursor = this.getTransformedPoint(e.offsetX, e.offsetY);
                const zoom = e.wheelDelta > 0 || e.deltaY < 0 ? (1 + this._scaleLimits.speed) : (1 - this._scaleLimits.speed);
                const futureZoomLevel = this._ctx.getTransform().a * zoom;

                if(this._canvasElementBeingHovered){
                    this._canvasElementBeingHovered.wheel(e);
                }else{
                    if(futureZoomLevel > this._scaleLimits.min && futureZoomLevel < this._scaleLimits.max){
                        this._ctx.translate(this._currentTransformedCursor.x, this._currentTransformedCursor.y);
                        this._ctx.scale(zoom, zoom);
                        this._ctx.translate(-this._currentTransformedCursor.x, -this._currentTransformedCursor.y);
                        this._isCurrentFrameDirty = true;
                    }
                }
                start = Date.now();
                this._isCurrentFrameDirty = true;
            }
        },  {passive: true});

        this._el.addEventListener('keydown', e => {
            if(!this._isCanvasBeingDragged && !this._canvasElementBeingDragged && e.ctrlKey){
                this._pressingCtrl = true;
                this._el.classList.add(styles.selection_cursor);
            }
        });

        this._el.addEventListener('keyup', e => {
            this._pressingCtrl = false;
            if(!this._isSelecting) this._el.classList.remove(styles.selection_cursor);
        });

        this._el.addEventListener("focusout", ()=>{
            this._selectedCanvasElements.forEach(selectedCanvasElement =>  selectedCanvasElement._selected = false);
            this._isSelecting = false;
            this._selectionStartPosition = undefined;
            this._selectionWidth = undefined;
            this._selectionHeight = undefined;
            this._pressingCtrl = false;
            this._dragStartPosition = undefined;
            this._canvasElementDragStartPosition = undefined;
            this._currentTransformedCursor = undefined;
            this._isCanvasBeingDragged = false;
            this._selectedCanvasElements = [];
            this._canvasElementBeingDragged = null;
            this._cancelClick = false;
            this._canvasElementBeingHovered = null;

            this._el.removeAttribute('tabindex');
            this._el.classList.remove(styles.selection_cursor);
            this._isCurrentFrameDirty = true;
        });

        const resizeClientWindow = e => {
            this._transform._dimension.width = this._el.parentElement.clientWidth;
            this._transform._dimension.height = this._el.parentElement.clientHeight;
            if (this._offscreenCanvas) {
                this._offscreenCanvas.width = this._transform._dimension.width;
                this._offscreenCanvas.height = this._transform._dimension.height;
            } else {
                this._el.width = this._transform._dimension.width;
                this._el.height = this._transform._dimension.height;
            }
            this._isCurrentFrameDirty = true;
        };

        window.onresize = resizeClientWindow;
        this._isCurrentFrameDirty = true;
        this._el.focus();
        this.start();
    }

    start(){
        setInterval(()=>{
            this._el.focus();
            if(this._isCurrentFrameDirty){
                this.draw();
                this._isCurrentFrameDirty = false;
            }
        }, 1000/this._fps);
    }

    draw() {
        this._ctx.save();
        this._ctx.setTransform(1,0,0,1,0,0);
        this._ctx.clearRect(0,0, this._el.width, this._el.height);
        this._ctx.restore();
        const canvasElementsToDraw =  this._canvasElementsManager._canvasElementsToDraw;
        for(let i = 0; i < canvasElementsToDraw.length; i++){
            const canvasElement = canvasElementsToDraw[i];
            canvasElement.draw(this._ctx);
        }

        if(this._isSelecting){
            this._ctx.save();
            this._ctx.lineWidth = 3;
            this._ctx.setLineDash([5,5]);
            this._ctx.strokeStyle = 'rgba(0,0,255,0.3)';
            this._ctx.fillStyle = 'rgba(0,0,255,0.02)';
            this._ctx.fillRect(this._selectionStartPosition.x, this._selectionStartPosition.y, this._selectionWidth, this._selectionHeight);
            this._ctx.strokeRect(this._selectionStartPosition.x, this._selectionStartPosition.y, this._selectionWidth, this._selectionHeight);
            this._ctx.restore();
        }
    }

    getTransformedPoint(x, y) {
        const transform = this._ctx.getTransform();
        const inverseZoom = 1 / transform.a;
        const transformedX = inverseZoom * x - inverseZoom * transform.e;
        const transformedY = inverseZoom * y - inverseZoom * transform.f;
        return { x: Math.floor(transformedX), y: Math.floor(transformedY) };
    }

    saveAsImage(name) {
        var link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = this._el.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
    }

    saveAsImage2(name) {
        const canvasOutput = document.createElement('canvas');
        canvasOutput.width = 10 * this._el.width;
        canvasOutput.height = 10 * this._el.height;
        const ctxOutput = canvasOutput.getContext('2d');
        const currentTransform = this._ctx.getTransform();
        this._ctx.setTransform(1, 0 , 0, 1, 0, 0);
        ctxOutput.drawImage(this._el, 0, 0);
        this._ctx.setTransform(currentTransform);
        const link = document.createElement('a');
        link.download = `canvas.png`;
        link.href = canvasOutput.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
    }


}