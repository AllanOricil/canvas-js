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

        this._points = points || [];
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        if(this.rotate){
            const rotateFromX = this._transform._position.x + this._transform._dimension.width / 2;
            const rotateFromY = this._transform._position.y + this._transform._dimension.height / 2;
            ctx.translate(rotateFromX, rotateFromY);
            ctx.rotate(this._transform._rotation.angle);
            ctx.translate(-rotateFromX,- rotateFromY);
        }
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(points[0].x, points[0].y);
        points.forEach(point => {
            this._path.lineTo(point.x, point.y);
        });
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