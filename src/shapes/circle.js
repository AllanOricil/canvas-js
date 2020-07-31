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
        this._diameter = diameter;
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        this.rotateFromPosition(ctx, {
            x: this.position.x,
            y: this.position.y
        });
        ctx.beginPath();
        this._path = new Path2D();
        this._path.arc(this.position.x, this.position.y, this._diameter, 0, 2 * Math.PI);
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