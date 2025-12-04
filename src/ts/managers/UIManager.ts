import { projectiles } from '../ui/projectiles';
import { TargetManager } from './TargetManager';

export class UIManager {
    private targetManager?: TargetManager;
    constructor(
        private onAngleChange: (angle: number) => void,
        private onPowerChange: (power: number) => void,
        private onProjectileSelect: (index: number) => void,
        private onFire: () => void,
        private onMuteToggle: () => boolean
    ) {
        this.initializeUI();
        this.renderProjectileButtons();
    }

    setTargetManager(manager: TargetManager) {
        this.targetManager = manager;
    }

    private initializeUI() {
        // Update angle display
        const angleSlider = document.getElementById('angleSlider') as HTMLInputElement;
        const angleDisplay = document.getElementById('angleDisplay') as HTMLElement;
        angleSlider.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            const angle = parseInt(value);
            angleDisplay.textContent = `${value}°`;
            this.onAngleChange(angle);
        });

        // Update power display
        const powerSlider = document.getElementById('powerSlider') as HTMLInputElement;
        const powerDisplay = document.getElementById('powerDisplay') as HTMLElement;
        powerSlider.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            const power = parseInt(value);
            powerDisplay.textContent = `${value}%`;
            this.onPowerChange(power);
        });

        // Projectile selection
        document.querySelectorAll('.projectile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.projectile-btn').forEach(b => 
                    b.classList.remove('selected'));
                const button = e.currentTarget as HTMLElement;
                button.classList.add('selected');
                const index = parseInt(button.getAttribute('data-value') || '0');
                this.onProjectileSelect(index);
            });
        });

        // Fire button
        const fireButton = document.getElementById('fireButton');
        fireButton?.addEventListener('click', () => this.onFire());

        // Add mute button
        const muteBtn = document.getElementById('muteButton');
        muteBtn?.addEventListener('click', () => {
            const isMuted = this.onMuteToggle();
            muteBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
        });
    }

    private renderProjectileButtons() {
        const container = document.querySelector('.grid.grid-cols-3.gap-2');
        if (!container) return;

        container.innerHTML = projectiles.map(proj => `
            <button class="projectile-btn group relative p-2 bg-white rounded-lg border-2 border-indigo-100 hover:border-indigo-300 transition-all" data-value="${proj.id}">
                <img src="${proj.image}" alt="${proj.name}" class="w-8 h-8 object-contain mx-auto">
                <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">
                    ${proj.name}
                </div>
            </button>
        `).join('');

        // Update click handlers for projectile buttons
        document.querySelectorAll('.projectile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.projectile-btn').forEach(b => 
                    b.classList.remove('selected', 'border-indigo-500'));
                const button = e.currentTarget as HTMLElement;
                button.classList.add('selected', 'border-indigo-500');
                const index = parseInt(button.getAttribute('data-value') || '0');
                
                // First notify the game of projectile change
                this.onProjectileSelect(index);
                // Then update target images
                if (this.targetManager) {
                    this.targetManager.updateTargetImage(index);
                }
            });
        });

        // Select human projectile by default and trigger its click event
        const humanBtn = document.querySelector('.projectile-btn[data-value="0"]') as HTMLElement;
        if (humanBtn) {
            humanBtn.click(); // This will trigger all necessary updates
        }
    }
}
