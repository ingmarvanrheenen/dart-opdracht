import elonBg from '../../assets/elon_background.jpg';
import babyBg from '../../assets/baby_background.jpg';

export type BackgroundMode = 'auto' | 'human' | 'baby' | 'color' | 'custom';

export class BackgroundManager {
    private mode: BackgroundMode = 'auto';
    private color: string = '#0b1220';
    private customUrl: string | null = null;

    private elonImg = new Image();
    private babyImg = new Image();
    private customImg = new Image();

    private loaded = { elon: false, baby: false, custom: false };

    constructor(options?: { color?: string; initialMode?: BackgroundMode; customUrl?: string }) {
        if (options?.color) this.color = options.color;
        if (options?.initialMode) this.mode = options.initialMode;
        if (options?.customUrl) this.setCustomBackground(options.customUrl);

        this.elonImg.src = elonBg;
        this.elonImg.onload = () => (this.loaded.elon = true);

        this.babyImg.src = babyBg;
        this.babyImg.onload = () => (this.loaded.baby = true);

        this.customImg.onload = () => (this.loaded.custom = true);
    }

    setMode(mode: BackgroundMode) {
        this.mode = mode;
    }

    setColor(hex: string) {
        this.color = hex;
        this.mode = 'color';
    }

    setCustomBackground(url: string) {
        this.customUrl = url;
        this.customImg = new Image();
        this.customImg.src = url;
        this.customImg.onload = () => (this.loaded.custom = true);
        this.mode = 'custom';
    }

    // Helper: choose background based on projectile type (e.g. 'baby' or 'human')
    setByProjectile(projectileType: string) {
        if (!projectileType) return;
        const t = projectileType.toLowerCase();
        if (t.includes('baby')) this.mode = 'baby';
        else if (t.includes('human') || t.includes('person')) this.mode = 'human';
        else this.mode = 'auto';
    }

    // Helper: choose background based on game mode (example values: 'human'|'baby'|'mixed')
    setByGameMode(gameMode: string) {
        if (!gameMode) return;
        const g = gameMode.toLowerCase();
        if (g.includes('human')) this.mode = 'human';
        else if (g.includes('baby')) this.mode = 'baby';
        else this.mode = 'auto';
    }

    // Draw to canvas context; call from your game's draw loop before objects
    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        if (this.mode === 'color') {
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, width, height);
            return;
        }

        const drawImageCover = (img: HTMLImageElement) => {
            if (!img || !img.complete || img.naturalWidth === 0) return false;
            const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
            const iw = img.naturalWidth * scale;
            const ih = img.naturalHeight * scale;
            const x = (width - iw) / 2;
            const y = (height - ih) / 2;
            ctx.drawImage(img, x, y, iw, ih);
            return true;
        };

        if (this.mode === 'custom' && this.loaded.custom) {
            if (drawImageCover(this.customImg)) return;
        }

        if (this.mode === 'baby' && this.loaded.baby) {
            if (drawImageCover(this.babyImg)) return;
        }

        if (this.mode === 'human' && this.loaded.elon) {
            if (drawImageCover(this.elonImg)) return;
        }

        // auto or fallback: try to draw baby/human if loaded, else fill color
        if (this.loaded.baby) {
            if (drawImageCover(this.babyImg)) return;
        }
        if (this.loaded.elon) {
            if (drawImageCover(this.elonImg)) return;
        }

        // fallback to color fill
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, width, height);
    }
}
