import { Vector2D } from './Vector2D';

export interface PhysicsConfig {
    gravity: number;
    airResistance: number;
    windStrength: number;
    groundHeight: number;
    isWeirdMode: boolean;  // Add this line
}

export class ProjectilePhysics {
    public position: Vector2D;
    public velocity: Vector2D;
    private readonly config: PhysicsConfig;

    constructor(config: PhysicsConfig) {
        this.position = new Vector2D();
        this.velocity = new Vector2D();
        this.config = config;
    }

    launch(angle: number, power: number, startPos: Vector2D) {
        const angleRad = (angle * Math.PI) / 180;
        const velocity = power * 0.3;
        this.velocity = new Vector2D(
            Math.cos(angleRad) * velocity,
            -Math.sin(angleRad) * velocity
        );
        this.position = startPos.clone();
    }

    update(): boolean {
        if (this.config.isWeirdMode) {
            // Add weird physics effects
            const time = Date.now() / 1000;
            
            // Wavy motion
            this.velocity.x += Math.sin(time * 5) * 0.5;
            this.velocity.y += Math.cos(time * 3) * 0.3;
            
            // Random bursts
            if (Math.random() < 0.05) {
                this.velocity.x += (Math.random() - 0.5) * 5;
                this.velocity.y += (Math.random() - 0.5) * 5;
            }
            
            // Spiral effect
            const angle = time * 2;
            const spiralForce = 0.3;
            this.velocity.x += Math.cos(angle) * spiralForce;
            this.velocity.y += Math.sin(angle) * spiralForce;
        }

        // Apply wind
        this.velocity.x += this.config.windStrength;
        
        // Update position
        this.position = this.position.add(this.velocity);
        
        // Apply gravity
        this.velocity.y += this.config.gravity;
        
        // Apply air resistance
        this.velocity.applyFriction(this.config.airResistance);

        // Check if hit ground or out of bounds
        return this.position.y <= this.config.groundHeight;
    }
}
