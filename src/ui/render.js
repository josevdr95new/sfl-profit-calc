import { R_KEYS, R_DATA } from '../data/constants.js';
import { t, resName, pickName } from '../i18n/i18n.js';
import { calcResource } from '../calc/profit.js';
import { getComm } from '../data/state.js';

export function renderVerdict() {
    const el = document.getElementById('verdict');
    const results = R_KEYS.map(calcResource);

    const withPick = results.filter(r => r.pick);
    withPick.sort((a, b) => {
        const roiA = a.pickCost > 0 ? (a.profit / a.pickCost * 100) : 0;
        const roiB = b.pickCost > 0 ? (b.profit / b.pickCost * 100) : 0;
        return roiB - roiA;
    });
    const best = withPick[0];
    const bestRdata = R_DATA[best.key];
    const bestRoi = best.pickCost > 0 ? (best.profit / best.pickCost * 100) : 0;

    const mineCount = results.filter(r => r.cheaper).length;
    const buyCount = results.filter(r => !r.cheaper).length;

    el.innerHTML = `<div class="card glow-gold text-center py-4">
        <div class="text-2xl mb-1">🏆</div>
        <p class="text-[11px] text-zinc-400">${t('bestToMine')}</p>
        <p class="text-xl font-extrabold mt-1" style="color:${bestRdata.c}">${bestRdata.e} ${resName(best.key)}</p>
        <p class="text-xs text-zinc-500 mt-0.5">${t('withPick')} ${pickName(best.key)}</p>
        <div class="flex justify-center gap-5 mt-3">
            <div class="text-center">
                <div class="text-[10px] text-zinc-500">${t('netProfitPerPick')}</div>
                <div class="mono text-lg font-extrabold ${best.profit > 0 ? 'good' : 'bad'}">${best.profit > 0 ? '+' : ''}${best.profit.toFixed(4)} SFL</div>
            </div>
            <div class="text-center">
                <div class="text-[10px] text-zinc-500">ROI</div>
                <div class="mono text-lg font-extrabold ${bestRoi > 0 ? 'good' : 'bad'}">${bestRoi > 0 ? '+' : ''}${bestRoi.toFixed(1)}%</div>
            </div>
        </div>
        <div class="flex justify-center gap-2 mt-3">
            <span class="tag-mine">${mineCount} ${t('convMine')}</span>
            <span class="tag-buy">${buyCount} ${t('convBuy')}</span>
        </div>
    </div>`;
}

export function renderResources() {
    const el = document.getElementById('resources');
    const results = R_KEYS.map(calcResource);
    const comm = getComm();

    el.innerHTML = results.map(r => {
        const rdata = R_DATA[r.key];
        const isBase = rdata.base;
        const rname = resName(r.key);
        const roi = r.pickCost > 0 ? (r.profit / r.pickCost * 100) : (r.profit > 0 ? Infinity : 0);

        const mainTag = r.cheaper
            ? `<span class="tag-mine">${t('tagMine')}</span>`
            : `<span class="tag-buy">${t('tagBuy')}</span>`;

        let ingHtml = '';
        if (r.ingDetails && r.ingDetails.length) {
            ingHtml = r.ingDetails.map(d => {
                const srcRdata = R_DATA[d.ing];
                return `<div class="flex items-center gap-2 py-1.5 ${d !== r.ingDetails[0] ? 'border-t border-zinc-800/40' : ''}">
                    <span class="text-sm">${srcRdata.e}</span>
                    <span style="color:${srcRdata.c}" class="font-semibold text-[12px]">${d.amt} ${resName(d.ing)}</span>
                    <span class="mono text-[10px] text-zinc-500 ml-auto">${d.val.toFixed(4)} SFL</span>
                </div>`;
            }).join('');
        }

        let mainBlock = '';
        if (isBase) {
            mainBlock = `
            <div class="bg-zinc-900/30 rounded-lg px-3 py-3">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] text-zinc-400">${t('miningCosts')}</span>
                    <span class="mono text-[14px] font-extrabold good">0 SFL</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-[11px] text-zinc-400">${t('eachUnitP2P')}</span>
                    <span class="mono text-[14px] font-extrabold warn">${r.price.toFixed(4)} SFL</span>
                </div>
                <div class="mt-2 pt-2 border-t border-zinc-800/30">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] text-zinc-400">${t('mineAndSell', { amt: r.mineOutput.toFixed(2) })}</span>
                        <span class="mono text-[12px] text-zinc-400">${r.mineRevenueGross.toFixed(4)} SFL</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] text-zinc-500">− ${t('commission')} ${comm}%</span>
                        <span class="mono text-[12px] text-zinc-500">−${r.commission.toFixed(4)} SFL</span>
                    </div>
                    <div class="flex items-center justify-between pt-1 border-t border-zinc-800/30">
                        <span class="text-[12px] text-zinc-300 font-semibold">${t('youReceive')}</span>
                        <span class="mono text-[14px] font-extrabold good">${r.mineRevenueNet.toFixed(4)} SFL</span>
                    </div>
                </div>
            </div>`;
        } else {
            mainBlock = `
            <div class="bg-zinc-900/30 rounded-lg px-3 py-3">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-zinc-300 font-semibold">${t('pickCosts', { pick: pickName(r.key) })}</span>
                    <span class="mono text-[14px] font-extrabold warn">${r.pickCost.toFixed(4)} SFL</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-[11px] text-zinc-400">${t('mineAndSellRes', { amt: r.mineOutput.toFixed(2), res: rname })}</span>
                    <span class="mono text-[12px] text-zinc-400">${r.mineRevenueGross.toFixed(4)} SFL</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-[11px] text-zinc-500">− ${t('commission')} ${comm}%</span>
                    <span class="mono text-[12px] text-zinc-500">−${r.commission.toFixed(4)} SFL</span>
                </div>
                <div class="flex items-center justify-between pt-2 mt-1 border-t border-zinc-800/30">
                    <span class="text-[12px] text-zinc-300 font-semibold">${t('netProfit')}</span>
                    <span class="mono text-[16px] font-extrabold ${r.profit > 0 ? 'good' : 'bad'}">${r.profit > 0 ? '+' : ''}${r.profit.toFixed(4)} SFL</span>
                </div>
                <div class="flex items-center justify-between mt-0.5">
                    <span class="text-[10px] text-zinc-500">ROI</span>
                    <span class="mono text-[11px] font-bold ${roi > 0 ? 'good' : 'bad'}">${roi === Infinity ? '∞' : (roi > 0 ? '+' : '') + roi.toFixed(0) + '%'}</span>
                </div>
                <div class="mt-2 pt-2 border-t border-zinc-800/30">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] text-zinc-400">${t('mine1Costs', { res: rname })}</span>
                        <span class="mono text-[12px] font-bold ${r.cheaper ? 'good' : 'bad'}">${r.costMine1u.toFixed(4)} SFL</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] text-zinc-400">${t('buy1P2P', { res: rname })}</span>
                        <span class="mono text-[12px] font-bold ${!r.cheaper ? 'good' : 'bad'}">${r.costBuy1u.toFixed(4)} SFL</span>
                    </div>
                    <div class="flex items-center justify-between pt-1 border-t border-zinc-800/30">
                        <span class="text-[10px] text-zinc-500">${r.cheaper ? t('mineCheaper') : t('buyCheaper')}</span>
                        <span class="mono text-[11px] font-extrabold ${r.cheaper ? 'good' : 'warn'}">${r.savingsPct.toFixed(1)}%</span>
                    </div>
                </div>
            </div>`;
        }

        let chainBlock = '';
        if (!isBase && r.chainItems.length > 0) {
            const byPick = {};
            r.chainItems.forEach(item => {
                const pk = pickName(item.pickKey);
                if (!byPick[pk]) byPick[pk] = [];
                byPick[pk].push(item);
            });

            let chainHtml = '';
            for (const [pName, items] of Object.entries(byPick)) {
                const itemsStr = items.map(i => {
                    const srcRdata = R_DATA[i.ing];
                    return `<span class="text-[10px]">${srcRdata.e}<span style="color:${srcRdata.c}">${i.amt} ${resName(i.ing)}</span></span>`;
                }).join(' + ');
                const pickTotal = items.reduce((a, i) => a + i.val, 0);
                chainHtml += `<div class="flex items-center justify-between py-1 ${chainHtml ? 'border-t border-zinc-800/30' : ''}">
                    <span class="text-[10px] text-zinc-500">${pName}: ${itemsStr}</span>
                    <span class="mono text-[10px] text-zinc-400">${pickTotal.toFixed(4)}</span>
                </div>`;
            }

            chainBlock = `<div class="mt-2 bg-zinc-800/30 rounded px-3 py-2">
                <div class="text-[10px] text-zinc-400 font-semibold mb-1">${t('chainTitle')}</div>
                ${chainHtml}
                <div class="flex items-center justify-between pt-1.5 border-t border-zinc-800/30">
                    <span class="text-[10px] text-zinc-400">${t('totalChainIng')}</span>
                    <span class="mono text-[11px] warn font-bold">${r.chainCost.toFixed(4)} SFL</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-[10px] text-zinc-400">${t('totalChainComm')}</span>
                    <span class="mono text-[11px] text-zinc-500">−${r.chainCommTotal.toFixed(4)} SFL</span>
                </div>
            </div>`;
        }

        return `<div class="card ${r.cheaper ? 'glow-g' : 'glow-r'}">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">${rdata.e}</span>
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-base" style="color:${rdata.c}">${rname}</span>
                        ${mainTag}
                    </div>
                    <div class="flex items-center gap-3 mt-0.5 text-[10px] text-zinc-500">
                        <span>${t('p2pPrice')}: <span class="mono good font-semibold">${r.price.toFixed(4)}</span> SFL/u</span>
                        <span>${t('boost')}: <span class="mono font-semibold text-zinc-300">×${r.boost.avg.toFixed(2)}</span></span>
                    </div>
                </div>
            </div>

            ${r.pick ? `<div class="mb-3">
                <div class="text-[10px] text-zinc-500 font-medium mb-1">${t('pickIngredients')}</div>
                <div class="bg-zinc-900/40 rounded-lg px-3 py-1">
                    ${ingHtml}
                </div>
            </div>` : ''}

            ${mainBlock}
            ${chainBlock}
        </div>`;
    }).join('');
}
