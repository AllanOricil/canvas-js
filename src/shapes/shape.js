
import Border from "../styles/border";
import Shadow from "../styles/shadow";
import Background from "../styles/background";
import Transform from "../transforms/transform";

export default class Shape {

    static get ROTATION() {
        return new Rotation({
            angle: 0
        });
    }

    static get BACKGROUND() {
        return new Background({
            color: 'rgb(255,255,255)',
        });
    }

    static get SHADOW() {
        return new Shadow({
            offsetX: 0,
            offsetY: 0,
            color: 'rgb(0,0,0)',
            blur: 0
        });
    }

    static get BORDER() {
        return new Border({
            radius: 0,
            lineWidth: 1
        });
    }

    constructor({
        position,
        dimension,
        rotation,
        scale,
        background,
        border,
        shadow
    }) {

        this._transform = new Transform({
            position,
            dimension,
            rotation,
            scale
        });
        this._border = border ? new Border(border) : Shape.BORDER;
        this._background = background ? new Background(background) : Shape.BACKGROUND;
        this._shadow = shadow ?  new Shadow(shadow) : null;
        this._path = null;
    }

    draw(ctx) {
        if (this._shadow) {
            ctx.shadowColor = this._shadow.color.rgba;
            ctx.shadowBlur = this._shadow.blur;
            ctx.shadowOffsetX = this._shadow.offsetX;
            ctx.shadowOffsetY = this._shadow.offsetY;
        }
        if(this._border && this._border.color)
            ctx.strokeStyle = this._border.color.rgba;

        if(this._border && this._border.lineWidth)
            ctx.lineWidth = this._border.lineWidth;

        if(this._background && this._background.color)
            ctx.fillStyle = this._background.color.rgba;
    }

    rotateFromPosition(ctx, position) {
        ctx.translate(position.x, position.y);
        ctx.rotate(this._transform.rotation.angle);
        ctx.translate(-position.x, -position.y);
    }

    get sides() {
        const middleWidth = this._transform.dimension.width / 2;
        const middleHeight = this._transform.dimension.height / 2;
        return {
            top: {
                x: this._transform.position.x + middleWidth,
                y: this._transform.position.y
            },
            right: {
                x: this._transform.position.x + this._transform.dimension.width,
                y: this._transform.position.y + middleHeight
            },
            bottom: {
                x: this._transform.position.x + middleWidth,
                y: this._transform.position.y + this._transform.dimension.height
            },
            left: {
                x: this._transform.position.x,
                y: this._transform.position.y + middleHeight
            },
        };
    }

    get path() {
        return this._path;
    }

    set path(newValue) {
        this._path = newValue;
    }

    get border() {
        return this._border;
    }

    get background() {
        return this._background;
    }

    get rotation() {
        return this._transform.rotation;
    }

    get shadow() {
        return this._shadow;
    }

    set rotation(newValue) {
        this._transform.rotation.angle = newValue;
    }

    get position() {
        return this._transform.position;
    }

    set position(newValue) {
        this._transform.position.x = newValue.x;
        this._transform.position.y = newValue.y;
    }

    get dimension(){
        return this._transform.dimension;
    }
}