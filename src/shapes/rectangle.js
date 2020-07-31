import Shape from "./shape";

export default class Rectangle extends Shape {
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
        var r = this._transform.position.x + this._transform.dimension.width;
        var b = this._transform.position.y + this._transform.dimension.height;

        ctx.beginPath();
        if(typeof this._border.radius === 'object'){
            this._path.moveTo(this._transform.position.x + this._border.radius.topLeft, this._transform.position.y);
            this._path.lineTo(r - this._border.radius.topRight, this._transform.position.y);
            this._path.quadraticCurveTo(r, this._transform.position.y, r, this._transform.position.y + this._border.radius.topRight);
            this._path.lineTo(r, this._transform.position.y + this._transform.dimension.height - this._border.radius.bottomRight);
            this._path.quadraticCurveTo(r, b, r - this._border.radius.bottomRight, b);
            this._path.lineTo(this._transform.position.x + this._border.radius.bottomLeft, b);
            this._path.quadraticCurveTo(this._transform.position.x, b, this._transform.position.x, b - this._border.radius.bottomLeft);
            this._path.lineTo(this._transform.position.x, this._transform.position.y + this._border.radius.topLeft);
            this._path.quadraticCurveTo(this._transform.position.x, this._transform.position.y, this._transform.position.x + this._border.radius.topLeft, this._transform.position.y);
        }else{
            this._path.moveTo(this._transform.position.x + this._border.radius, this._transform.position.y);
            this._path.lineTo(r - this._border.radius, this._transform.position.y);
            this._path.quadraticCurveTo(r, this._transform.position.y, r, this._transform.position.y + this._border.radius);
            this._path.lineTo(r, this._transform.position.y + this._transform.dimension.height - this._border.radius);
            this._path.quadraticCurveTo(r, b, r - this._border.radius, b);
            this._path.lineTo(this._transform.position.x + this._border.radius, b);
            this._path.quadraticCurveTo(this._transform.position.x, b, this._transform.position.x, b - this._border.radius);
            this._path.lineTo(this._transform.position.x, this._transform.position.y + this._border.radius);
            this._path.quadraticCurveTo(this._transform.position.x, this._transform.position.y, this._transform.position.x + this._border.radius, this._transform.position.y);
        }
        this._path.closePath();
        if(this._border && this._border.color) ctx.stroke(this._path);
        if(this._background && this._background.color) ctx.fill(this._path);

        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        if(this._border && this._border.color)  ctx.stroke(this._path);
        ctx.restore();
    }

    get area() {
        return this._transform.dimension.width * this._transform.dimension.height;
    }

    get center() {
        return {
            x: this._transform.position.x + this._transform.dimension.width / 2,
            y: this._transform.position.y + this._transform.dimension.height / 2,
        };
    }
}