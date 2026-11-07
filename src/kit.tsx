import React from 'react';
import {continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, prog} from './theme';
import subs from './subs.json';

export const useFonts = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const faces = [
      new FontFace('Archivo', `url(${staticFile('fonts/Archivo.ttf')})`, {weight: '100 900'}),
      new FontFace('Figtree', `url(${staticFile('fonts/Figtree.ttf')})`, {weight: '300 900'}),
    ];
    Promise.all(faces.map((f) => f.load())).then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    });
  }, [handle]);
};

// Words appear one at a time, each on its own frame. `at` holds the start frame of every word.
export const typedWords = (text: string, at: number[], f: number) =>
  text.split(' ').filter((_, i) => f >= at[i]).join(' ');

// Subtitles: chunks come from tools/subs.py, timed from the real voice duration.
export const Subs: React.FC<{id: keyof typeof subs; align?: 'center' | 'left'; left?: number; shiftX?: number; bottom?: number}> = ({id, align = 'center', left = 150, shiftX = 0, bottom = 46}) => {
  const f = useCurrentFrame();
  const rows = subs[id] as {text: string; a: number; b: number}[];
  const row = rows.find((r) => f >= r.a && f < r.b);
  if (!row) return null;
  const e = prog(f, row.a, row.a + 5) * (1 - prog(f, row.b - 5, row.b));
  const box: React.CSSProperties = align === 'center'
    ? {left: 0, right: 0, display: 'flex', justifyContent: 'center'}
    : {left: left + shiftX};
  return (
    <div style={{position: 'absolute', bottom, ...box, pointerEvents: 'none'}}>
      <div style={{background: C.white, border: `2px solid ${C.line}`, borderRadius: 18, padding: '10px 30px 12px', fontFamily: FONT.body, fontWeight: 600, fontSize: 42, lineHeight: '52px', color: C.ink, whiteSpace: 'nowrap', opacity: e, transform: `translateY(${(1 - e) * 10}px)`}}>{row.text}</div>
    </div>
  );
};

// Kinetic headline: rises out of a mask with a short blur, as in scene 1.
export const Rise: React.FC<{at: number; size: number; children: React.ReactNode; color?: string; weight?: number; font?: string; lh?: number; blur?: number; opacity?: number}> = ({at, size, children, color = C.ink, weight = 800, font = FONT.display, lh = 1, blur = 0, opacity = 1}) => {
  const f = useCurrentFrame();
  const e = prog(f, at, at + 20);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 16, marginBottom: -16, paddingTop: 6, marginTop: -6}}>
      <div style={{fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: font === FONT.display ? '-0.02em' : 0, whiteSpace: 'nowrap', transform: `translateY(${(1 - e) * size * 0.5}px)`, opacity: e * opacity, filter: `blur(${(1 - e) * 10 + blur}px)`}}>{children}</div>
    </div>
  );
};

// Small chapter label, same voice as the other small labels (blue, bold). Sits above the headline.
export const Eyebrow: React.FC<{children: React.ReactNode; at?: number; x?: number; y?: number}> = ({children, at = 0, x = 110, y = 16}) => {
  const f = useCurrentFrame();
  const e = prog(f, at, at + 14);
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: FONT.body, fontWeight: 700, fontSize: 30, lineHeight: '34px', color: C.blue, opacity: e, transform: `translateY(${(1 - e) * 8}px)`, whiteSpace: 'nowrap'}}>{children}</div>;
};

// Scene headline, top left. Two colours allowed: ink then blue. An eyebrow pushes it down a little.
export const Headline: React.FC<{at?: number; a: string; b?: string; x?: number; y?: number; size?: number; color?: string; eyebrow?: string}> = ({at = 4, a, b, x = 110, y = 40, size = 80, color = C.ink, eyebrow}) => (
  <>
    {eyebrow && <Eyebrow at={at - 2} x={x} y={y - 24}>{eyebrow}</Eyebrow>}
    <div style={{position: 'absolute', left: x, top: eyebrow ? y + 14 : y}}>
      <Rise at={at} size={size} color={color}>{a}{b && <span style={{color: C.blue}}> {b}</span>}</Rise>
    </div>
  </>
);

export const Check: React.FC<{size?: number; color?: string; bg?: string; pop?: number}> = ({size = 30, color = '#fff', bg = C.chatHead, pop = 1}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" style={{display: 'block', transform: `scale(${pop})`}}>
    <circle cx={15} cy={15} r={15} fill={bg} />
    <path d="M 8.5 15.5 L 13.2 20 L 21.8 10.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Spin: React.FC<{size?: number; f: number}> = ({size = 30, f}) => (
  <svg width={size} height={size} viewBox="0 0 26 26" style={{display: 'block'}}>
    <circle cx={13} cy={13} r={10} fill="none" stroke={C.line} strokeWidth={4} />
    <path d="M 13 3 A 10 10 0 0 1 23 13" fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" transform={`rotate(${(f * 14) % 360} 13 13)`} />
  </svg>
);

export const Cursor: React.FC<{x: number; y: number; press?: number; scale?: number; fill?: string}> = ({x, y, press = 0, scale = 1, fill = C.ink}) => (
  <svg width={44} height={52} viewBox="0 0 22 26" style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `scale(${scale * (1 - 0.1 * press)})`, transformOrigin: '2px 2px'}}>
    <path d="M 2 2 L 2 21 L 7 16.5 L 10.5 24 L 14 22.5 L 10.6 15.2 L 17.5 15 Z" fill={fill} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export const Star: React.FC<{size?: number}> = ({size = 22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}><path d="M 12 2.5 L 14.9 8.7 L 21.5 9.5 L 16.6 14 L 18 20.6 L 12 17.3 L 6 20.6 L 7.4 14 L 2.5 9.5 L 9.1 8.7 Z" fill={C.blue} /></svg>
);

export type NavName = 'chat' | 'files' | 'memory' | 'profiles' | 'skills';
export const NavIcon: React.FC<{name: NavName; color: string; size?: number}> = ({name, color, size = 32}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{display: 'block'}}>
      {name === 'chat' && <path {...p} d="M 5 7 H 27 V 22 H 15 L 9 27 V 22 H 5 Z" />}
      {name === 'files' && <path {...p} d="M 5 9 H 13 L 16 12 H 27 V 25 H 5 Z" />}
      {name === 'memory' && <g {...p}><rect x={7} y={5} width={18} height={22} rx={3} /><path d="M 12 11 H 20 M 12 16 H 20 M 12 21 H 17" /></g>}
      {name === 'profiles' && <g {...p}><circle cx={16} cy={11} r={5} /><path d="M 6 27 C 7 19 25 19 26 27" /></g>}
      {name === 'skills' && <path {...p} d="M 16 4 L 19 12 L 28 13 L 21 19 L 23 28 L 16 23.5 L 9 28 L 11 19 L 4 13 L 13 12 Z" />}
    </svg>
  );
};

export const sp = (f: number, at: number, fps: number, cfg = {damping: 15, stiffness: 180, mass: 0.7}) => spring({frame: f - at, fps, config: cfg});
export const useSp = (at: number, cfg?: {damping: number; stiffness: number; mass: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return sp(f, at, fps, cfg);
};
