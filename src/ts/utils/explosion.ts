import explosionImg from '@assets/explosion.png';

type Debris = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    rotation: number;
    angVel: number;
    type: 'spark' | 'smoke' | 'chunk';
};

export class Explosion {
    private image: HTMLImageElement;
    private debris: Debris[] = [];
    private shockRadius = 0;
    private shockMax = 60;
    private flashAlpha = 0.7;
    public isFinished = false;

    constructor(public x: number, public y: number, count = 12) {
        this.image = new Image();
        this.image.src = explosionImg;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - (Math.random() * 2);
            const size = 3 + Math.random() * 8;
            const life = 0.4 + Math.random() * 0.8;
            const tRand = Math.random();
            const type: Debris['type'] = tRand < 0.5 ? 'spark' : (tRand < 0.85 ? 'chunk' : 'smoke');
            this.debris.push({
                x: this.x,
                y: this.y,
                vx,
                vy,
                size,
                life,
                maxLife: life,
                rotation: Math.random() * Math.PI * 2,
                angVel: (Math.random() - 0.5) * 0.3,
                type,
            });
        }
    }

    update() {
        const gravity = 0.32;
        // update debris
        for (const d of this.debris) {
            d.vy += gravity * (d.type === 'smoke' ? 0.06 : 1);
            d.vx *= 0.99;
            d.vy *= 0.995;
            d.x += d.vx;
            d.y += d.vy;
            d.rotation += d.angVel;
            d.life -= 0.016;
        }

        // shockwave expansion and flash fading
        this.shockRadius += 4;
        if (this.shockRadius > this.shockMax) this.shockRadius = this.shockMax;
        this.flashAlpha -= 0.05;
        if (this.flashAlpha < 0) this.flashAlpha = 0;

        // remove dead debris
        this.debris = this.debris.filter(d => d.life > 0 || d.type === 'smoke');

        // finish when everything faded
        if (this.debris.length === 0 && this.flashAlpha <= 0 && this.shockRadius >= this.shockMax) {
            this.isFinished = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // flash
        if (this.flashAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = this.flashAlpha;
            ctx.fillStyle = 'rgba(255,240,200,1)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 60, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // shockwave
        if (this.shockRadius > 8) {
            ctx.save();
            const alpha = Math.max(0, 0.9 - (this.shockRadius / this.shockMax));
            ctx.globalAlpha = alpha * 0.6;
            ctx.strokeStyle = 'rgba(255,200,120,1)';
            ctx.lineWidth = 4 * (1 - this.shockRadius / this.shockMax) + 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.shockRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // debris
        for (const d of this.debris) {
            const t = 1 - Math.max(0, d.life / d.maxLife);
            ctx.save();
            ctx.translate(d.x, d.y);
            ctx.rotate(d.rotation);

            // draw by type
            if (d.type === 'spark') {
                const alpha = Math.max(0, d.life / d.maxLife);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = 'rgba(255,200,50,1)';
                ctx.beginPath();
                ctx.arc(0, 0, Math.max(0.6, d.size / 4), 0, Math.PI * 2);
                ctx.fill();
            } else if (d.type === 'chunk') {
                const alpha = Math.max(0.1, d.life / d.maxLife);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = 'rgba(140,70,36,1)';
                ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size);
            } else { // smoke
                const alpha = Math.max(0, (d.life / d.maxLife) * 0.6);
                ctx.globalAlpha = alpha * (0.6 + 0.4 * (1 - t));
                const s = d.size * (1.0 + t * 1.6);
                const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
                grd.addColorStop(0, 'rgba(120,110,120,0.6)');
                grd.addColorStop(1, 'rgba(60,50,60,0.0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(0, 0, s, 0, Math.PI * 2);
                ctx.fill();
            }

            // optionally draw sprite for larger debris if available
            if (d.type === 'chunk' && this.image.complete) {
                // small overlay texture
                ctx.globalAlpha = Math.min(1, (d.life / d.maxLife) + 0.15);
                const sz = d.size * 1.0;
                ctx.drawImage(this.image, -sz / 2, -sz / 2, sz, sz);
            }

            ctx.restore();
        }
    }
}
