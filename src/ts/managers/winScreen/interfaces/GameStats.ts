export interface GameStats {
    accuracy: number;
    fastestHit: number;
    targetHits: number;
    groundHits: number;
    babyStats?: BabyStats;
    humanStats?: HumanStats;
}

export interface BabyStats {
    launched: number;
    groundSplats: number;
    targetHits: number;
    totalCryingTime: number;
}

export interface HumanStats {
    launched: number;
    cybertucksDestroyed: number;
    insuranceClaims: number;
    propertyDamage: number;
}
