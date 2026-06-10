import { onLangChange, setLang, updateStaticText, t } from './i18n/i18n.js';
import { D } from './data/state.js';
import { gj } from './data/api.js';
import { renderAll } from './ui/dom.js';

onLangChange(renderAll);

async function goFarm() {
    const v = document.getElementById('fi').value.trim();
    if (v) { D.fid = v; D.bst = await gj('https://sfl.world/api/v1/land/' + v); renderAll(); }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

document.getElementById('farmBtn').addEventListener('click', goFarm);

document.getElementById('comm').addEventListener('input', renderAll);

async function init() {
    try {
        D.p2p = (await gj('https://sfl.world/api/v1/prices')).data?.p2p || {};
        D.ex = await gj('https://sfl.world/api/v1.1/exchange');
        D.bst = await gj('https://sfl.world/api/v1/land/' + D.fid);
        updateStaticText();
        renderAll();
        const o = document.getElementById('ld');
        o.classList.add('fade');
        setTimeout(() => o.style.display = 'none', 500);
    } catch (e) {
        document.getElementById('ld').innerHTML = `<div class="text-center"><p class="text-red-400 text-sm">Error: ${e}</p><button id="retryBtn" class="mt-3 px-3 py-1 bg-yellow-600 text-black rounded text-xs font-bold">${t('errorRetry')}</button></div>`;
        document.getElementById('retryBtn').addEventListener('click', init);
    }
}

setInterval(async () => {
    try {
        D.p2p = (await gj('https://sfl.world/api/v1/prices')).data?.p2p || {};
        D.bst = await gj('https://sfl.world/api/v1/land/' + D.fid);
        D.ex = await gj('https://sfl.world/api/v1.1/exchange');
        renderAll();
    } catch (e) { }
}, 300000);

init();
