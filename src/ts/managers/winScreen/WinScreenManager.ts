import { GameStats } from './interfaces/GameStats';
import { StorageManager } from './utils/StorageManager';
import { ConfettiEffect } from './components/ConfettiEffect';
import { AchievementDisplay } from './components/AchievementDisplay';
import { StatsDisplay } from './components/StatsDisplay';

export class WinScreenManager {
    private overlay: HTMLDivElement;
    private achievementStats: Record<string, number>;

    constructor(private onRestart: () => void) {
        this.overlay = this.createOverlay();
        document.body.appendChild(this.overlay);
        this.achievementStats = StorageManager.loadAchievementStats();
        this.hideScreen();
        ConfettiEffect.addStyles();
    }

    showScreen(score: number, highScore: number, stats?: GameStats) {
        const isNewHighScore = score >= highScore;
        const earnedAchievements = AchievementDisplay.calculateEarned(stats || this.getDefaultStats());
        this.updateAchievementStats(earnedAchievements);
        
        this.overlay.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-2xl w-full max-w-7xl text-center transform scale-95 opacity-0 transition-all duration-500 relative overflow-hidden">
                ${this.createBackgroundEffects()}
                
                <div class="grid md:grid-cols-3 gap-8 relative z-10">
                    <!-- Left Column: Victory -->
                    <div class="flex flex-col justify-between border-r border-indigo-100 pr-8">
                        ${this.createVictorySection(score, highScore, isNewHighScore)}
                    </div>

                    <!-- Middle Column: Achievements -->
                    <div class="border-r border-indigo-100 pr-8">
                        <h3 class="text-2xl font-bold text-indigo-800 mb-6">Achievements</h3>
                        <div class="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                            ${AchievementDisplay.render(stats || this.getDefaultStats(), this.achievementStats)}
                        </div>
                    </div>

                    <!-- Right Column: Stats -->
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-indigo-800 sticky top-0 backdrop-blur-sm py-2">
                            Game Statistics
                        </h3>
                        ${StatsDisplay.render(stats || this.getDefaultStats())}
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.animateOverlay();
        
        // Create confetti effects
        ConfettiEffect.create(this.overlay, isNewHighScore);
    }

    private updateAchievementStats(earned: string[]): void {
        earned.forEach(achievement => {
            this.achievementStats[achievement] = (this.achievementStats[achievement] || 0) + 1;
        });
        StorageManager.saveAchievementStats(this.achievementStats);
    }

    private getDefaultStats(): GameStats {
        return {
            accuracy: 0,
            fastestHit: 0,
            targetHits: 0,
            groundHits: 0
        };
    }

    private createOverlay(): HTMLDivElement {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm z-50';
        return overlay;
    }

    private createBackgroundEffects(): string {
        return `
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full filter blur-3xl"></div>
                <div class="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full filter blur-3xl"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-400 rounded-full filter blur-3xl"></div>
            </div>
        `;
    }

    private createHighScoreContent(score: number): string {
        return `
            <div class="relative p-6">
                <div class="animate-float">
                    <div class="flex justify-center items-center space-x-4 mb-8">
                        <span class="text-8xl animate-bounce-slow">🎯</span>
                        <span class="text-8xl animate-bounce-slow delay-150">🏆</span>
                        <span class="text-8xl animate-bounce-slow delay-300">🌟</span>
                    </div>
                    <h2 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r 
                        from-yellow-400 via-pink-500 to-purple-600 animate-gradient-x py-2 mb-6">
                        NEW RECORD!
                    </h2>
                    <div class="text-7xl font-black text-indigo-600 animate-pulse-slow">
                        ${score}
                    </div>
                </div>
            </div>
        `;
    }

    private createVictoryContent(score: number, highScore: number): string {
        return `
            <div>
                <div class="text-6xl mb-4">🎯</div>
                <h2 class="text-5xl font-bold text-indigo-600 mb-4">Victory!</h2>
                <div class="space-y-2">
                    <p class="text-3xl font-bold text-gray-700">Score: <span class="text-indigo-600">${score}</span></p>
                    <p class="text-xl text-gray-600">High Score: <span class="font-bold text-yellow-600">${highScore}</span></p>
                </div>
            </div>
        `;
    }

    private createVictorySection(score: number, highScore: number, isNewHighScore: boolean): string {
        return `
            <div>
                ${isNewHighScore ? 
                    this.createHighScoreContent(score) : 
                    this.createVictoryContent(score, highScore)}
            </div>
            <div class="mt-auto">
                ${this.createRestartButton()}
            </div>
        `;
    }

    private createRestartButton(): string {
        return `
            <div class="flex flex-col gap-4">
                <button id="restartButton" 
                    class="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-10 py-4 rounded-xl font-bold text-xl
                    hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg w-full">
                    <span class="flex items-center justify-center gap-3">
                        Play Again! 
                        <span class="group-hover:rotate-180 transition-transform duration-300">🚀</span>
                    </span>
                </button>
                
                <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <kbd class="px-2 py-1 bg-gray-100 rounded-md shadow">SPACE</kbd>
                    <span>to restart</span>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                this.hideScreen();
                this.onRestart();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        const restartButton = this.overlay.querySelector('#restartButton');
        restartButton?.addEventListener('click', () => {
            this.hideScreen();
            this.onRestart();
            document.removeEventListener('keydown', handleKeyPress);
        });
    }

    private animateOverlay(): void {
        this.overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            const modal = this.overlay.querySelector('div');
            if (modal) {
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            }
        });
    }

    hideScreen(): void {
        const modal = this.overlay.querySelector('div');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.95)';
        }
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.innerHTML = '';
        }, 500);
    }
}
