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
        if(this.rotate){
            const rotateFromX = this._transform._position.x + this._transform._dimension.width / 2;
            const rotateFromY = this._transform._position.y + this._transform._dimension.height / 2;
            ctx.translate(rotateFromX, rotateFromY);
            ctx.rotate(this._transform._rotation.angle);
            ctx.translate(-rotateFromX,- rotateFromY);
        }
        this._path = new Path2D();
        var r = this._transform._position.x + this._transform._dimension.width;
        var b = this._transform._position.y + this._transform._dimension.height;

        ctx.beginPath();
        if(typeof this._border._radius === 'object'){
            this._path.moveTo(this._transform._position.x + this._border._radius.topLeft, this._transform._position.y);
            this._path.lineTo(r - this._border._radius.topRight, this._transform._position.y);
            this._path.quadraticCurveTo(r, this._transform._position.y, r, this._transform._position.y + this._border._radius.topRight);
            this._path.lineTo(r, this._transform._position.y + this._transform._dimension.height - this._border._radius.bottomRight);
            this._path.quadraticCurveTo(r, b, r - this._border._radius.bottomRight, b);
            this._path.lineTo(this._transform._position.x + this._border._radius.bottomLeft, b);
            this._path.quadraticCurveTo(this._transform._position.x, b, this._transform._position.x, b - this._border._radius.bottomLeft);
            this._path.lineTo(this._transform._position.x, this._transform._position.y + this._border._radius.topLeft);
            this._path.quadraticCurveTo(this._transform._position.x, this._transform._position.y, this._transform._position.x + this._border._radius.topLeft, this._transform._position.y);
        }else{
            this._path.moveTo(this._transform._position.x + this._border._radius, this._transform._position.y);
            this._path.lineTo(r - this._border._radius, this._transform._position.y);
            this._path.quadraticCurveTo(r, this._transform._position.y, r, this._transform._position.y + this._border._radius);
            this._path.lineTo(r, this._transform._position.y + this._transform._dimension.height - this._border._radius);
            this._path.quadraticCurveTo(r, b, r - this._border._radius, b);
            this._path.lineTo(this._transform._position.x + this._border._radius, b);
            this._path.quadraticCurveTo(this._transform._position.x, b, this._transform._position.x, b - this._border._radius);
            this._path.lineTo(this._transform._position.x, this._transform._position.y + this._border._radius);
            this._path.quadraticCurveTo(this._transform._position.x, this._transform._position.y, this._transform._position.x + this._border._radius, this._transform._position.y);
        }
        this._path.closePath();
        if(this._border && this._border._color) ctx.stroke(this._path);
        if(this._background && this._background._color) ctx.fill(this._path);

        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        if(this._border && this._border._color)  ctx.stroke(this._path);
        ctx.restore();
    }

    get area() {
        return this._transform._dimension.width * this._transform._dimension.height;
    }

    get center() {
        return {
            x: this._transform._position.x + this._transform._dimension.width / 2,
            y: this._transform._position.y + this._transform._dimension.height / 2,
        };
    }
}