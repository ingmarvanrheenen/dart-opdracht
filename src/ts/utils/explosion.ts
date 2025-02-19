import explosionImg from '@assets/explosion.png';

export class Explosion {
    private image: HTMLImageElement;
    private frame: number = 0;
    private readonly totalFrames: number = 8;  // Adjust based on your sprite sheet
    private readonly frameWidth: number = 64;  // Adjust based on your sprite sheet
    private readonly frameHeight: number = 64; // Adjust based on your sprite sheet
    private frameCounter: number = 0;
    private readonly animationSpeed: number = 2;
    public isFinished: boolean = false;

    constructor(public x: number, public y: number) {
        this.image = new Image();
        this.image.src = explosionImg;
    }

    update() {
        this.frameCounter++;
        if (this.frameCounter >= this.animationSpeed) {
            this.frame++;
            this.frameCounter = 0;
            if (this.frame >= this.totalFrames) {
                this.isFinished = true;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.image,
            this.frame * this.frameWidth, 0,
            this.frameWidth, this.frameHeight,
            this.x - this.frameWidth/2, this.y - this.frameHeight/2,
            this.frameWidth, this.frameHeight
        );
    }
}
