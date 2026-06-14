import { onLangChange, setLang, updateStaticText, t } from './i18n/i18n.js';
import { D } from './data/state.js';
import { gj } from './data/api.js';
import { renderAll } from './ui/dom.js';

onLangChange(renderAll);

function showLoad() {
    const ld = document.getElementById('ld');
    const spinner = document.getElementById('ld-spinner');
    if (spinner) spinner.style.display = '';
    ld.classList.remove('fade');
    ld.style.display = '';
}

function hideLoad() {
    const ld = document.getElementById('ld');
    ld.classList.add('fade');
    setTimeout(() => ld.style.display = 'none', 400);
}

function setLoadText(text, cls) {
    const el = document.getElementById('ld-text');
    if (el) { el.textContent = text; el.className = cls || 'text-yellow-500 text-sm mb-4'; }
}

function hideSpinner() {
    const el = document.getElementById('ld-spinner');
    if (el) el.style.display = 'none';
}

function buildSteps() {
    const steps = ['loadPrices', 'loadExchange', 'loadFarm'];
    document.getElementById('ld-steps').innerHTML = steps.map((key, i) =>
        `<div class="ld-step" data-step="${i}"><span class="ld-ic">○</span><span>${t(key)}</span></div>`
    ).join('');
}

function setStep(step, status) {
    const el = document.querySelector(`.ld-step[data-step="${step}"]`);
    if (!el) return;
    el.className = 'ld-step ld-' + status;
    const ic = el.querySelector('.ld-ic');
    if (status === 'active') ic.textContent = '◐';
    else if (status === 'done') ic.textContent = '✓';
    else if (status === 'error') ic.textContent = '✗';
    else ic.textContent = '○';
}

function showError(e, retryFn) {
    const active = document.querySelector('.ld-step.ld-active');
    if (active) setStep(parseInt(active.dataset.step), 'error');
    hideSpinner();
    setLoadText('Error: ' + e, 'text-red-400 text-sm mb-4');
    document.getElementById('ld-steps').innerHTML +=
        `<div class="mt-3"><button id="retryBtn" class="bg-yellow-600 hover:bg-yellow-500 text-black rounded px-3 py-1 text-xs font-bold">${t('errorRetry')}</button></div>`;
    document.getElementById('retryBtn').addEventListener('click', retryFn);
}

async function loadData() {
    buildSteps();

    setStep(0, 'active');
    setLoadText(t('loadPrices') + '...');
    D.p2p = (await gj('https://sfl.world/api/v1/prices')).data?.p2p || {};
    setStep(0, 'done');

    setStep(1, 'active');
    setLoadText(t('loadExchange') + '...');
    D.ex = await gj('https://sfl.world/api/v1.1/exchange');
    setStep(1, 'done');

    setStep(2, 'active');
    setLoadText(t('loadFarm') + '...');
    D.bst = await gj('https://sfl.world/api/v1/land/' + D.fid);
    setStep(2, 'done');

    updateStaticText();
    renderAll();
}

async function goFarm() {
    const v = document.getElementById('fi').value.trim();
    if (!v) return;
    D.fid = v;
    showLoad();
    try {
        await loadData();
        hideSpinner();
        setLoadText('✓');
        hideLoad();
    } catch (e) {
        showError(e, goFarm);
    }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

document.getElementById('farmBtn').addEventListener('click', goFarm);
document.getElementById('comm').addEventListener('input', renderAll);

async function init() {
    showLoad();
    try {
        await loadData();
        hideSpinner();
        setLoadText('✓');
        hideLoad();
    } catch (e) {
        showError(e, () => location.reload());
    }
}

init();
