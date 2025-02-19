export class ToastManager {
    private static readonly sillyMessages = {
        success: [
            "🎯 BOOM-SHAKALAKA!",
            "🚀 That was out of this world!",
            "🎪 Step right up, we have a winner!",
            "🦄 Magic happens!",
            "🎭 Oscar-worthy shot!",
            "🌟 You're on fire! (not literally)",
            "🎪 The crowd goes wild!",
            "🎮 Pro gamer move!",
            "🎪 Skill level: LEGENDARY",
            "🎯 You could do this blindfolded! (please don't)"
        ],
        error: [
            "🤦‍♂️ Oopsie daisy!",
            "🎭 Plot twist: That wasn't supposed to happen",
            "🌪️ Gone with the wind!",
            "🎪 Task failed successfully!",
            "🎮 Have you tried turning it off and on again?",
            "🎯 Close! (not really)",
            "🌟 At least you tried!",
            "🎪 The crowd goes mild...",
            "🎭 Drama queen much?",
            "🦄 Even unicorns miss sometimes"
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
        toast.textContent = sillyMessage;
        
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
