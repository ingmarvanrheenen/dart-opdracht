export class ConfettiEffect {
    private static readonly COLORS = [
        '#FFD700', '#FF577F', '#FF884B', '#4477CE', 
        '#7752FE', '#8E8FFA', '#C2D9FF', '#FFF1DC',
        '#FFA500', '#FF69B4', '#00FF00', '#4169E1'
    ];

    private static readonly BURST_POINTS = [
        { x: '10%', y: '-5%' },
        { x: '30%', y: '-5%' },
        { x: '50%', y: '-5%' },
        { x: '70%', y: '-5%' },
        { x: '90%', y: '-5%' }
    ];

    static create(container: HTMLElement, isHighScore: boolean = false): void {
        // Initial burst
        this.createMultipleBursts(container);

        // Extra bursts for high score
        if (isHighScore) {
            setTimeout(() => {
                this.createMultipleBursts(container);
                setTimeout(() => this.createMultipleBursts(container), 500);
            }, 1000);
        }
    }

    private static createMultipleBursts(container: HTMLElement): void {
        this.BURST_POINTS.forEach((point, index) => {
            setTimeout(() => {
                this.createBurst(container, point.x, point.y);
            }, index * 200);
        });
    }

    private static createBurst(container: HTMLElement, x: string, y: string): void {
        const confettiCount = 60;
        const spread = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const size = Math.random() * 12 + 6;
            const isSquare = Math.random() > 0.5;
            const startingX = `calc(${x} + ${(Math.random() - 0.5) * spread}px)`;
            
            // Create different shapes
            if (isSquare) {
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            } else {
                confetti.style.width = `${size * 0.3}px`;
                confetti.style.height = `${size}px`;
            }

            // Set base styles
            Object.assign(confetti.style, {
                position: 'fixed',
                left: startingX,
                top: y,
                backgroundColor: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
                zIndex: '1000',
                pointerEvents: 'none',
                boxShadow: '0 0 4px rgba(0,0,0,0.2)',
            });

            // Apply animation
            this.animateConfetti(confetti);
            
            // Add to container and clean up
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    private static animateConfetti(element: HTMLDivElement): void {
        const randomX = (Math.random() - 0.5) * 400;
        const randomRotation = 960 + Math.random() * 720;
        const randomZ = Math.random() * 50;
        const duration = 2500 + Math.random() * 1500;

        element.animate([
            { 
                transform: 'translate3d(0, 0, 0) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translate3d(${randomX}px, ${window.innerHeight + 100}px, ${randomZ}px) rotate(${randomRotation}deg)`,
                opacity: 0
            }
        ], {
            duration,
            easing: 'cubic-bezier(.37,.74,.72,.87)',
            fill: 'forwards'
        });
    }

    static addStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(960deg);
                    opacity: 0;
                }
            }

            @keyframes confettiSway {
                0% {
                    transform: translateX(-10px);
                }
                100% {
                    transform: translateX(10px);
                }
            }

            .confetti-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
            }
        `;
        document.head.appendChild(style);
    }
}
