import { CORS_PROXIES } from './constants.js';
import { t } from '../i18n/i18n.js';

export async function gj(u) {
    try {
        const r = await fetch(u);
        if (!r.ok) throw r.status;
        return r.json();
    } catch (e) { console.warn('Direct fetch failed:', e); }
    for (const px of CORS_PROXIES) {
        try {
            const r = await fetch(px + encodeURIComponent(u));
            if (!r.ok) throw r.status;
            return r.json();
        } catch (e) { console.warn('Proxy failed:', px, e); continue; }
    }
    throw new Error(t('corsError'));
}
