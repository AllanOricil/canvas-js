import Shape from "./shape";

export default class Diamond extends Shape {
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
            x: this._transform.position.x + this._transform.dimension.width / 2,
            y: this._transform.position.y + this._transform.dimension.height / 2
        });
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(this.sides.top.x - this._border.radius, this.sides.top.y + this._border.radius);
        this._path.quadraticCurveTo(this.sides.top.x, this.sides.top.y + this._border.radius * 0.5, this.sides.top.x + this._border.radius, this.sides.top.y + this._border.radius);
        this._path.lineTo(this.sides.right.x - this._border.radius, this.sides.right.y - this._border.radius);
        this._path.quadraticCurveTo(this.sides.right.x, this.sides.right.y, this.sides.right.x - this._border.radius, this.sides.right.y + this._border.radius);
        this._path.lineTo(this.sides.bottom.x + this._border.radius, this.sides.bottom.y - this._border.radius);
        this._path.quadraticCurveTo(this.sides.bottom.x, this.sides.bottom.y - this._border.radius * 0.5, this.sides.bottom.x - this._border.radius, this.sides.bottom.y - this._border.radius);
        this._path.lineTo(this.sides.left.x + this._border.radius, this.sides.left.y + this._border.radius);
        this._path.quadraticCurveTo(this.sides.left.x, this.sides.left.y, this.sides.left.x + this._border.radius, this.sides.left.y - this._border.radius);
        this._path.lineTo(this.sides.top.x - this._border.radius, this.sides.top.y + this._border.radius);
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