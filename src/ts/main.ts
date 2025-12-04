import '../styles/input.css';
import { projectiles } from './ui/projectiles';
import { Explosion } from './utils/explosion';
import targetImage from '@assets/target.png';
import cybertruckImage from '@assets/cybertruck.png';  // Add this import
import { ProjectilePhysics, PhysicsConfig } from './physics/ProjectilePhysics';
import { Vector2D } from './physics/Vector2D';
import { SoundManager } from './audio/SoundManager';
import { Blood } from './utils/blood';
import { ScoreManager } from './managers/ScoreManager';
import { UIManager } from './managers/UIManager';
import { ToastManager } from './managers/ToastManager';
import { ScoreDisplayManager } from './managers/ScoreDisplayManager';
import { GamePhysics } from './physics/GamePhysics';
import { TargetManager, GameObject } from './managers/TargetManager';
import { ConsoleManager } from './managers/ConsoleManager';
import { GameModeManager } from './managers/GameModeManager';

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private angle: number = 45;
    private power: number = 50;
    private currentProjectile = 0;
    private targets: GameObject[] = [];
    private readonly MAX_WIND = 0.1;
    private projectilePos = { x: 50, y: 450 };
    private isFlying = false;
    private scoreManager: ScoreManager;
    private projectileImages: HTMLImageElement[] = [];
    private targetImage!: HTMLImageElement; // Add definite assignment assertion
    private explosions: Explosion[] = [];
    private physics: ProjectilePhysics;
    private readonly physicsConfig: PhysicsConfig = {
        gravity: 0.4,
        airResistance: 0.995,
        windStrength: 0,
        groundHeight: 450,
        isWeirdMode: false  // Add this line
    };
    private soundManager: SoundManager;
    private bloodImage: HTMLImageElement;
    private bloodEffects: Blood[] = [];
    private launcherImage: HTMLImageElement;
    private uiManager: UIManager;
    private scoreDisplayManager: ScoreDisplayManager;
    private gamePhysics: GamePhysics;
    private targetManager: TargetManager;
    private consoleManager: ConsoleManager;
    private gameModeManager: GameModeManager;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.scoreManager = new ScoreManager();
        this.scoreDisplayManager = new ScoreDisplayManager();
        this.targetManager = new TargetManager(this.scoreManager, this.scoreDisplayManager);
        this.uiManager = new UIManager(
            (angle) => this.angle = angle,
            (power) => this.power = power,
            (index) => {
                this.currentProjectile = index;
                // Add this line to update target images when projectile changes
                this.targetManager.updateTargetImage(index);
            },
            () => this.fire(),
            () => this.soundManager.toggleMute()
        );

        // Add this line to connect UIManager with TargetManager
        this.uiManager.setTargetManager(this.targetManager);

        this.targetManager.setOnTargetsUpdated((newTargets) => {
            this.targets = newTargets;
            this.projectilePos = { x: 50, y: 450 }; // Reset projectile position
            this.isFlying = false; // Reset flying state
        });
        this.targets = this.targetManager.createTargets();
        this.loadImages();
        this.updateWind();
        this.physics = new ProjectilePhysics(this.physicsConfig);
        this.soundManager = new SoundManager();
        this.bloodImage = new Image();
        this.bloodImage.src = new URL ('@assets/blood.png', import.meta.url).href;
        this.launcherImage = new Image();
        this.launcherImage.src = new URL('@assets/launcher.png', import.meta.url).href;
        this.gamePhysics = new GamePhysics(
            this.physics,
            this.soundManager,
            this.scoreManager,
            this.scoreDisplayManager,
            this.canvas.width,
            this.targetManager  // Add this parameter
        );
        this.consoleManager = new ConsoleManager(
            this.canvas,
            (angle) => {
                this.angle = angle;
                // Update UI slider to match mouse input
                const angleSlider = document.getElementById('angleSlider') as HTMLInputElement;
                if (angleSlider) angleSlider.value = angle.toString();
            },
            (power) => {
                this.power = power;
                // Update UI slider to match mouse input
                const powerSlider = document.getElementById('powerSlider') as HTMLInputElement;
                if (powerSlider) powerSlider.value = power.toString();
            },
            () => this.fire()
        );
        this.gameModeManager = new GameModeManager((isHardMode) => {
            this.consoleManager.setEnabled(!isHardMode);
            // Make game harder in hard mode
            this.physicsConfig.windStrength *= isHardMode ? 2 : 0.5;
            this.physicsConfig.gravity = isHardMode ? 0.5 : 0.4;
        });

        // Add weird mode toggle handler
        const weirdModeToggle = document.getElementById('weirdModeToggle');
        if (weirdModeToggle) {
            weirdModeToggle.addEventListener('click', () => {
                this.physicsConfig.isWeirdMode = !this.physicsConfig.isWeirdMode;
                weirdModeToggle.innerHTML = this.physicsConfig.isWeirdMode ? 'Weird <i class="fa-solid fa-hurricane"></i>' : 'Normal <i class="fa-solid fa-bullseye"></i>';
                weirdModeToggle.classList.toggle('bg-purple-300');
                
                // Add some fun effects when toggling
                if (this.physicsConfig.isWeirdMode) {
                    this.soundManager.play('whoosh', 0.3);
                }
            });
        }
        
        this.gameLoop();
    }

    private updateWind() {
        setInterval(() => {
            this.physicsConfig.windStrength = (Math.random() - 0.5) * this.MAX_WIND;
        }, 5000);
    }

    private fire() {
        if (this.isFlying) return;
        
        this.isFlying = true;
        this.physics.launch(
            this.angle, 
            this.power, 
            new Vector2D(50, this.physicsConfig.groundHeight)
        );
        
        // Start timing the shot
        this.gamePhysics.startShot();
        
        // Play shooting sound
        this.soundManager.play('shoot', 0.4);
        this.soundManager.play('whoosh', 0.3);
    }

    private update() {
        const result = this.gamePhysics.update(
            this.isFlying,
            this.projectilePos,
            this.targets,
            this.currentProjectile,
            this.bloodEffects,
            this.explosions
        );

        this.isFlying = result.isFlying;
        this.projectilePos = result.projectilePos;
        
        // Update targets
        this.targetManager.updateTargets(result.targets);
        this.targets = this.targetManager.getTargets();
        
        this.bloodEffects = result.bloodEffects;
        this.explosions = result.explosions;
    }

    private loadImages() {
        this.projectileImages = projectiles.map(p => {
            const img = new Image();
            img.src = p.image;
            return img;
        });

        // Now cybertruckImage is available
        this.targetManager.setInitialImage(cybertruckImage);
        this.targetImage = new Image();
        this.targetImage.src = cybertruckImage;
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw aim line
        const mousePos = (this.consoleManager as any).getMousePosition?.() || { x: 0, y: 0 };
        if (!this.gameModeManager.isHard() && (this.consoleManager as any).isAiming) {
            // Draw aim line with gradient
            this.ctx.save();
            const gradient = this.ctx.createLinearGradient(50, 450, mousePos.x, mousePos.y);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            this.ctx.beginPath();
            this.ctx.moveTo(50, 450);
            this.ctx.lineTo(mousePos.x, mousePos.y);
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();

            // Draw coordinate display with better styling
            this.ctx.save();
            // Draw background with rounded corners
            this.ctx.beginPath();
            this.roundRect(10, 40, 200, 80, 10);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fill();

            // Add subtle border
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Draw text with shadow
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px monospace';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 4;
            
            // Display coordinates and game info
            this.ctx.fillText(`Pos: ${mousePos.x.toFixed(0)}, ${mousePos.y.toFixed(0)}`, 20, 65);
            this.ctx.fillText(`Angle: ${this.angle.toFixed(1)}°`, 20, 85);
            this.ctx.fillText(`Power: ${this.power}%`, 20, 105);
            
            this.ctx.restore();
        }

        // Draw launcher with image
        this.ctx.save();
        this.ctx.translate(50, 450);
        this.ctx.rotate((-this.angle * Math.PI) / 180);
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.drawImage(
            this.launcherImage,
            -25, // Half the width to center
            -25, // Half the height to center
            50,  // Width of launcher
            50   // Height of launcher
        );
        this.ctx.restore();

        // Draw projectile
        if (this.isFlying) {
            const projectile = projectiles[this.currentProjectile];
            const img = this.projectileImages[this.currentProjectile];
            this.ctx.drawImage(
                img,
                this.projectilePos.x - projectile.size.width/2,
                this.projectilePos.y - projectile.size.height/2,
                projectile.size.width,
                projectile.size.height
            );
        }

        // Draw targets
        this.targets.forEach(target => {
            this.ctx.drawImage(
                target.image,  // Use target's image instead of this.targetImage
                target.x - target.width/2,
                target.y - target.height/2,
                target.width,
                target.height
            );
        });

        // Draw blood effects
        this.bloodEffects.forEach(effect => {
            effect.draw(this.ctx);
        });

        // Draw explosions
        this.explosions.forEach(explosion => {
            explosion.draw(this.ctx);
        });

        // Draw power meter only in hard mode
        if (this.gameModeManager.isHard()) {
            this.ctx.fillStyle = `rgb(${this.power * 2.55}, 0, 0)`;
            this.ctx.fillRect(10, 10, this.power * 2, 20);
        }

        // Draw wind indicator
        this.drawWindIndicator();
    }

    // Add helper method for rounded rectangles
    private roundRect(x: number, y: number, w: number, h: number, r: number) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
    }

    private drawWindIndicator() {
        const centerX = this.canvas.width - 60;
        const centerY = 30;
        const windStrength = (this.physicsConfig.windStrength / this.MAX_WIND) * 20;

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;

        // Draw wind direction arrow
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - windStrength, centerY);
        this.ctx.lineTo(centerX + windStrength, centerY);
        this.ctx.moveTo(this.physicsConfig.windStrength > 0 ? centerX + windStrength : centerX - windStrength, centerY - 5);
        this.ctx.lineTo(centerX + windStrength, centerY);
        this.ctx.lineTo(this.physicsConfig.windStrength > 0 ? centerX + windStrength : centerX - windStrength, centerY + 5);
        this.ctx.stroke();

        this.ctx.restore();
    }

    private gameLoop = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
