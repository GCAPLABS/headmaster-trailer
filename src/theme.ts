import {Easing, interpolate} from 'remotion';
export const C = {
  ground: '#e0e0fb', ground2: '#c9c9f5', ground3: '#b3b3ee', white: '#ffffff', field: '#f7f8fb',
  ink: '#0c0e1a', muted: '#6a7086', ink2: '#4f566e', blue: '#0000da', line: '#e3e5ec', dark: '#16181f',
  chatPaper: '#efe9df', chatOut: '#dcf8c6', chatHead: '#1f6f4a', skin: '#e9b997', skinShade: '#d29a76',
};
export const FONT = {display: 'Archivo, sans-serif', body: 'Figtree, sans-serif'};
export const out = Easing.bezier(0.22, 1, 0.36, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const prog = (f: number, a: number, b: number, e: (t: number) => number = out) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
