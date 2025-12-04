import { GameStats } from '../interfaces/GameStats';
import { ACHIEVEMENTS } from '../interfaces/Achievements';

export class AchievementDisplay {
    static calculateEarned(stats: GameStats): string[] {
        const earned = [];
        if (stats.accuracy >= 80) earned.push('SHARP_SHOOTER');
        if (stats.fastestHit > 0 && stats.fastestHit <= 2) earned.push('SPEED_DEMON');
        if (stats.groundHits === 0 && stats.targetHits > 0) earned.push('PERFECT_ROUND');
        
        // Safely check optional stats
        if (stats.babyStats && stats.babyStats.targetHits >= 10) {
            earned.push('BABY_BOSS');
        }
        
        if (stats.humanStats) {
            if (stats.humanStats.cybertucksDestroyed >= 10) {
                earned.push('HUMAN_HERO');
            }
            if (stats.humanStats.propertyDamage >= 1000000) {
                earned.push('DESTRUCTION_KING');
            }
        }

        return earned;
    }

    static render(stats: GameStats, achievementStats: Record<string, number>): string {
        const earnedAchievements = this.calculateEarned(stats);
        const totalAchievements = Object.keys(ACHIEVEMENTS).length;

        return `
            <div class="bg-indigo-50 rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-bold text-indigo-800">Progress</h4>
                    <span class="text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                        ${earnedAchievements.length}/${totalAchievements}
                    </span>
                </div>
                <div class="space-y-3">
                    ${Object.entries(ACHIEVEMENTS).map(([key, ach]) => {
                            const isEarned = earnedAchievements.includes(key);
                            const totalEarned = achievementStats[key] || 0;
                            
                            return `
                                <div class="achievement-item ${isEarned ? 'opacity-100' : 'opacity-40'} 
                                     flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-white/50
                                     transition-all duration-300 hover:scale-102">
                                    <span class="text-2xl ${isEarned ? 'animate-bounce-slow' : ''}"><i class="${ach.iconClass}"></i></span>
                                    <div class="flex flex-col flex-1 text-left">
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium text-sm">${ach.text}</span>
                                            <span class="text-xs bg-indigo-100 px-2 py-1 rounded-full">
                                                ${totalEarned}x earned
                                            </span>
                                        </div>
                                        <span class="text-xs text-gray-500">${ach.requirement}</span>
                                    </div>
                                    ${isEarned ? '<span class="text-green-500"><i class="fa-solid fa-check"></i></span>' : ''}
                                </div>
                            `;
                    }).join('')}
                </div>
                ${this.createFunnyMessage(stats, earnedAchievements)}
            </div>
        `;
    }

    private static createFunnyMessage(stats: GameStats, achievements: string[]): string {
        let message = '';
        if (achievements.length === 0) {
            message = "Keep practicing! You'll get there! <i class='fa-solid fa-bullseye'></i>";
        } else if (achievements.includes('PERFECT_ROUND')) {
            message = "Perfect aim! You're a natural! <i class='fa-solid fa-star'></i>";
        } else if (achievements.includes('SHARP_SHOOTER')) {
            message = "Sniper in the making! <i class='fa-solid fa-bullseye'></i>";
        } else if (achievements.includes('SPEED_DEMON')) {
            message = "Lightning fast! <i class='fa-solid fa-bolt'></i>";
        } else if (stats.groundHits > stats.targetHits) {
            message = "More splats than hits! Maybe try aiming higher? <i class='fa-solid fa-face-grin-tongue'></i>";
        } else {
            message = "Not bad! Keep going for more achievements! <i class='fa-solid fa-thumbs-up'></i>";
        }

        return `
            <p class="mt-4 text-indigo-600 font-medium text-center">${message}</p>
        `;
    }
}
