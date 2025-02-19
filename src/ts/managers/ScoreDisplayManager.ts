import { ScoreData } from './ScoreManager';
import { ToastManager } from './ToastManager';

export class ScoreDisplayManager {
    updateDisplay(scoreData: ScoreData, remainingTargets: number) {
        const scoreDisplay = document.getElementById('scoreDisplay');
        const targetsDisplay = document.getElementById('targetsDisplay');
        const highScoreDisplay = document.getElementById('highScoreDisplay');
        
        if (scoreDisplay) {
            scoreDisplay.innerHTML = `
                Score: <span class="font-bold text-indigo-700">${scoreData.currentScore}</span>
                ${scoreData.combo > 1 ? `<span class="ml-2 text-xs">(${scoreData.combo}x Combo!)</span>` : ''}
            `;
        }
        if (targetsDisplay) {
            targetsDisplay.innerHTML = 
                `Targets Left: <span class="font-bold text-indigo-700">${remainingTargets}</span>`;
        }
        // Always update high score display
        if (highScoreDisplay) {
            highScoreDisplay.textContent = scoreData.highScore.toString();
        }
    }
}
