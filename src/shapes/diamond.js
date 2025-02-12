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
        if(this.rotate){
            const rotateFromX =  this._transform._position.x + this._transform._dimension.width / 2;
            const rotateFromY = this._transform._position.y + this._transform._dimension.height / 2;
            ctx.translate(rotateFromX, rotateFromY);
            ctx.rotate(this._transform._rotation.angle);
            ctx.translate(-rotateFromX,- rotateFromY);
        }
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
        if(this._border && this._border._color) ctx.stroke(this._path);
        if(this._background && this._background._color) ctx.fill(this._path);

        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        if(this._border && this._border._color) ctx.stroke(this._path);
        ctx.restore();
    }
}