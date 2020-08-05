import Transform from "../transforms/transform";

export default class CanvasImage {

    constructor({
        src,
        position,
        dimension,
        rotation,
        scale
    }) {
        this._transform = new Transform({
            position,
            dimension,
            rotation,
            scale
        });
        if(dimension)
            this._image = new Image(this._transform._dimension.width, this._transform._dimension.height);
        else
            this._image = new Image();
        this._src = src;
        this._image.src = this._src;
        this._image.addEventListener('load', () => {
            this._loaded = true;
        });
        this._loaded = false;
    }

    set src(newValue) {
        this._src = newValue;
        this._loaded = false;
    }

    draw(ctx){
        if(this._transform._dimension)
            ctx.drawImage(
                this._image,
                this._transform._position.x,
                this._transform._position.y,
                this._transform._dimension.width,
                this._transform._dimension.height
            );
        else
            ctx.drawImage(
                this._image,
                this._transform._position.x,
                this._transform._position.y
            );
    }
}