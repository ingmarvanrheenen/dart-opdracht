import { ToastManager } from './ToastManager';

export interface ScoreData {
    currentScore: number;
    highScore: number;
    combo: number;
    multiplier: number;
}

export class ScoreManager {
    private currentScore: number = 0;
    private highScore: number = 0;
    private combo: number = 0;
    private multiplier: number = 1;
    private readonly COMBO_TIMEOUT = 5000; // 5 seconds
    private lastHitTime: number = 0;

    constructor() {
        this.loadHighScore();
    }

    addPoints(basePoints: number, distance: number): number {
        const now = Date.now();
        
        // Check if combo is still active
        if (now - this.lastHitTime > this.COMBO_TIMEOUT) {
            this.resetCombo();
        }

        // Increase combo
        this.combo++;
        this.updateMultiplier();
        this.lastHitTime = now;

        // Calculate bonus points based on distance
        const distanceBonus = Math.floor(distance / 100) * 50;
        
        // Calculate total points with multiplier
        const totalPoints = Math.floor((basePoints + distanceBonus) * this.multiplier);
        
        this.currentScore += totalPoints;
        
        // Immediately save if it's a new high score
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScoreToPersistence();
        }

        return totalPoints;
    }

    private updateMultiplier() {
        // Increase multiplier for consecutive hits
        if (this.combo >= 5) this.multiplier = 4;
        else if (this.combo >= 3) this.multiplier = 2;
        else if (this.combo >= 2) this.multiplier = 1.5;
        else this.multiplier = 1;
    }

    private resetCombo() {
        this.combo = 0;
        this.multiplier = 1;
    }

    resetComboOnMiss() {
        this.combo = 0;
        this.multiplier = 1;
        // Update display to show reset combo
        this.updateDisplay();
    }

    private updateDisplay() {
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.innerHTML = `
                Score: <span class="font-bold text-indigo-700">${this.currentScore}</span>
                ${this.combo > 1 ? `<span class="ml-2 text-xs">(${this.combo}x Combo!)</span>` : ''}
            `;
        }
    }

    private setCookie(name: string, value: string, days: number) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    private getCookie(name: string): string | null {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    private loadHighScore() {
        try {
            // Try localStorage first
            const savedData = localStorage.getItem('gameScores');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.highScore = Number(data.highScore) || 0;
            } else {
                // Try cookies as backup
                const cookieScore = this.getCookie('highScore');
                if (cookieScore) {
                    this.highScore = Number(cookieScore);
                }
            }
        } catch (e) {
            console.error('Error loading high score:', e);
            // Try cookies as fallback
            const cookieScore = this.getCookie('highScore');
            if (cookieScore) {
                this.highScore = Number(cookieScore);
            }
        }

        // Update display
        const highScoreDisplay = document.getElementById('highScoreDisplay');
        if (highScoreDisplay) {
            highScoreDisplay.textContent = this.highScore.toString();
        }
    }

    private saveHighScoreToPersistence() {
        try {
            // Save to localStorage
            const data = {
                highScore: this.highScore,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('gameScores', JSON.stringify(data));
            
            // Save to cookie as backup
            this.setCookie('highScore', this.highScore.toString(), 365);
            
            // Update display
            const highScoreDisplay = document.getElementById('highScoreDisplay');
            if (highScoreDisplay) {
                highScoreDisplay.textContent = this.highScore.toString();
            }
        } catch (e) {
            console.error('Error saving high score:', e);
            // Fallback to just cookie if localStorage fails
            this.setCookie('highScore', this.highScore.toString(), 365);
        }
    }

    saveHighScore(): boolean {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScoreToPersistence();
            ToastManager.show(`New High Score: ${this.highScore}! <i class="fa-solid fa-trophy"></i>`);
            return true;
        }
        return false;
    }

    getScoreData(): ScoreData {
        return {
            currentScore: this.currentScore,
            highScore: this.highScore,
            combo: this.combo,
            multiplier: this.multiplier
        };
    }

    resetScore() {
        // Save high score before resetting if needed
        if (this.currentScore > this.highScore) {
            this.saveHighScore();
        }
        this.currentScore = 0;
        this.resetCombo();
    }
}
