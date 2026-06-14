export const R_KEYS = ['wood', 'stone', 'iron', 'gold', 'crimstone'];

export const R_DATA = {
    wood: { e: '🪵', c: '#b45309', base: true },
    stone: { e: '🪨', c: '#78716c' },
    iron: { e: '⚒️', c: '#c2410c' },
    gold: { e: '🥇', c: '#ca8a04' },
    crimstone: { e: '🔴', c: '#dc2626' }
};

export const PICKS = {
    stone: { ing: { wood: 3 }, coins: 20 },
    iron: { ing: { wood: 3, stone: 5 }, coins: 20 },
    gold: { ing: { wood: 3, iron: 5 }, coins: 80 },
    crimstone: { ing: { wood: 3, gold: 3 }, coins: 100 }
};

export const PM = { wood: 'Wood', stone: 'Stone', iron: 'Iron', gold: 'Gold', crimstone: 'Crimstone' };

export const CORS_PROXIES = ['https://corsproxy.io/?url='];
