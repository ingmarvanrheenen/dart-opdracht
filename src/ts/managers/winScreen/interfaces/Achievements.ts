export interface Achievement {
    iconClass: string;
    text: string;
    requirement: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    SHARP_SHOOTER: { iconClass: 'fa-solid fa-bullseye', text: 'Sharp Shooter', requirement: 'Achieve 80%+ accuracy' },
    SPEED_DEMON: { iconClass: 'fa-solid fa-bolt', text: 'Speed Demon', requirement: 'Hit a target in under 2 seconds' },
    COMBO_MASTER: { iconClass: 'fa-solid fa-fire', text: 'Combo Master', requirement: 'Get a 5x combo' },
    BABY_BOSS: { iconClass: 'fa-solid fa-baby', text: 'Baby Boss', requirement: 'Launch 10 babies successfully' },
    HUMAN_HERO: { iconClass: 'fa-solid fa-mask', text: 'Human Hero', requirement: 'Destroy 10 Cybertrucks' },
    DESTRUCTION_KING: { iconClass: 'fa-solid fa-explosion', text: 'Destruction King', requirement: 'Cause $1M+ in damage' },
    PERFECT_ROUND: { iconClass: 'fa-solid fa-wand-magic-sparkles', text: 'Perfect Round', requirement: 'No ground hits in a game' }
};
