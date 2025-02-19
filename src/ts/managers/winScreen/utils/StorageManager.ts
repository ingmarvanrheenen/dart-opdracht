import { ACHIEVEMENTS } from '../interfaces/Achievements';

export class StorageManager {
    private static readonly STORAGE_KEY = 'achievementStats';

    static loadAchievementStats(): Record<string, number> {
        try {
            const savedStats = localStorage.getItem(this.STORAGE_KEY);
            if (savedStats) {
                return JSON.parse(savedStats);
            }
            
            // Initialize with zero counts
            const initialStats: Record<string, number> = {};
            Object.keys(ACHIEVEMENTS).forEach(key => {
                initialStats[key] = 0;
            });
            this.saveAchievementStats(initialStats);
            return initialStats;
        } catch (e) {
            console.error('Error loading achievement stats:', e);
            return {};
        }
    }

    static saveAchievementStats(stats: Record<string, number>): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
        } catch (e) {
            console.error('Error saving achievement stats:', e);
        }
    }
}
