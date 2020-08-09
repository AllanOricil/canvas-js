
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

    static get SHADOW() {
        return new Shadow({
            offsetX: 0,
            offsetY: 0,
            color: 'rgb(0,0,0)',
            blur: 0
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
        this._border = border ? new Border(border) : Border.SMALL;
        this._background = background ? new Background(background) : Background.TRANSPARENT;
        this._shadow = shadow ?  new Shadow(shadow) : null;
        this._path = null;
    }

    draw(ctx) {
        if (this._shadow) {
            ctx.shadowColor = this._shadow._color.rgba;
            ctx.shadowBlur = this._shadow.blur;
            ctx.shadowOffsetX = this._shadow.offsetX;
            ctx.shadowOffsetY = this._shadow.offsetY;
        }
        if(this._border && this._border._color)
            ctx.strokeStyle = this._border._color.rgba;

        if(this._border && this._border.lineWidth)
            ctx.lineWidth = this._border.lineWidth;

        if(this._background && this._background._color)
            ctx.fillStyle = this._background._color.rgba;
    }

    get sides() {
        const middleWidth = this._transform._dimension.width / 2;
        const middleHeight = this._transform._dimension.height / 2;
        return {
            top: {
                x: this._transform._position.x + middleWidth,
                y: this._transform._position.y
            },
            right: {
                x: this._transform._position.x + this._transform._dimension.width,
                y: this._transform._position.y + middleHeight
            },
            bottom: {
                x: this._transform._position.x + middleWidth,
                y: this._transform._position.y + this._transform._dimension.height
            },
            left: {
                x: this._transform._position.x,
                y: this._transform._position.y + middleHeight
            },
        };
    }

    get rotate(){
        return this._transform._rotation && this._transform._rotation.angle > 0;
    }

}