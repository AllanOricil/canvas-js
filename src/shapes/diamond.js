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
            const rotateFromX =  this.position.x + this.dimension.width / 2;
            const rotateFromY = this.position.y + this.dimension.height / 2;
            ctx.translate(rotateFromX, rotateFromY);
            ctx.rotate(this.rotation.angle);
            ctx.translate(-rotateFromX,- rotateFromY);
        }
        this._path = new Path2D();
        ctx.beginPath();
        this._path.moveTo(this.sides.top.x - this.border.radius, this.sides.top.y + this.border.radius);
        this._path.quadraticCurveTo(this.sides.top.x, this.sides.top.y + this.border.radius * 0.5, this.sides.top.x + this.border.radius, this.sides.top.y + this.border.radius);
        this._path.lineTo(this.sides.right.x - this.border.radius, this.sides.right.y - this.border.radius);
        this._path.quadraticCurveTo(this.sides.right.x, this.sides.right.y, this.sides.right.x - this.border.radius, this.sides.right.y + this.border.radius);
        this._path.lineTo(this.sides.bottom.x + this.border.radius, this.sides.bottom.y - this.border.radius);
        this._path.quadraticCurveTo(this.sides.bottom.x, this.sides.bottom.y - this.border.radius * 0.5, this.sides.bottom.x - this.border.radius, this.sides.bottom.y - this.border.radius);
        this._path.lineTo(this.sides.left.x + this.border.radius, this.sides.left.y + this.border.radius);
        this._path.quadraticCurveTo(this.sides.left.x, this.sides.left.y, this.sides.left.x + this.border.radius, this.sides.left.y - this.border.radius);
        this._path.lineTo(this.sides.top.x - this.border.radius, this.sides.top.y + this.border.radius);
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