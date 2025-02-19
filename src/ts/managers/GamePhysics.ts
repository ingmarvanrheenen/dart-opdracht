import { Explosion } from '../utils/explosion';
import { Blood } from '../utils/blood';
import { projectiles } from '../ui/projectiles';
import { SoundManager } from '../audio/SoundManager';
import { ScoreManager } from './ScoreManager';
import { ScoreDisplayManager } from './ScoreDisplayManager';
import { ToastManager } from './ToastManager';
import { ProjectilePhysics } from '../physics/ProjectilePhysics';
import { TargetManager } from './TargetManager';

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    score?: number;
}

export class GamePhysics {
    private shotStartTime: number = 0;
    private readonly COLLISION_THRESHOLD = 0.8; // Adjustable collision sensitivity

    constructor(
        private physics: ProjectilePhysics,
        private soundManager: SoundManager,
        private scoreManager: ScoreManager,
        private scoreDisplayManager: ScoreDisplayManager,
        private canvasWidth: number,
        private targetManager: TargetManager  // Add this parameter
    ) {}

    update(
        isFlying: boolean,
        projectilePos: { x: number, y: number },
        targets: GameObject[],
        currentProjectile: number,
        bloodEffects: Blood[],
        explosions: Explosion[]
    ): {
        isFlying: boolean,
        projectilePos: { x: number, y: number },
        targets: GameObject[],
        bloodEffects: Blood[],
        explosions: Explosion[]
    } {
        if (isFlying) {
            const isActive = this.physics.update(); // Remove deltaTime parameter
            projectilePos = this.physics.position;
            
            let hitTarget = false;
            for (let i = targets.length - 1; i >= 0; i--) {
                if (this.checkCollision(projectilePos, targets[i])) {
                    const hitTime = (Date.now() - this.shotStartTime) / 1000;
                    
                    // Use velocity property instead of getVelocity()
                    const impactForce = this.physics.velocity.magnitude() / 100;
                    
                    // Remove third argument from Explosion constructor
                    explosions.push(new Explosion(
                        targets[i].x,
                        targets[i].y
                    ));
                    
                    this.soundManager.play('explosion', Math.min(1, impactForce * 0.6));
                    
                    // Update stats with hit info
                    const isHuman = currentProjectile === 0;
                    this.targetManager.updateStats(true, isHuman, hitTime);

                    // Handle sounds and effects
                    if (currentProjectile === 1) {
                        this.soundManager.play('cry', 1);
                    }

                    // Calculate score
                    const distance = Math.sqrt(
                        Math.pow(targets[i].x - 50, 2) + 
                        Math.pow(targets[i].y - this.physics.position.y, 2)
                    );
                    const points = this.scoreManager.addPoints(targets[i].score || 100, distance);
                    ToastManager.show(`+${points} points!`);

                    targets.splice(i, 1);
                    this.scoreDisplayManager.updateDisplay(this.scoreManager.getScoreData(), targets.length);
                    
                    isFlying = false;
                    hitTarget = true;
                    break;
                }
            }

            // Improved out-of-bounds checking with buffer zone
            const bufferZone = 50;
            if (!isActive || 
                projectilePos.x > this.canvasWidth + bufferZone || 
                projectilePos.x < -bufferZone) {
                isFlying = false;
                if (!hitTarget) {
                    // Update stats for ground hit
                    const isHuman = currentProjectile === 0;
                    this.targetManager.updateStats(false, isHuman, 0);
                    this.scoreManager.resetComboOnMiss();
                }
                
                if (!isActive) {
                    const impactForce = this.physics.velocity.magnitude() / 100;
                    
                    const currentProj = projectiles[currentProjectile];
                    if (currentProj.bloodEffect) {
                        // Remove third argument from Blood constructor
                        bloodEffects.push(new Blood(
                            projectilePos.x,
                            this.physics.position.y
                        ));
                        this.soundManager.play('impact', Math.min(1, impactForce));
                    } else {
                        // Remove third argument from Explosion constructor
                        explosions.push(new Explosion(
                            projectilePos.x,
                            this.physics.position.y
                        ));
                    }
                }
            }
        }

        // Update blood effects
        bloodEffects = bloodEffects.filter(effect => {
            effect.update();
            return !effect.isFinished;
        });

        // Update explosions
        explosions = explosions.filter(explosion => {
            explosion.update();
            return !explosion.isFinished;
        });

        return {
            isFlying,
            projectilePos,
            targets,
            bloodEffects,
            explosions
        };
    }

    private checkCollision(projectile: {x: number, y: number}, target: GameObject): boolean {
        const dx = projectile.x - target.x;
        const dy = projectile.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Use target's dimensions for more accurate collision
        const hitboxRadius = Math.min(target.width, target.height) * this.COLLISION_THRESHOLD;
        
        return distance < hitboxRadius;
    }

    // Add this method to be called when firing
    startShot() {
        this.shotStartTime = Date.now();
    }
}
