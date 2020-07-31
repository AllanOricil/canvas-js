import Position from '../transforms/position.js';
import Transform from '../transforms/transform.js';
import EntityManager from './entityManager.js';
import * as GridSVG from '../../resources/images/grid.svg';

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

    static get BACKGROUND() {
        return 'transparent';
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
        this._entityManager = new EntityManager();
        this._dpi = window.devicePixelRatio;
        this._el = canvas || document.getElementById('canvas');
        this._el.style.maxHeight = 'none';
        this._el.focus();
        this._imagesSource = options.imagesSource;
        if(options.drawGrid) this._el.style.backgroundImage = `url('${this._imagesSource ? this._imagesSource + "/" : ""}${GridSVG.default}')`;
        this._el.style.backgroundColor = options && options.background ? options.background.color : Canvas.BACKGROUND;
        this._fps = options && options.fps ? options.fps : Canvas.FPS;
        this._canMoveEntities = options.canMoveEntities !== false;
        this._canDragCanvas = options && options.canDragCanvas ? options.canDragCanvas : Canvas.CANDRAGCANVAS;
        this._mouse = new Position({
            x: 0,
            y: 0
        });
        this._scaleLimits = options && options.zoom ? {
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
                this._offscreenCanvas = new OffscreenCanvas(this._transform.dimension.width, this._transform.dimension.height);
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
        let _entityBeingDragged = null;
        let _cancelClick = false;
        let _entityBeingHovered = null;
        
    
        this._el.addEventListener('mousedown', e => {
            if (_entityBeingHovered) {
                _entityBeingHovered._selected = true;
                if (
                    this._canMoveEntities &&
                    !_entityBeingDragged &&
                    _entityBeingHovered._isDraggable
                ) {
                    _entityBeingDragged = _entityBeingHovered;
                }
                return;
            }

            _dragStartPosition = this.getTransformedPoint(e.offsetX, e.offsetY);
            _isCanvasBeingDragged = true;
        });

        this._el.addEventListener('mousemove', e => {
            this._mouse.x = e.offsetX;
            this._mouse.y = e.offsetY;
            _currentTransformedCursor = this.getTransformedPoint(e.offsetX, e.offsetY);
            if (_isCanvasBeingDragged) {
                this._el.style.cursor = 'grabbing';
                this._ctx.translate(_currentTransformedCursor.x - _dragStartPosition.x, _currentTransformedCursor.y - _dragStartPosition.y);
                return;
            } else {
                if (_entityBeingDragged) {
                    _cancelClick = true;
                    _entityBeingDragged.position = {
                        x: _currentTransformedCursor.x - _entityBeingDragged.dimension.width / 2,
                        y: _currentTransformedCursor.y - _entityBeingDragged.dimension.height / 2,
                    };
                    return;
                } else {
                    for (let i = this._entityManager.entities.length - 1; i >= 0; i--) {
                        let entity = this._entityManager.entities[i];
                        if (entity.contains(this._mouse)) {
                            entity.emit('mousemove', e);
                            _entityBeingHovered = entity;
                            this._el.style.cursor = 'grabbing';
                            if (!entity._hover) {
                                entity._hover = true;
                                this._el.dispatchEvent(
                                    new CustomEvent('mouseenterentity', {
                                        detail: entity,
                                    })
                                );
                                entity.emit('mousehover', e);
                                entity.emit('hover', e);
                            }
                            return;
                        } else {
                            if (entity._hover) {
                                entity._hover = false;
                                this._el.dispatchEvent(
                                    new CustomEvent('mouseleaveentity', {
                                        detail: entity,
                                    })
                                );
                                entity.emit('mouseleave', e);
                            }
                        }
                    }
                    _entityBeingHovered = null;
                    this._el.style.cursor = 'default';
                }
            }

            this._el.style.cursor = 'default';
        });

        this._el.addEventListener('mouseup', e => {
            _isCanvasBeingDragged = false;
            if (_entityBeingDragged) {
                _entityBeingDragged._selected = false;
                _entityBeingDragged = null;
            }
        } ,{passive: true});

        this._el.addEventListener('click', e => {
            if (_cancelClick) {
                _cancelClick = false;
            } else {
                if (_entityBeingHovered) {
                    _entityBeingHovered.emit('click');
                    _entityBeingHovered._selected = true;
                    this._el.dispatchEvent(_entityBeingHovered.createEvent('clickentity'));
                    if (_selectedEntities.length === 0) {
                        _selectedEntities.push(_entityBeingHovered);
                    } else {
                        _selectedEntities.forEach(selectedEntity => {
                            if (selectedEntity._id !== _entityBeingHovered._id) {
                                _selectedEntities.push(_entityBeingHovered);
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
            _entityBeingDragged = null;
            _cancelClick = false;
        }, {passive: true});

        this._el.addEventListener('wheel', e => {
            _currentTransformedCursor = this.getTransformedPoint(e.offsetX, e.offsetY);
            const zoom = e.wheelDelta > 0 || e.deltaY < 0 ? (1 + this._scaleLimits.speed) : (1 - this._scaleLimits.speed);
            const futureZoomLevel = this._ctx.getTransform().a * zoom;

            
            if(_entityBeingHovered){
                _entityBeingHovered.emit('wheel', e);
                return;
            }else{
                if(futureZoomLevel > this._scaleLimits.min && futureZoomLevel < this._scaleLimits.max){
                    this._ctx.translate(_currentTransformedCursor.x, _currentTransformedCursor.y);
                    this._ctx.scale(zoom, zoom);
                    this._ctx.translate(-_currentTransformedCursor.x, -_currentTransformedCursor.y);
                }
            }
        },  {passive: true});

        let previousTouchStartTimestamp = null;
        this._el.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                this._mouse.x = e.touches[0].clientX;
                this._mouse.y = e.touches[0].clientY;

                for (let i = this._entityManager.entities.length - 1; i >= 0; i--) {
                    let entity = this._entityManager.entities[i];
                    if (entity.contains(this._mouse)) {
                        _entityBeingHovered = entity;
                        if (!_entityBeingDragged) {
                            _entityBeingDragged = entity;
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
                this._mouse.x = e.touches[0].clientX;
                this._mouse.y = e.touches[0].clientY;
                _currentTransformedCursor = this.getTransformedPoint(this._mouse.x, this._mouse.y);
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
                    if (_entityBeingDragged) {
                        _cancelClick = true;
                        _entityBeingDragged.position = {
                            x: _currentTransformedCursor.x - _entityBeingDragged.dimension.width / 2,
                            y: _currentTransformedCursor.y - _entityBeingDragged.dimension.height / 2
                        };
                    }
                }

                previousTouchEvent = e;
            }
        },  {passive: true});

        this._el.addEventListener('touchend', e => {
            if (_entityBeingDragged) {
                _entityBeingDragged = null;
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
            this._transform.dimension.width = this._el.parentElement.clientWidth;
            this._transform.dimension.height = this._el.parentElement.clientHeight;
            if (this._offscreenCanvas) {
                this._offscreenCanvas.width = this._transform.dimension.width;
                this._offscreenCanvas.height = this._transform.dimension.height;
            } else {
                this._el.width = this._transform.dimension.width;
                this._el.height = this._transform.dimension.height;
            }
        };

        window.onresize = resizeClientWindow;

        this.start();
    }

    clearFrame() {
        this._ctx.save();
        this._ctx.setTransform(1,0,0,1,0,0);
        this._ctx.clearRect(0,0, this._el.width, this._el.height);
        this._ctx.restore();
    }

    start(){
        setInterval(()=>{
            this.draw();
        }, 1000 / this._fps);
    }

    draw() {
        this.clearFrame();
        this._entityManager.entities.forEach(entity => {
            entity.draw(this._ctx);
        });
    }

    getTransformedPoint(x, y) {
        const transform = this._ctx.getTransform();
        const inverseZoom = 1 / transform.a;
        const transformedX = inverseZoom * x - inverseZoom * transform.e;
        const transformedY = inverseZoom * y - inverseZoom * transform.f;
        return { x: transformedX, y: transformedY };
    }

    get ctx() {
        return this._ctx;
    }

    get mouse() {
        return this._mouse;
    }

    get entityManager() {
        return this._entityManager;
    }

}