import { I18N } from './translations.js';

let LANG = localStorage.getItem('sfl-lang') || 'es';

let _onLangChange = null;

export function onLangChange(cb) { _onLangChange = cb; }

export function t(key, vars) {
    let s = (I18N[key] && I18N[key][LANG]) || (I18N[key] && I18N[key].es) || key;
    if (vars) { for (const [k, v] of Object.entries(vars)) s = s.replaceAll('{' + k + '}', v); }
    return s;
}

export function resName(key) { return t('res_' + key); }
export function pickName(key) { return t('pick_' + key); }

export function getLang() { return LANG; }

export function updateStaticText() {
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        const text = t(key);
        if (text !== key) el.textContent = text;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === LANG);
    });
}

export function setLang(lang) {
    LANG = lang;
    localStorage.setItem('sfl-lang', lang);
    updateStaticText();
    if (_onLangChange) _onLangChange();
}
