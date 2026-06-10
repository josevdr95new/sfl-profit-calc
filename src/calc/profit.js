import { R_KEYS, R_DATA, PICKS } from '../data/constants.js';
import { pp, bs, afterComm } from '../data/state.js';

export function calcResource(key) {
    const rdata = R_DATA[key];
    const price = pp(key);
    const boost = bs(key);
    const pick = PICKS[key];

    if (rdata.base) {
        const mineOutput = boost.avg;
        const mineRevenueGross = mineOutput * price;
        const mineRevenueNet = afterComm(mineRevenueGross);
        const commission = mineRevenueGross - mineRevenueNet;
        return {
            key, price, boost, pick: null,
            pickCost: 0, ingDetails: [],
            mineOutput, mineRevenueGross, mineRevenueNet, commission,
            profit: mineRevenueNet,
            costMine1u: 0, costBuy1u: price,
            cheaper: true, savingsPct: 100,
            chainItems: [], chainCost: 0, chainCommTotal: 0
        };
    }

    let pickCost = 0;
    const ingDetails = [];
    for (const [ing, amt] of Object.entries(pick.ing)) {
        const val = pp(ing) * amt;
        pickCost += val;
        ingDetails.push({ ing, amt, val, price: pp(ing) });
    }

    const mineOutput = boost.avg;
    const mineRevenueGross = mineOutput * price;
    const mineRevenueNet = afterComm(mineRevenueGross);
    const commission = mineRevenueGross - mineRevenueNet;
    const profit = mineRevenueNet - pickCost;

    const costMine1u = pickCost / mineOutput;
    const costBuy1u = price;
    const cheaper = costMine1u < costBuy1u;
    const savingsPct = cheaper
        ? ((costBuy1u - costMine1u) / costBuy1u * 100)
        : ((costMine1u - costBuy1u) / costMine1u * 100);

    const chainItems = [];
    let chainCost = 0;
    let chainCommTotal = 0;
    for (const r of R_KEYS) {
        const p = PICKS[r];
        if (!p) continue;
        for (const [ing, amt] of Object.entries(p.ing)) {
            const val = pp(ing) * amt;
            chainCost += val;
            chainItems.push({ pickKey: r, ing, amt, val });
        }
        const b = bs(r);
        const pr = pp(r);
        const revGross = b.avg * pr;
        chainCommTotal += revGross - afterComm(revGross);
        if (r === key) break;
    }

    return {
        key, price, boost, pick,
        pickCost, ingDetails,
        mineOutput, mineRevenueGross, mineRevenueNet, commission, profit,
        costMine1u, costBuy1u, cheaper, savingsPct,
        chainItems, chainCost, chainCommTotal
    };
}
