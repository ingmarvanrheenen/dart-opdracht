export interface Achievement {
    emoji: string;
    text: string;
    requirement: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    SHARP_SHOOTER: { emoji: '🎯', text: 'Sharp Shooter', requirement: 'Achieve 80%+ accuracy' },
    SPEED_DEMON: { emoji: '⚡', text: 'Speed Demon', requirement: 'Hit a target in under 2 seconds' },
    COMBO_MASTER: { emoji: '🔥', text: 'Combo Master', requirement: 'Get a 5x combo' },
    BABY_BOSS: { emoji: '👶', text: 'Baby Boss', requirement: 'Launch 10 babies successfully' },
    HUMAN_HERO: { emoji: '🦸‍♂️', text: 'Human Hero', requirement: 'Destroy 10 Cybertrucks' },
    DESTRUCTION_KING: { emoji: '💥', text: 'Destruction King', requirement: 'Cause $1M+ in damage' },
    PERFECT_ROUND: { emoji: '✨', text: 'Perfect Round', requirement: 'No ground hits in a game' }
};
