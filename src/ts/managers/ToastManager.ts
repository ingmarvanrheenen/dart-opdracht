export class ToastManager {
    private static readonly sillyMessages = {
        success: [
            "<i class='fa-solid fa-bullseye'></i> BOOM-SHAKALAKA!",
            "<i class='fa-solid fa-rocket'></i> That was out of this world!",
            "<i class='fa-solid fa-tent'></i> Step right up, we have a winner!",
            "<i class='fa-solid fa-wand-magic-sparkles'></i> Magic happens!",
            "<i class='fa-solid fa-masks-theater'></i> Oscar-worthy shot!",
            "<i class='fa-solid fa-star'></i> You're on fire! (not literally)",
            "<i class='fa-solid fa-tent'></i> The crowd goes wild!",
            "<i class='fa-solid fa-gamepad'></i> Pro gamer move!",
            "<i class='fa-solid fa-tent'></i> Skill level: LEGENDARY",
            "<i class='fa-solid fa-bullseye'></i> You could do this blindfolded! (please don't)"
        ],
        error: [
            "<i class='fa-solid fa-face-flushed'></i> Oopsie daisy!",
            "<i class='fa-solid fa-masks-theater'></i> Plot twist: That wasn't supposed to happen",
            "<i class='fa-solid fa-wind'></i> Gone with the wind!",
            "<i class='fa-solid fa-tent'></i> Task failed successfully!",
            "<i class='fa-solid fa-gamepad'></i> Have you tried turning it off and on again?",
            "<i class='fa-solid fa-bullseye'></i> Close! (not really)",
            "<i class='fa-solid fa-star'></i> At least you tried!",
            "<i class='fa-solid fa-tent'></i> The crowd goes mild...",
            "<i class='fa-solid fa-masks-theater'></i> Drama queen much?",
            "<i class='fa-solid fa-horse'></i> Even unicorns miss sometimes"
        ]
    };

    static show(message: string, type: 'success' | 'error' = 'success') {
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!canvas || !canvas.parentElement) return;

        const sillyMessage = message || this.getRandomMessage(type);
        const toast = document.createElement('div');
        toast.className = `absolute px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out opacity-0 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        
        toast.style.bottom = '100px';
        toast.style.right = '25px';
        toast.innerHTML = sillyMessage;
        
        canvas.parentElement.style.position = 'relative';
        canvas.parentElement.appendChild(toast);
        
        // Add bounce animation
        toast.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    private static getRandomMessage(type: 'success' | 'error'): string {
        const messages = this.sillyMessages[type];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}
