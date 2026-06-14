import { CORS_PROXIES } from './constants.js';
import { t } from '../i18n/i18n.js';

export async function gj(u) {
    const url = u + (u.includes('?') ? '&' : '?') + '_t=' + Date.now();
    for (const px of CORS_PROXIES) {
        try {
            const r = await fetch(px + encodeURIComponent(url));
            if (!r.ok) throw r.status;
            return r.json();
        } catch (e) { console.warn('Proxy failed:', px, e); continue; }
    }
    throw new Error(t('corsError'));
}
