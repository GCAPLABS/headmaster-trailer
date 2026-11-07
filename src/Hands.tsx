import React from 'react';
import {C} from './theme';
import {out, prog, inOut} from './theme';

// Natural two-hand grip, seen from the person's eyes. Flat fills only.
// Phone body x 1105..1535, y 64..944. Right hand holds the right edge; the left hand is its mirror.
const AXIS = 1320;
const SKIN = C.skin;
const SHADE = C.skinShade;
const NAIL = '#f4d9c6';

// Tapered, slightly curved digit from base to tip.
const digit = (b: [number, number], t: [number, number], bend: number, w0: number, w1: number) => {
  const mx = (b[0] + t[0]) / 2, my = (b[1] + t[1]) / 2;
  const dx = t[0] - b[0], dy = t[1] - b[1];
  const L = Math.hypot(dx, dy);
  const cx = mx + (-dy / L) * bend, cy = my + (dx / L) * bend;
  const pts: [number, number][] = [];
  const nrm: [number, number][] = [];
  const N = 16;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x = (1 - u) * (1 - u) * b[0] + 2 * (1 - u) * u * cx + u * u * t[0];
    const y = (1 - u) * (1 - u) * b[1] + 2 * (1 - u) * u * cy + u * u * t[1];
    const tx = 2 * (1 - u) * (cx - b[0]) + 2 * u * (t[0] - cx);
    const ty = 2 * (1 - u) * (cy - b[1]) + 2 * u * (t[1] - cy);
    const n = Math.hypot(tx, ty);
    pts.push([x, y]);
    nrm.push([-ty / n, tx / n]);
  }
  const w = (i: number) => (w0 + (w1 - w0) * (i / N)) / 2;
  const left = pts.map((p, i) => `${p[0] + nrm[i][0] * w(i)},${p[1] + nrm[i][1] * w(i)}`);
  const right = pts.map((p, i) => `${p[0] - nrm[i][0] * w(i)},${p[1] - nrm[i][1] * w(i)}`).reverse();
  const r = w1 / 2;
  return {d: `M ${left.join(' L ')} A ${r} ${r} 0 0 0 ${right[0]} L ${right.join(' L ')} Z`, tip: pts[N], dir: Math.atan2(t[1] - cy, t[0] - cx) * 180 / Math.PI};
};

const Thumb: React.FC<{tip: [number, number]; base?: [number, number]}> = ({tip, base = [1604, 902]}) => {
  const th = digit(base, tip, 18, 64, 50);
  const sh = digit([base[0] + 4, base[1] + 5], [tip[0] + 3, tip[1] + 5], 18, 64, 50);
  return (
    <g>
      <path d={sh.d} fill={SHADE} />
      <path d={th.d} fill={SKIN} />
      <g transform={`translate(${th.tip[0]} ${th.tip[1]}) rotate(${th.dir})`}>
        <rect x={-30} y={-15} width={30} height={30} rx={13} fill={NAIL} />
      </g>
    </g>
  );
};

const FINGERS = [
  {y: 648, w: 92}, {y: 694, w: 96}, {y: 740, w: 90}, {y: 786, w: 76},
];

const HandBody: React.FC<{thumbTip: [number, number]}> = ({thumbTip}) => (
  <g>
    {/* sleeve: a tube from the bottom corner, with a cuff band */}
    <polygon points="1569,1028 1671,952 1922,1226 1762,1346" fill={C.white} stroke={C.line} strokeWidth={3} strokeLinejoin="round" />
    <path d="M 1740 1120 L 1790 1070 M 1800 1210 L 1870 1160" stroke={C.line} strokeWidth={3} strokeLinecap="round" />
    <polygon points="1569,1028 1671,952 1690,974 1590,1052" fill={C.white} stroke={C.ground3} strokeWidth={3} strokeLinejoin="round" />
    {/* wrist and palm */}
    <polygon points="1553,960 1627,918 1676,962 1588,1034" fill={SKIN} />
    <path d="M 1526 648 L 1590 648 C 1634 648 1652 700 1648 770 C 1644 836 1640 892 1626 936 L 1574 962 L 1530 944 Z" fill={SKIN} />
    <path d="M 1606 800 C 1630 840 1626 886 1604 930" fill="none" stroke={SHADE} strokeWidth={4} strokeLinecap="round" />
    {/* four fingers wrapping the edge, tips resting on the bezel */}
    {FINGERS.map((fg, i) => (
      <g key={i}>
        <rect x={1519} y={fg.y + 4} width={fg.w} height={40} rx={20} fill={SHADE} />
        <rect x={1519} y={fg.y} width={fg.w} height={40} rx={20} fill={SKIN} />
      </g>
    ))}
    <Thumb tip={thumbTip} base={[1596, 912]} />
  </g>
);

export const Hands: React.FC<{f: number; tapX: number; tapY: number}> = ({f, tapX, tapY}) => {
  const t = prog(f, 60, 74, inOut) - prog(f, 80, 94, inOut);
  const rest: [number, number] = [1496, 818];
  const tip: [number, number] = [rest[0] + (tapX + 6 - rest[0]) * t, rest[1] + (tapY + 4 - rest[1]) * t];
  const ripple = prog(f, 75, 99);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${2 * AXIS} 0) scale(-1 1)`}><HandBody thumbTip={[1498, 790]} /></g>
      <HandBody thumbTip={tip} />
      {ripple > 0 && ripple < 1 && <circle cx={tapX} cy={tapY} r={26 + 62 * out(ripple)} fill="none" stroke={C.blue} strokeWidth={5} opacity={0.55 * (1 - ripple)} />}
    </svg>
  );
};
