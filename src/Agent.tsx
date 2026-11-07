// Agent state from 000h by Cojeev — MIT licence — docs, variants and the full library: https://cojeev.com/ui/docs/agent-state/
// Frame-driven port of the "Agent State" field: no motion/react and no rAF, every value comes from useCurrentFrame().
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'needs-input' | 'complete';

const silhouettes: Record<AgentStatus, string> = {
  idle: 'M90 24C116 17 151 32 153 60C157 84 139 96 124 116C111 135 81 141 59 126C34 113 22 85 32 61C43 36 65 31 90 24Z',
  thinking: 'M90 18C120 27 132 19 148 51C163 78 141 92 135 116C127 146 94 137 68 129C40 123 18 98 30 70C40 48 66 7 90 18Z',
  working: 'M90 17C114 11 156 41 151 65C146 85 165 110 134 123C106 140 85 121 61 131C34 140 17 94 30 71C44 47 68 25 90 17Z',
  'needs-input': 'M90 27C121 20 147 29 145 61C143 82 162 111 134 125C108 138 91 114 65 127C35 140 28 101 31 76C34 48 62 33 90 27Z',
  complete: 'M90 24C118 24 145 36 150 63C155 91 134 116 112 125C87 137 63 128 47 113C29 95 25 69 40 47C53 28 66 24 90 24Z',
};

// All contours share one topology: split each into a template and its numbers, then lerp number by number.
const NUM = /-?\d+(?:\.\d+)?/g;
const nums = (d: string) => (d.match(NUM) ?? []).map(Number);
const lerpPath = (from: string, to: string, t: number) => {
  const b = nums(to);
  let i = 0;
  return from.replace(NUM, (m) => String(+(Number(m) + (b[i++] - Number(m)) * t).toFixed(3)));
};

const PINK = '#F0A4CC', PINK_DEEP = '#d693b7', YELLOW = '#F1D369', YELLOW_DEEP = '#d6bc60';
const BLUE = '#95BAE8', BLUE_DEEP = '#86a6cf', OLIVE = '#A8BC75', OLIVE_DEEP = '#96a86a';
const CREAM = '#F6EFE2', INK = '#111111';
const TONE: Record<AgentStatus, [string, string, string]> = {
  idle: [PINK, YELLOW, PINK_DEEP],
  working: [PINK, YELLOW, PINK_DEEP],
  thinking: [BLUE, PINK, BLUE_DEEP],
  'needs-input': [YELLOW, CREAM, YELLOW_DEEP],
  complete: [OLIVE, YELLOW, OLIVE_DEEP],
};

const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t); // easeInOut for one keyframe segment
// Multi-keyframe track over `period` seconds, equal segments, each eased, like the component's [a, b, c, a] arrays.
const track = (keys: number[], u: number) => {
  const n = keys.length - 1;
  const p = (((u % 1) + 1) % 1) * n;
  const i = Math.min(n - 1, Math.floor(p));
  return keys[i] + (keys[i + 1] - keys[i]) * ease(p - i);
};

export const AgentAvatar = ({size, bg = '#ffffff', id, status = 'idle'}: {size: number; bg?: string; id: string; status?: AgentStatus}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const active = status === 'thinking' || status === 'working';
  const contour = silhouettes[status];
  let d = contour;
  let rot = 0;
  let dx = 0;
  let breathe = 1;
  if (active) {
    const alt = silhouettes[status === 'thinking' ? 'working' : 'thinking'];
    d = lerpPath(contour, alt, track([0, 1, 0], t / (status === 'working' ? 5 : 7)));
    rot = track([0, 12, -6, 0], t / 10);
    dx = track([0, 5, -3, 0], t / 10);
  } else if (status === 'idle') {
    breathe = 1 + 0.006 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 4));
  }
  const [base, light, deep] = TONE[status];
  const k = `${id}-${status}`;
  const mark = status === 'complete' ? (
    <path d="m77 79 9 9 19-21" />
  ) : status === 'needs-input' ? (
    <><path d="M84 72a7 7 0 0 1 14 0c0 5-8 6-8 11" /><path d="M90 92h.01" /></>
  ) : (
    <><path d="M77 77v5M101 77v5" /><path d={status === 'idle' ? 'M84 91q6 4 12 0' : 'M85 91h10'} /></>
  );
  return (
    <div style={{width: size, height: size, borderRadius: size / 2, background: bg, display: 'grid', placeItems: 'center', overflow: 'hidden'}}>
      <svg width={size * 0.88} height={(size * 0.88 * 160) / 180} viewBox="0 0 180 160" fill="none" style={{display: 'block', overflow: 'visible'}}>
        <defs>
          <radialGradient id={`${k}-body`} cx=".3" cy=".2" r=".85">
            <stop stopColor={light} />
            <stop offset=".5" stopColor={base} />
            <stop offset="1" stopColor={deep} />
          </radialGradient>
          <radialGradient id={`${k}-fold`} cx=".65" cy=".22" r=".8">
            <stop stopColor={CREAM} stopOpacity=".84" />
            <stop offset=".4" stopColor={light} stopOpacity=".7" />
            <stop offset="1" stopColor={deep} stopOpacity=".2" />
          </radialGradient>
          <linearGradient id={`${k}-rim`} x1="30" y1="30" x2="138" y2="134" gradientUnits="userSpaceOnUse">
            <stop stopColor={CREAM} stopOpacity=".92" />
            <stop offset=".48" stopColor={light} stopOpacity=".2" />
            <stop offset="1" stopColor={deep} stopOpacity=".8" />
          </linearGradient>
          <clipPath id={`${k}-clip`}><path d={d} /></clipPath>
        </defs>
        <g transform={`translate(90 80) scale(${breathe}) translate(-90 -80)`}>
          <ellipse cx="92" cy="139" rx="43" ry="5" fill={deep} opacity=".12" />
          <path d={d} fill={`url(#${k}-body)`} />
          <g clipPath={`url(#${k}-clip)`}>
            <g transform={`translate(${dx} 0) rotate(${rot} 90 80)`}>
              <path d="M15 61C51 32 81 110 128 89C165 72 142 24 105 14C163 7 181 113 125 142C74 168 20 125 15 61Z" fill={`url(#${k}-fold)`} />
              <path d="M26 48C64 18 59 134 119 110C147 99 132 71 155 47" stroke={`url(#${k}-rim)`} strokeWidth="1.2" />
              <path d="M30 44C69 19 58 139 125 111C151 99 136 69 159 43" stroke={`url(#${k}-rim)`} strokeWidth=".65" opacity=".75" />
              <path d="M35 42C74 26 64 143 131 109C154 97 141 65 162 40" stroke={`url(#${k}-rim)`} strokeWidth=".5" opacity=".5" />
              <path d="M24 92C47 78 93 148 139 118" stroke={deep} strokeOpacity=".25" strokeWidth="14" />
            </g>
          </g>
          <path d={d} stroke={`url(#${k}-rim)`} strokeWidth="1.2" />
          <g stroke={INK} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">{mark}</g>
        </g>
      </svg>
    </div>
  );
};
