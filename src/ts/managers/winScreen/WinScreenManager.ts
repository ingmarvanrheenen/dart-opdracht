import { GameStats } from './interfaces/GameStats';
import { StorageManager } from './utils/StorageManager';
import { ConfettiEffect } from './components/ConfettiEffect';
import { AchievementDisplay } from './components/AchievementDisplay';
import { StatsDisplay } from './components/StatsDisplay';

export class WinScreenManager {
    private overlay: HTMLDivElement;
    private achievementStats: Record<string, number>;
    private cleanupController: AbortController | null = null;

    constructor(private onRestart: () => void) {
        this.overlay = this.createOverlay();
        document.body.appendChild(this.overlay);
        this.achievementStats = StorageManager.loadAchievementStats();
        this.injectCustomStyles();
        this.hideScreen();
        ConfettiEffect.addStyles();
    }

    showScreen(score: number, highScore: number, stats?: GameStats) {
        const isNewHighScore = score >= highScore;
        const currentStats = stats || this.getDefaultStats();
        
        // Calculate achievements
        const earnedAchievements = AchievementDisplay.calculateEarned(currentStats);
        this.updateAchievementStats(earnedAchievements);
        
        // Render Content
        this.overlay.innerHTML = `
            <div class="relative w-full max-w-7xl mx-auto transform transition-all duration-500 opacity-0 scale-95" id="win-modal-content">
                
                <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
                    
                    ${this.createBackgroundEffects()}

                    <div class="relative z-10 grid md:grid-cols-12 gap-0">
                        
                        <div class="md:col-span-4 bg-gradient-to-b from-brand-50/50 to-white/50 p-8 border-r border-brand-100/50 flex flex-col justify-between h-[80vh] max-h-[90vh] overflow-y-auto">
                            ${this.createVictorySection(score, highScore, isNewHighScore)}
                        </div>

                        <div class="md:col-span-4 p-8 border-r border-brand-100/50 flex flex-col h-[80vh] max-h-[90vh] overflow-y-auto bg-slate-50/30">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="p-2 bg-brand-100 text-brand-600 rounded-lg">
                                    <i class="fa-solid fa-medal text-xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-gray-800">Achievements</h3>
                            </div>
                            
                            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                ${AchievementDisplay.render(currentStats, this.achievementStats)}
                            </div>
                        </div>

                        <div class="md:col-span-4 p-8 flex flex-col h-[80vh] max-h-[90vh] overflow-y-auto bg-slate-50/30">
                             <div class="flex items-center gap-3 mb-6">
                                <div class="p-2 bg-brand-100 text-brand-600 rounded-lg">
                                    <i class="fa-solid fa-chart-pie text-xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-gray-800">Session Stats</h3>
                            </div>

                            <div class="flex-1 overflow-y-auto">
                                ${StatsDisplay.render(currentStats)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.animateOverlayEntrance();
        
        if (isNewHighScore) {
            ConfettiEffect.create(this.overlay, true);
        } else {
            ConfettiEffect.create(this.overlay, false);
        }
    }

    // ... (The rest of the private methods remain exactly the same as before)
    private updateAchievementStats(earned: string[]): void {
        let changed = false;
        earned.forEach(achievement => {
            if (!this.achievementStats[achievement]) changed = true;
            this.achievementStats[achievement] = (this.achievementStats[achievement] || 0) + 1;
        });
        if (changed || earned.length > 0) {
            StorageManager.saveAchievementStats(this.achievementStats);
        }
    }

    private getDefaultStats(): GameStats {
        return { accuracy: 0, fastestHit: 0, targetHits: 0, groundHits: 0 };
    }

    private createOverlay(): HTMLDivElement {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 z-50 opacity-0 pointer-events-none';
        return overlay;
    }

    private createBackgroundEffects(): string {
        return `
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-24 -left-24 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-300/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
            </div>
        `;
    }

    private createVictorySection(score: number, highScore: number, isNewHighScore: boolean): string {
        const title = isNewHighScore ? "New Record!" : "Complete!";
        
        const scoreColor = isNewHighScore 
            ? "bg-gradient-to-r from-amber-400 to-brand-500 bg-clip-text text-transparent" 
            : "text-brand-600";
        
        const icon = isNewHighScore ? "fa-trophy text-amber-400" : "fa-flag-checkered text-brand-500";

        return `
            <div class="text-center mt-4">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg mb-6">
                    <i class="fa-solid ${icon} text-4xl"></i>
                </div>
                
                <h2 class="text-4xl font-black text-slate-800 mb-2 tracking-tight">${title}</h2>
                <div class="text-sm font-medium text-slate-400 uppercase tracking-wider mb-8">Match Result</div>

                <div class="space-y-6">
                    <div class="bg-white/60 rounded-2xl p-6 shadow-sm border border-white/50">
                        <div class="text-sm text-slate-500 mb-1">Final Score</div>
                        <div class="text-6xl font-black ${scoreColor} tracking-tighter">
                            ${score}
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-2 text-slate-600 font-medium bg-slate-100/50 py-2 rounded-lg">
                        <i class="fa-solid fa-crown text-amber-500"></i>
                        <span>Best: ${Math.max(score, highScore)}</span>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <button id="restartButton" 
                    class="group relative w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-200 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span class="relative flex items-center justify-center gap-2">
                        Play Again <i class="fa-solid fa-rotate-right group-hover:rotate-180 transition-transform duration-500"></i>
                    </span>
                </button>
                <div class="text-center mt-3">
                    <span class="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">SPACE</span>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        this.cleanupController = new AbortController();
        const { signal } = this.cleanupController;

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleRestart();
            }
        }, { signal });

        const btn = this.overlay.querySelector('#restartButton');
        btn?.addEventListener('click', () => this.handleRestart(), { signal });
    }

    private handleRestart(): void {
        if (this.cleanupController?.signal.aborted) return;
        this.hideScreen();
        setTimeout(() => this.onRestart(), 300);
    }

    private animateOverlayEntrance(): void {
        this.overlay.style.display = 'flex';
        this.overlay.style.pointerEvents = 'auto';
        this.overlay.offsetHeight; 
        this.overlay.style.opacity = '1';
        
        const content = this.overlay.querySelector('#win-modal-content') as HTMLElement;
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }
    }

    hideScreen(): void {
        if (this.cleanupController) {
            this.cleanupController.abort();
            this.cleanupController = null;
        }

        const content = this.overlay.querySelector('#win-modal-content') as HTMLElement;
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
        }
        this.overlay.style.opacity = '0';
        this.overlay.style.pointerEvents = 'none';

        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.innerHTML = '';
        }, 300);
    }

    private injectCustomStyles(): void {
        if (document.getElementById('win-screen-styles')) return;
        const style = document.createElement('style');
        style.id = 'win-screen-styles';
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(252, 61, 3, 0.2); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(252, 61, 3, 0.5); }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            .animate-bounce-slow { animation: float 3s ease-in-out infinite; }
        `;
        document.head.appendChild(style);
    }
}