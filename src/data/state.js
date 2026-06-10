import { PM } from './constants.js';

export const D = { p2p: {}, ex: {}, bst: {}, fid: 1234 };

export function pp(r) { return D.p2p[PM[r]] || 0; }
export function bs(r) { return (D.bst.resources || {})[r] || { min: 1, max: 1, avg: 1 }; }

export function getComm() { return parseFloat(document.getElementById('comm').value) || 0; }
export function afterComm(val) { return val * (1 - getComm() / 100); }
