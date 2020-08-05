import Shape from "./shape";

export default class Circle extends Shape {

    constructor({
        position,
        rotation,
        border,
        background,
        diameter,
        shadow
    }) {
        super({
            position,
            rotation,
            border,
            background,
            shadow
        });
        this._diameter = diameter || 0;
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        if(this.rotate){
            ctx.translate( this._transform._position.x, this._transform._position.y);
            ctx.rotate(this._transform._rotation.angle);
            ctx.translate(- this._transform._position.x, -this._transform._position.y);
        }
        ctx.beginPath();
        this._path = new Path2D();
        this._path.arc(this._transform._position.x, this._transform._position.y, this._diameter, 0, 2 * Math.PI);
        this._path.closePath();
        ctx.stroke(this._path);
        ctx.fill(this._path);
        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke(this._path);
        ctx.restore();
    }
}