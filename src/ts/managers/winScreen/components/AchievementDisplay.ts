import { GameStats } from '../interfaces/GameStats';
import { ACHIEVEMENTS } from '../interfaces/Achievements';

export class AchievementDisplay {
    static calculateEarned(stats: GameStats): string[] {
        const earned = [];
        if (stats.accuracy >= 80) earned.push('SHARP_SHOOTER');
        if (stats.fastestHit <= 2) earned.push('SPEED_DEMON');
        if (stats.groundHits === 0) earned.push('PERFECT_ROUND');
        
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
            <div class="space-y-4">
                <div class="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 shadow-lg">
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
                                     flex items-center gap-3 p-3 rounded-lg ${isEarned ? 'bg-white' : 'bg-gray-100'}
                                     transition-all duration-300 hover:scale-102">
                                    <span class="text-2xl ${isEarned ? 'animate-bounce-slow' : ''}">${ach.emoji}</span>
                                    <div class="flex flex-col flex-1 text-left">
                                        <div class="flex justify-between items-center">
                                            <span class="font-medium text-sm">${ach.text}</span>
                                            <span class="text-xs bg-indigo-100 px-2 py-1 rounded-full">
                                                ${totalEarned}x earned
                                            </span>
                                        </div>
                                        <span class="text-xs text-gray-500">${ach.requirement}</span>
                                    </div>
                                    ${isEarned ? '<span class="text-green-500">✓</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ${this.createFunnyMessage(stats, earnedAchievements)}
            </div>
        `;
    }

    private static createFunnyMessage(stats: GameStats, achievements: string[]): string {
        let message = '';
        if (achievements.length === 0) {
            message = "Keep practicing! You'll get there! 🎯";
        } else if (achievements.includes('PERFECT_ROUND')) {
            message = "Perfect aim! You're a natural! 🌟";
        } else if (achievements.includes('SHARP_SHOOTER')) {
            message = "Sniper in the making! 🎯";
        } else if (achievements.includes('SPEED_DEMON')) {
            message = "Lightning fast! ⚡";
        } else if (stats.groundHits > stats.targetHits) {
            message = "More splats than hits! Maybe try aiming higher? 🤪";
        } else {
            message = "Not bad! Keep going for more achievements! 👍";
        }

        return `
            <div class="bg-indigo-50 p-4 rounded-lg mt-4">
                <p class="text-lg font-medium text-indigo-600 animate-pulse-slow">
                    ${message}
                </p>
            </div>
        `;
    }
}
