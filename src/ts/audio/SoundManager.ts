export class SoundManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private isMuted: boolean = false;

    constructor() {
        this.initializeSounds();
    }

    private initializeSounds() {
        // Import audio files directly using import.meta.url
        const audioFiles = {
            shoot: new URL('@assets/audio/shoot.mp3', import.meta.url).href,
            explosion: new URL('@assets/audio/explosion.mp3', import.meta.url).href,
            cry: new URL('@assets/audio/baby-cry.mp3', import.meta.url).href,
            impact: new URL('@assets/audio/splash.mp3', import.meta.url).href
        };

        Object.entries(audioFiles).forEach(([name, path]) => {
            this.loadSound(name, path);
        });
    }

    private loadSound(name: string, src: string) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        this.sounds.set(name, audio);
    }

    play(name: string, volume: number = 1.0) {
        if (this.isMuted) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;
            sound.volume = volume;
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}