import Shape from "./shape";

export default class Triangle extends Shape {

    constructor({
        position,
        dimension,
        rotation,
        border,
        background,
        shadow
    }) {
        super({
            position,
            dimension,
            rotation,
            border,
            background,
            shadow
        });
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        if(this.rotate){
            ctx.translate(this._transform._position.x, this._transform._position.y);
            ctx.rotate(this._transform._rotation.angle);
            ctx.translate(-this._transform._position.x,- this._transform._position.y);
        }
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(this._transform._position.x, this._transform._position.y);
        this._path.lineTo(this._transform._position.x - this._transform._dimension.width, this._transform._position.y - this._transform._dimension.height / 2);
        this._path.lineTo(this._transform._position.x - this._transform._dimension.width, this._transform._position.y + this._transform._dimension.height / 2);
        this._path.closePath();

        if(this._border && this._border._color) ctx.stroke(this._path);
        if(this._background && this._background._color) ctx.fill(this._path);

        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        if(this._border && this._border._color) ctx.stroke(this._path);
        ctx.restore();
    }
}