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
        this.rotateFromPosition(ctx, {
            x: this._transform.position.x,
            y: this._transform.position.y
        });
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(this._transform.position.x, this._transform.position.y);
        this._path.lineTo(this._transform.position.x - this._transform.dimension.width, this._transform.position.y - this._transform.dimension.height / 2);
        this._path.lineTo(this._transform.position.x - this._transform.dimension.width, this._transform.position.y + this._transform.dimension.height / 2);
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