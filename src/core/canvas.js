import Position from '../transforms/position.js';
import Transform from '../transforms/transform.js';
import CanvasElementsManager from './canvasElementsManager.js';

export default class Canvas {

    static get EVENT_LISTENER_LOOP_TIME(){ return 12; };

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

    static get CANMOVEENTITIES() {
        return true;
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
        this._el.focus();
        this._imagesSource = options.imagesSource;
        this._el.style.backgroundImage = options.backgroundImage;
        this._el.style.backgroundColor = options.background && options.background.color ? options.background.color : null;
        this._fps = options.fps ? options.fps : Canvas.FPS;
        this._canMoveEntities = options.canMoveEntities !== false;
        this._canDragCanvas = options.canDragCanvas ? options.canDragCanvas : Canvas.CANDRAGCANVAS;
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

        this._isScrolling = false;
        this._tickTime = 0;
        this._updateTime = 0;
        this._drawTime = 0;

        let _dragStartPosition = {x: 0, y: 0};
        let _currentTransformedCursor = undefined;
        let _isCanvasBeingDragged = false;
        let _selectedEntities = [];
        let _canvasElementBeingDragged = null;
        let _cancelClick = false;
        let _canvasElementBeingHovered = null;
        
        this._el.addEventListener('mousedown', e => {
            if (_canvasElementBeingHovered) {
                if (
                    this._canMoveEntities &&
                    !_canvasElementBeingDragged &&
                    _canvasElementBeingHovered._isDraggable
                ) {
                    _canvasElementBeingDragged = _canvasElementBeingHovered;
                }
            }else{
                _dragStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);
                _isCanvasBeingDragged = true;
            }
        });

        let startDateMouseMove = Date.now();
        this._el.addEventListener('mousemove', e => {
            if(Date.now() - startDateMouseMove >= Canvas.EVENT_LISTENER_LOOP_TIME){
                this._mouse._x = e.offsetX;
                this._mouse._y = e.offsetY;
                _currentTransformedCursor = this.getTransformedPoint(e.offsetX, e.offsetY);
                if (_isCanvasBeingDragged) {
                    this._el.style.cursor = 'grabbing';
                    this._ctx.translate(_currentTransformedCursor.x - _dragStartPosition.x, _currentTransformedCursor.y - _dragStartPosition.y);
                    this._isCurrentFrameDirty = true;
                } else {
                    if (_canvasElementBeingDragged) {
                        _cancelClick = true;
                        _canvasElementBeingDragged.emit('mousedrag', this._mouse);
                        this._isCurrentFrameDirty = true;
                    } else {
                        if(_canvasElementBeingHovered && _canvasElementBeingHovered.contains(this._mouse)){
                            _canvasElementBeingHovered.emit('mousemove', this._mouse);
                            this._isCurrentFrameDirty = true;
                        }else{
                            if(_canvasElementBeingHovered){
                                _canvasElementBeingHovered.emit('mouseleave', this._mouse);
                                _canvasElementBeingHovered = null;
                                this._isCurrentFrameDirty = true;
                            }
                            this._el.style.cursor = 'default';
                            for (let i = this._canvasElementsManager._reactiveCanvasElements.length - 1; i >= 0; i--) {
                                let canvasElement = this._canvasElementsManager._reactiveCanvasElements[i];
                                if (canvasElement.contains(this._mouse)) {
                                    this._el.style.cursor = 'grabbing';
                                    _canvasElementBeingHovered = canvasElement;
                                    canvasElement.emit('mouseenter', this._mouse);
                                    this._isCurrentFrameDirty = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                startDateMouseMove = Date.now();
            }
        });

        this._el.addEventListener('mouseup', e => {
            _isCanvasBeingDragged = false;
            _canvasElementBeingDragged = null;
        } ,{passive: true});

        this._el.addEventListener('click', e => {
            if (_cancelClick) {
                _cancelClick = false;
            } else {
                if (_canvasElementBeingHovered) {
                    _canvasElementBeingHovered.emit('click');
                    _canvasElementBeingHovered._selected = true;
                    this._el.dispatchEvent(_canvasElementBeingHovered.createEvent('clickentity'));
                    if (_selectedEntities.length === 0) {
                        _selectedEntities.push(_canvasElementBeingHovered);
                    } else {
                        _selectedEntities.forEach(selectedEntity => {
                            if (selectedEntity._id !== _canvasElementBeingHovered._id) {
                                _selectedEntities.push(_canvasElementBeingHovered);
                            }
                        });
                    }

                    if (_selectedEntities.length == 2) {
                        let secondSelectedEntity = _selectedEntities.pop();
                        let firstdSelectedEntity = _selectedEntities.pop();

                        //this avoids bidirectional connection
                        let conetionAlreadyExists = false;
                        //verify connection from -> to
                        for (
                            let i = 0; i < firstdSelectedEntity.connections.length; i++
                        ) {
                            let connection =
                                firstdSelectedEntity.connections[i];
                            if (
                                connection.to._id ===
                                secondSelectedEntity._id
                            ) {
                                conetionAlreadyExists = true;
                                break;
                            }
                        }

                        //verify connection to -> from
                        for (
                            let i = 0; i < secondSelectedEntity.connections.length; i++
                        ) {
                            let connection =
                                secondSelectedEntity.connections[i];
                            if (
                                connection.to._id ===
                                firstdSelectedEntity._id
                            ) {
                                conetionAlreadyExists = true;
                                break;
                            }
                        }

                        /*if (!conetionAlreadyExists) {
                            firstdSelectedEntity.addConnection({
                                to: secondSelectedEntity,
                            });
                        }*/
                        _selectedEntities = [];
                    }
                    return;
                }
            }

        },  {passive: true});

        this._el.addEventListener('mouseout', e => {
            _isCanvasBeingDragged = false;
            _selectedEntities = [];
            _canvasElementBeingDragged = null;
            _cancelClick = false;
        }, {passive: true});

        this._el.addEventListener('wheel', e => {
            _currentTransformedCursor = this.getTransformedPoint(e.offsetX, e.offsetY);
            const zoom = e.wheelDelta > 0 || e.deltaY < 0 ? (1 + this._scaleLimits.speed) : (1 - this._scaleLimits.speed);
            const futureZoomLevel = this._ctx.getTransform().a * zoom;

            if(_canvasElementBeingHovered){
                _canvasElementBeingHovered.emit('wheel', e);
                this._isCurrentFrameDirty = true;
            }else{
                if(futureZoomLevel > this._scaleLimits.min && futureZoomLevel < this._scaleLimits.max){
                    this._ctx.translate(_currentTransformedCursor.x, _currentTransformedCursor.y);
                    this._ctx.scale(zoom, zoom);
                    this._ctx.translate(-_currentTransformedCursor.x, -_currentTransformedCursor.y);
                    this._isCurrentFrameDirty = true;
                }
            }

        },  {passive: true});

        let previousTouchStartTimestamp = null;
        this._el.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                this._mouse._x = e.touches[0].clientX;
                this._mouse._y = e.touches[0].clientY;

                for (let i = this._canvasElementsManager.canvasElements.length - 1; i >= 0; i--) {
                    let entity = this._canvasElementsManager.canvasElements[i];
                    if (entity.contains(this._mouse)) {
                        _canvasElementBeingHovered = entity;
                        if (!_canvasElementBeingDragged) {
                            _canvasElementBeingDragged = entity;
                        }
                        this._el.dispatchEvent(
                            entity.createEvent('touchstartentity')
                        );
                        return;
                    }
                }
                _isCanvasBeingDragged = true;

                if (previousTouchStartTimestamp) {
                    console.log(
                        e.timeStamp - previousTouchStartTimestamp.timeStamp
                    );
                    if (
                        e.timeStamp - previousTouchStartTimestamp.timeStamp <=
                        200
                    ) {
                        this._el.dispatchEvent(new CustomEvent('dbtouch', e));
                    }
                }

                previousTouchStartTimestamp = e;
            }
        }, {passive: true});

        let previousTouchEvent = null;
        this._el.addEventListener('touchmove', e => {
            console.log('TOUCH MOVE');
            if (e.touches.length === 1) {
                this._mouse._x = e.touches[0].clientX;
                this._mouse._y = e.touches[0].clientY;
                _currentTransformedCursor = this.getTransformedPoint(this._mouse._x, this._mouse._y);
                if (_isCanvasBeingDragged && previousTouchEvent) {
                    let _previousTransformedCursor = 
                        this.getTransformedPoint(
                            previousTouchEvent.touches[0].clientX, 
                            previousTouchEvent.touches[0].clientY
                        );
                    this._ctx.translate(
                        _currentTransformedCursor.x - _previousTransformedCursor.x,
                        _currentTransformedCursor.y - _previousTransformedCursor.y
                    );
                } else {
                    if (_canvasElementBeingDragged) {
                        _cancelClick = true;
                        _canvasElementBeingDragged.position = {
                            x: _currentTransformedCursor.x - _canvasElementBeingDragged._transform._dimension.width / 2,
                            y: _currentTransformedCursor.y - _canvasElementBeingDragged._transform._dimension.height / 2
                        };
                    }
                }

                previousTouchEvent = e;
            }
        },  {passive: true});

        this._el.addEventListener('touchend', e => {
            if (_canvasElementBeingDragged) {
                _canvasElementBeingDragged = null;
            }
            _isCanvasBeingDragged = false;
            previousTouchEvent = null;
        }, {passive: true});

        this._evCache = [];
        this.prevDiff = -1;

        const pointerdown_handler = ev => {
            this._evCache.push(ev);
        };

        const pointermove_handler = ev => {
            for (var i = 0; i < this._evCache.length; i++) {
                if (ev.pointerId == this._evCache[i].pointerId) {
                    this._evCache[i] = ev;
                    break;
                }
            }

            if (this._evCache.length == 2) {
                var curDiff = Math.abs(
                    this._evCache[0].clientX - this._evCache[1].clientX
                );
                
                const middleX = (this._evCache[0].clientX + this._evCache[1].clientX)/2;
                const middleY = (this._evCache[0].clientY + this._evCache[1].clientY)/2;
                const zoomPoint = this.getTransformedPoint(middleX, middleY);
                if (this.prevDiff > 0) {
                    const zoom = curDiff > this.prevDiff < 0 ? (1 + this._scaleLimits.speed) : (1 - this._scaleLimits.speed);
                    const futureZoomLevel = this._ctx.getTransform().a * zoom;
                    if(futureZoomLevel > this._scaleLimits.min && futureZoomLevel < this._scaleLimits.max){
                        this._ctx.translate(zoomPoint.x, zoomPoint.y);
                        this._ctx.scale(zoom, zoom);
                        this._ctx.translate(-zoomPoint.x, -zoomPoint.y);
                    }
                }

                this.prevDiff = curDiff;
            }
        };

        const pointerup_handler = ev => {
            remove_event(ev);
            if (this._evCache.length < 2) {
                this.prevDiff = -1;
            }
        };

        const remove_event = ev => {
            for (var i = 0; i < this._evCache.length; i++) {
                if (this._evCache[i].pointerId == ev.pointerId) {
                    this._evCache.splice(i, 1);
                    break;
                }
            }
        };

        this._el.onpointerdown = pointerdown_handler;
        this._el.onpointermove = pointermove_handler;
        this._el.onpointerup = pointerup_handler;
        this._el.onpointercancel = pointerup_handler;
        this._el.onpointerout = pointerup_handler;
        this._el.onpointerleave = pointerup_handler;


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

            this.draw();
        };

        window.onresize = resizeClientWindow;

        this._isCurrentFrameDirty = true;
        this.start();
    }

    start(){
        setInterval(()=>{
            if(this._isCurrentFrameDirty){
                this.draw();
                this._isCurrentFrameDirty = false;
            }
        }, 1000/this._fps);
    }

    clearFrame() {
        this._ctx.save();
        this._ctx.setTransform(1,0,0,1,0,0);
        this._ctx.clearRect(0,0, this._el.width, this._el.height);
        this._ctx.restore();
    }

    draw() {
        this.clearFrame();
        this._canvasElementsManager._canvasElementsToDraw.forEach(canvasElement => {
            canvasElement.draw(this._ctx);
        });
    }

    getTransformedPoint(x, y) {
        const transform = this._ctx.getTransform();
        const inverseZoom = 1 / transform.a;
        const transformedX = inverseZoom * x - inverseZoom * transform.e;
        const transformedY = inverseZoom * y - inverseZoom * transform.f;
        return { x: transformedX, y: transformedY };
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


    get ctx() {
        return this._ctx;
    }

    get canvasElementsManager() {
        return this._canvasElementsManager;
    }

}