import { ScoreManager } from './ScoreManager';
import { ScoreDisplayManager } from './ScoreDisplayManager';
import { ToastManager } from './ToastManager';
import { WinScreenManager } from './winScreen/WinScreenManager';
import targetImage from '@assets/target.png';
import cybertruckImage from '@assets/cybertruck.png';

export interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    score?: number;
}

interface GameStats {
    accuracy: number;
    fastestHit: number;
    targetHits: number;
    groundHits: number;
    babyStats: {
        launched: number;
        groundSplats: number;
        targetHits: number;
        totalCryingTime: number;
    };
    humanStats: {
        launched: number;
        cybertucksDestroyed: number;
        insuranceClaims: number;
        propertyDamage: number;
    };
}

export class TargetManager {
    private readonly TARGET_ROWS = 3;
    private readonly TARGET_COLS = 3;
    private targets: GameObject[] = [];
    private hasShownVictoryMessage = false;
    private winScreenManager: WinScreenManager;
    private currentTargetImage: string = cybertruckImage; // Change default to cybertruck

    private gameStats: GameStats = {
        accuracy: 0,
        fastestHit: 0,
        targetHits: 0,
        groundHits: 0,
        babyStats: {
            launched: 0,
            groundSplats: 0,
            targetHits: 0,
            totalCryingTime: 0
        },
        humanStats: {
            launched: 0,
            cybertucksDestroyed: 0,
            insuranceClaims: 0,
            propertyDamage: 0
        }
    };

    constructor(
        private scoreManager: ScoreManager,
        private scoreDisplayManager: ScoreDisplayManager
    ) {
        this.winScreenManager = new WinScreenManager(() => this.restart());
        this.currentTargetImage = cybertruckImage; // Set initial image to cybertruck
    }

    // Add new restart method
    private restart() {
        this.hasShownVictoryMessage = false;
        this.scoreManager.resetScore();
        this.targets = [];  // Clear existing targets
        this.targets = this.createTargets();
        // Notify Game class about new targets
        if (this.onTargetsUpdated) {
            this.onTargetsUpdated(this.targets);
        }
    }

    private onTargetsUpdated: ((targets: GameObject[]) => void) | null = null;

    setOnTargetsUpdated(callback: (targets: GameObject[]) => void) {
        this.onTargetsUpdated = callback;
    }

    setInitialImage(image: string) {
        this.currentTargetImage = image;
        // Update existing targets with new image
        this.targets.forEach(target => {
            const img = new Image();
            img.src = this.currentTargetImage;
            target.image = img;
        });
    }

    updateTargetImage(projectileType: number) {
        // Make sure we're using the correct image for the selected projectile
        const newImage = projectileType === 0 ? cybertruckImage : targetImage;
        
        // Only update if the image is actually changing
        if (this.currentTargetImage !== newImage) {
            this.currentTargetImage = newImage;
            
            // Force immediate image update
            this.targets.forEach(target => {
                const img = new Image();
                img.src = this.currentTargetImage;
                target.image = img;
            });
        }
    }

    createTargets(): GameObject[] {
        this.hasShownVictoryMessage = false;
        this.targets = [];
        
        // Constants for target positioning
        const playArea = {
            minX: 200,
            maxX: 700,
            minY: 50,
            maxY: 300,
            minSpacing: 80 // Minimum distance between targets
        };

        // Create a number of targets based on rows and columns
        const totalTargets = this.TARGET_ROWS * this.TARGET_COLS;
        const positions: Array<{x: number, y: number}> = [];

        // Try to place targets with minimum spacing
        for (let i = 0; i < 50 && positions.length < totalTargets; i++) {
            const x = Math.random() * (playArea.maxX - playArea.minX) + playArea.minX;
            const y = Math.random() * (playArea.maxY - playArea.minY) + playArea.minY;
            
            // Check if this position is far enough from other targets
            const isFarEnough = positions.every(pos => 
                Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) > playArea.minSpacing
            );

            if (isFarEnough) {
                positions.push({x, y});
            }
        }

        // Create targets at valid positions
        positions.forEach((pos, index) => {
            const img = new Image();
            img.src = this.currentTargetImage; // Now this is guaranteed to have a value

            // Calculate score based on height and distance from launcher
            const heightMultiplier = 1 - (pos.y - playArea.minY) / (playArea.maxY - playArea.minY);
            const distanceFromLauncher = Math.sqrt(Math.pow(pos.x - 50, 2) + Math.pow(pos.y - 450, 2));
            const distanceMultiplier = distanceFromLauncher / 800; // Normalize by max possible distance

            const baseScore = 100;
            const heightBonus = Math.floor(heightMultiplier * 300);
            const distanceBonus = Math.floor(distanceMultiplier * 200);
            const randomBonus = Math.floor(Math.random() * 100);

            const score = baseScore + heightBonus + distanceBonus + randomBonus;

            this.targets.push({
                x: pos.x,
                y: pos.y,
                width: 40,
                height: 40,
                image: img,
                score
            });
        });

        this.updateDisplay();
        return this.targets;
    }

    private updateDisplay() {
        this.scoreDisplayManager.updateDisplay(
            this.scoreManager.getScoreData(),
            this.targets.length
        );
        
        if (this.targets.length === 0 && !this.hasShownVictoryMessage) {
            this.hasShownVictoryMessage = true;
            const scoreData = this.scoreManager.getScoreData();

            // Calculate final stats
            this.gameStats.accuracy = Math.round((this.gameStats.targetHits / 
                (this.gameStats.targetHits + this.gameStats.groundHits)) * 100);
            
            // Show victory screen with stats
            this.winScreenManager.showScreen(
                scoreData.currentScore, 
                scoreData.highScore,
                this.gameStats
            );
            
            ToastManager.show('All targets destroyed! <i class="fa-solid fa-bullseye"></i>', 'success');
        }
    }

    // Add method to update stats
    updateStats(hitTarget: boolean, isHuman: boolean, hitTime: number) {
        if (hitTarget) {
            this.gameStats.targetHits++;
            if (this.gameStats.fastestHit === 0 || hitTime < this.gameStats.fastestHit) {
                this.gameStats.fastestHit = hitTime;
            }
            
            if (isHuman) {
                this.gameStats.humanStats!.launched++;
                this.gameStats.humanStats!.cybertucksDestroyed++;
                this.gameStats.humanStats!.propertyDamage += Math.round(Math.random() * 50000) + 10000;
                this.gameStats.humanStats!.insuranceClaims++;
            } else {
                this.gameStats.babyStats!.launched++;
                this.gameStats.babyStats!.targetHits++;
                this.gameStats.babyStats!.totalCryingTime += Math.random() * 2 + 1;
            }
        } else {
            this.gameStats.groundHits++;
            if (isHuman) {
                this.gameStats.humanStats!.launched++;
            } else {
                this.gameStats.babyStats!.launched++;
                this.gameStats.babyStats!.groundSplats++;
                this.gameStats.babyStats!.totalCryingTime += Math.random() * 5 + 2;
            }
        }
    }

    getTargets(): GameObject[] {
        return this.targets;
    }

    updateTargets(newTargets: GameObject[]) {
        this.targets = newTargets;
        this.updateDisplay();
    }
}
