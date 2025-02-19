export class Vector2D {
    constructor(public x: number = 0, public y: number = 0) {}

    add(v: Vector2D): Vector2D {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    multiply(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector2D {
        if (scalar === 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2D {
        const mag = this.magnitude();
        return mag === 0 ? new Vector2D(0, 0) : this.divide(mag);
    }

    applyFriction(factor: number): void {
        const speed = this.magnitude();
        if (speed > 0) {
            const newSpeed = Math.max(0, speed * factor);
            const normalized = this.normalize();
            this.x = normalized.x * newSpeed;
            this.y = normalized.y * newSpeed;
        }
    }

    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    distanceTo(v: Vector2D): number {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }
}
