import { GameStats, BabyStats, HumanStats } from '../interfaces/GameStats';

export class StatsDisplay {
    static render(stats: GameStats): string {
        return `
            <div class="bg-indigo-50 rounded-xl p-6">
                <div class="grid grid-cols-2 gap-4 text-left">
                    ${this.createMainStats(stats)}
                    ${stats.babyStats ? this.createBabyStats(stats.babyStats) : ''}
                    ${stats.humanStats ? this.createHumanStats(stats.humanStats) : ''}
                </div>
                ${this.createFunnyMessage(stats)}
            </div>
        `;
    }

    private static createMainStats(stats: GameStats): string {
        return `
            <div class="space-y-2">
                <p class="text-sm font-medium text-indigo-600">Accuracy</p>
                <p class="text-2xl font-bold">${stats.accuracy}%</p>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-indigo-600">Fastest Hit</p>
                <p class="text-2xl font-bold">${stats.fastestHit.toFixed(2)}s</p>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-indigo-600">Target Hits</p>
                <p class="text-2xl font-bold">${stats.targetHits} <i class="fa-solid fa-bullseye"></i></p>
            </div>
            <div class="space-y-2">
                <p class="text-sm font-medium text-indigo-600">Ground Hits</p>
                <p class="text-2xl font-bold">${stats.groundHits} <i class="fa-solid fa-explosion"></i></p>
            </div>
        `;
    }

    private static createBabyStats(babyStats: BabyStats): string {
        return `
            <div class="col-span-2 mt-2 p-3 bg-pink-50 rounded-lg">
                <p class="text-pink-600 font-medium">Baby Launcher Stats <i class="fa-solid fa-baby"></i></p>
                <div class="grid grid-cols-2 gap-2 mt-2">
                    <p>Babies Launched: ${babyStats.launched}</p>
                    <p>Ground Splats: ${babyStats.groundSplats}</p>
                    <p>Target Hits: ${babyStats.targetHits}</p>
                    <p>Crying Time: ${babyStats.totalCryingTime.toFixed(1)}s</p>
                </div>
            </div>
        `;
    }

    private static createHumanStats(humanStats: HumanStats): string {
        return `
            <div class="col-span-2 mt-2 p-3 bg-blue-50 rounded-lg">
                <p class="text-blue-600 font-medium">Human Launcher Stats <i class="fa-solid fa-person"></i></p>
                <div class="grid grid-cols-2 gap-2 mt-2">
                    <p>Humans Launched: ${humanStats.launched}</p>
                    <p>Cybertrucks Destroyed: ${humanStats.cybertucksDestroyed}</p>
                    <p>Insurance Claims: ${humanStats.insuranceClaims}</p>
                    <p>Property Damage: $${humanStats.propertyDamage.toLocaleString()}</p>
                </div>
            </div>
        `;
    }

    private static createFunnyMessage(stats: GameStats): string {
        let message = '';
        if (stats.groundHits > stats.targetHits) {
            message = "More splats than hits! Maybe try aiming higher? <i class='fa-solid fa-face-grin-tongue'></i>";
        } else if (stats.accuracy > 80) {
            message = "Sniper in the making! <i class='fa-solid fa-bullseye'></i>";
        } else if (stats.fastestHit < 2) {
            message = "Speed demon! <i class='fa-solid fa-bolt'></i>";
        } else {
            message = "Not bad, keep practicing! <i class='fa-solid fa-thumbs-up'></i>";
        }

        return `
            <p class="mt-4 text-indigo-600 font-medium text-center">${message}</p>
        `;
    }
}
