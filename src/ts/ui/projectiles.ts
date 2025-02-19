import humanImg from '@assets/human.png';
import babyImg from '@assets/baby.png';
import bloodImg from '@assets/blood.png';

export interface Projectile {
    id: number;
    image: string;
    name: string;
    size: {
        width: number;
        height: number;
    };
    bloodEffect?: boolean;
}

export const projectiles: Projectile[] = [
    { id: 0, image: humanImg, name: 'Human', size: { width: 30, height: 30 }, bloodEffect: true },
    { id: 1, image: babyImg, name: 'Baby', size: { width: 40, height: 40 }, bloodEffect: true }
];
