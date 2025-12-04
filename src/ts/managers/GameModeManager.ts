export class GameModeManager {
    private isHardMode: boolean = false;
    private hardModeButton: HTMLButtonElement;

    constructor(private onModeChange: (isHardMode: boolean) => void) {
        this.hardModeButton = document.getElementById('hardModeToggle') as HTMLButtonElement;
        this.initializeToggle();
    }

    private initializeToggle() {
        this.hardModeButton.addEventListener('click', () => {
            this.isHardMode = !this.isHardMode;
            this.updateUI();
            this.onModeChange(this.isHardMode);
        });
    }

    private updateUI() {
        this.hardModeButton.innerHTML = this.isHardMode ? 'Hard Mode <i class="fa-solid fa-skull"></i>' : 'Easy Mode <i class="fa-solid fa-bullseye"></i>';
        this.hardModeButton.className = this.isHardMode ?
            'px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors' :
            'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors';
    }

    isHard(): boolean {
        return this.isHardMode;
    }
}
