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
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation.angle);
            ctx.translate(-this.position.x,- this.position.y);
        }
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(this.position.x, this.position.y);
        this._path.lineTo(this.position.x - this.dimension.width, this.position.y - this.dimension.height / 2);
        this._path.lineTo(this.position.x - this.dimension.width, this.position.y + this.dimension.height / 2);
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