import { D } from '../data/state.js';
import { renderVerdict, renderResources } from './render.js';

export function updateH() {
    const u = D.ex?.sfl?.usd;
    if (u) document.getElementById('susd').textContent = '$' + u.toFixed(5);
}

export function renderAll() {
    renderVerdict();
    renderResources();
    updateH();
}
