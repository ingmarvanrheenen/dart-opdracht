export class ConsoleManager {
    private mouseX: number = 0;
    private mouseY: number = 0;
    private launcherX: number = 50;
    private launcherY: number = 450;
    private isAiming: boolean = false;
    private enabled: boolean = true;

    constructor(
        private canvas: HTMLCanvasElement,
        private onAngleChange: (angle: number) => void,
        private onPowerChange: (power: number) => void,
        private onFire: () => void
    ) {
        this.initializeMouseControls();
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (!enabled) {
            this.isAiming = false;
        }
    }

    private initializeMouseControls() {
        // Track mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.enabled) return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            
            if (this.isAiming) {
                this.updateAim();
            }
        });

        // Start aiming on mouse down
        this.canvas.addEventListener('mousedown', () => {
            if (!this.enabled) return;
            this.isAiming = true;
            this.updateAim();
        });

        // Fire on mouse up
        this.canvas.addEventListener('mouseup', () => {
            if (this.isAiming) {
                this.isAiming = false;
                this.onFire();
            }
        });
    }

    private updateAim() {
        // Calculate angle
        const dx = this.mouseX - this.launcherX;
        const dy = this.mouseY - this.launcherY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Constrain angle between 0 and 180 degrees
        if (angle < -90) angle = 0;
        if (angle > 90) angle = 180;
        angle = Math.abs(angle);

        // Calculate power based on distance
        const distance = Math.sqrt(dx * dx + dy * dy);
        const power = Math.min(Math.floor(distance / 4), 100);

        // Update angle and power
        this.onAngleChange(angle);
        this.onPowerChange(power);
    }

    private getPower(): number {
        const dx = this.mouseX - this.launcherX;
        const dy = this.mouseY - this.launcherY;
        return Math.min(Math.floor(Math.sqrt(dx * dx + dy * dy) / 4), 100);
    }

    getMousePosition() {
        return {
            x: this.mouseX,
            y: this.mouseY
        };
    }

    getIsAiming() {
        return this.isAiming;
    }
}
