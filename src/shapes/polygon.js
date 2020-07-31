import Shape from "./shape";

export default class Polygon extends Shape {
    constructor({
        points,
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

        this._points = points;
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        this.rotateFromPosition(ctx, {
            x: this._position.x + this._dimension.width / 2,
            y: this._position.y + this._dimension.height / 2
        });
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(points[0].x, points[0].y);
        points.forEach(point => {
            this._path.lineTo(point.x, point.y);
        });
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