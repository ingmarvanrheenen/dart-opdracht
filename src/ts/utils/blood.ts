import bloodImg from '@assets/blood.png';

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    angVel: number;
    life: number;
    maxLife: number;
    isStain: boolean;
    stainAlpha: number;
};

export class Blood {
    private image: HTMLImageElement;
    private particles: Particle[] = [];
    public isFinished: boolean = false;

    constructor(public x: number, public y: number, count = 18) {
        this.image = new Image();
        this.image.src = bloodImg;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 5.0;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - (0.5 + Math.random() * 2);
            const size = 6 + Math.random() * 18;
            const life = 0.6 + Math.random() * 1.6;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx,
                vy,
                size,
                rotation: Math.random() * Math.PI * 2,
                angVel: (Math.random() - 0.5) * 0.3,
                life,
                maxLife: life,
                isStain: false,
                stainAlpha: 0,
            });
        }
    }

    update() {
        // Simple physics per frame
        const gravity = 0.35;
        for (const p of this.particles) {
            if (p.isStain) {
                // stains slowly fade
                p.stainAlpha -= 0.004;
                if (p.stainAlpha < 0) p.stainAlpha = 0;
                p.life -= 0.002;
            } else {
                // apply physics
                p.vy += gravity;
                p.vx *= 0.995; // air drag
                p.vy *= 0.999;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.angVel;
                p.life -= 0.016;
            }
        }

        // prune finished particles
        this.particles = this.particles.filter(p => (p.life > 0) || (p.isStain && p.stainAlpha > 0));
        if (this.particles.length === 0) this.isFinished = true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const canvasH = ctx.canvas.height;

        for (const p of this.particles) {
            // If particle hit the ground this frame, convert to stain
            const groundY = canvasH - 8; // small offset so stains sit above bottom edge
            if (!p.isStain && p.y + p.size / 2 >= groundY) {
                p.isStain = true;
                p.stainAlpha = Math.min(0.9, (p.life / p.maxLife) * 0.9 + 0.1);
                p.y = groundY;
                p.vx *= 0.25;
                p.vy = 0;
                p.life = Math.max(0.4, p.life * 0.6);
            }

            if (p.isStain) {
                // stains removed: don't render flattened ovals; let them fade out silently
                continue;
            }

            // in-air particle
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            if (this.image && this.image.complete) {
                // draw scaled blood image centered
                const drawSize = p.size;
                ctx.drawImage(this.image, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
            } else {
                // fallback: draw a dark red circle
                const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
                grd.addColorStop(0, 'rgba(255,80,60,0.95)');
                grd.addColorStop(0.6, 'rgba(160,10,10,0.9)');
                grd.addColorStop(1, 'rgba(80,10,10,0.6)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }
}

