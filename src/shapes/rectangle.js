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
            const rotateFromX = this.position.x + this.dimension.width / 2;
            const rotateFromY = this.position.y + this.dimension.height / 2;
            ctx.translate(rotateFromX, rotateFromY);
            ctx.rotate(this.rotation.angle);
            ctx.translate(-rotateFromX,- rotateFromY);
        }
        this._path = new Path2D();
        var r = this.position.x + this.dimension.width;
        var b = this.position.y + this.dimension.height;

        ctx.beginPath();
        if(typeof this.border.radius === 'object'){
            this._path.moveTo(this.position.x + this.border.radius.topLeft, this.position.y);
            this._path.lineTo(r - this.border.radius.topRight, this.position.y);
            this._path.quadraticCurveTo(r, this.position.y, r, this.position.y + this.border.radius.topRight);
            this._path.lineTo(r, this.position.y + this.dimension.height - this.border.radius.bottomRight);
            this._path.quadraticCurveTo(r, b, r - this.border.radius.bottomRight, b);
            this._path.lineTo(this.position.x + this.border.radius.bottomLeft, b);
            this._path.quadraticCurveTo(this.position.x, b, this.position.x, b - this.border.radius.bottomLeft);
            this._path.lineTo(this.position.x, this.position.y + this.border.radius.topLeft);
            this._path.quadraticCurveTo(this.position.x, this.position.y, this.position.x + this.border.radius.topLeft, this.position.y);
        }else{
            this._path.moveTo(this.position.x + this.border.radius, this.position.y);
            this._path.lineTo(r - this.border.radius, this.position.y);
            this._path.quadraticCurveTo(r, this.position.y, r, this.position.y + this.border.radius);
            this._path.lineTo(r, this.position.y + this.dimension.height - this.border.radius);
            this._path.quadraticCurveTo(r, b, r - this.border.radius, b);
            this._path.lineTo(this.position.x + this.border.radius, b);
            this._path.quadraticCurveTo(this.position.x, b, this.position.x, b - this.border.radius);
            this._path.lineTo(this.position.x, this.position.y + this.border.radius);
            this._path.quadraticCurveTo(this.position.x, this.position.y, this.position.x + this.border.radius, this.position.y);
        }
        this._path.closePath();
        if(this.border && this.border.color) ctx.stroke(this._path);
        if(this._background && this._background.color) ctx.fill(this._path);

        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        if(this.border && this.border.color)  ctx.stroke(this._path);
        ctx.restore();
    }

    get area() {
        return this.dimension.width * this.dimension.height;
    }

    get center() {
        return {
            x: this.position.x + this.dimension.width / 2,
            y: this.position.y + this.dimension.height / 2,
        };
    }
}