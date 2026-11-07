import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AgentAvatar} from './Agent';
import {C, FONT, inOut, prog} from './theme';
import {Eyebrow, Subs, typedWords, useFonts} from './kit';
import {Bubble, HeaderGreen, REQUEST} from './ThreadUI';
import {Hands} from './Hands';

// Scene 1 "ask": 7.5 s at 30 fps. A person on a sofa asks Headmaster in the chat app on a phone.
// Timeline (frames): title 0-30, typing 30-76, send 76, dots 96-112, reply 112, status 150, push-in 129-210.

const W = 1920;
const H = 1080;
const PH = {x: 1105, y: 64, w: 430, h: 880}; // phone body in world space
const SC = {x: PH.x + 16, y: PH.y + 16, w: PH.w - 32, h: PH.h - 32}; // screen
const FOCUS = {x: 1320, y: 450};
// One word every 6 frames, frame-aligned, finishing just before the send tap at frame 76.
const WORD_AT = [32, 37, 42, 47, 52, 57, 62, 67, 72];

const cam = (f: number) => {
  const p = prog(f, 129, 210, inOut);
  return p;
};
// One transform per depth layer: each layer zooms toward the same focus point at its own rate.
const layerStyle = (p: number, gain: number, drift = 0): React.CSSProperties => {
  const s = 1 + gain * p;
  const sx = FOCUS.x + (960 - FOCUS.x) * p;
  const sy = FOCUS.y + (540 - FOCUS.y) * p;
  return {position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${sx - FOCUS.x * s + drift}px, ${sy - FOCUS.y * s}px) scale(${s})`};
};

const Sofa: React.FC = () => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
    {/* sofa back and seat, two flat tones */}
    <rect x={560} y={760} width={1500} height={500} rx={120} fill={C.ground2} />
    <rect x={560} y={760} width={1500} height={14} rx={7} fill={C.ground3} opacity={0.0} />
    <rect x={1700} y={720} width={300} height={560} rx={110} fill={C.ground3} />
    {/* throw pillow */}
    <g transform="rotate(-8 860 900)"><rect x={740} y={810} width={240} height={220} rx={50} fill={C.ground3} /><path d="M 780 850 H 940 M 776 890 H 944" stroke={C.ground2} strokeWidth={6} strokeLinecap="round" /></g>
    {/* side table with a mug */}
    <ellipse cx={1790} cy={652} rx={104} ry={13} fill={C.white} />
    <rect x={1784} y={660} width={12} height={110} fill={C.white} />
    <rect x={1748} y={586} width={66} height={62} rx={12} fill={C.white} stroke={C.line} strokeWidth={2} />
    <path d="M 1814 600 q 26 4 22 24 q -4 16 -22 14" fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" />
    <rect x={1756} y={594} width={50} height={14} rx={7} fill="#7a4a2b" />
  </svg>
);

const Screen: React.FC<{f: number}> = ({f}) => {
  const sent = f >= 76;
  const text = sent ? '' : typedWords(REQUEST, WORD_AT, f);
  const shift = Math.max(0, text.length * 13.2 - 236);
  const caret = Math.floor(f / 15) % 2 === 0 || (f > 32 && f < 76);
  const dots = f >= 96 && f < 112;
  const spinA = ((f - 150) * 14) % 360;
  const dotY = (i: number) => -6 * Math.max(0, Math.sin(((f - i * 3) / 9) * Math.PI));
  return (
    <div style={{position: 'absolute', left: SC.x, top: SC.y, width: SC.w, height: SC.h, borderRadius: 50, overflow: 'hidden', background: C.chatPaper}}>
      <HeaderGreen avatar={<AgentAvatar size={64} id="hd" status={f >= 150 ? 'working' : f >= 96 ? 'thinking' : 'idle'} />} />
      <div style={{position: 'absolute', left: 0, top: 112, right: 0, bottom: 108}}>
        <Bubble f={f} at={-100} top={22} time="09:40">Hi. How can I help?</Bubble>
        <Bubble f={f} at={80} top={116} out>{REQUEST}</Bubble>
        {dots && (
          <div style={{position: 'absolute', left: 18, top: 262, background: C.white, borderRadius: '22px 22px 22px 6px', padding: '21px 22px', display: 'flex', gap: 9}}>
            {[0, 1, 2].map((i) => <i key={i} style={{width: 11, height: 11, borderRadius: 6, background: C.muted, transform: `translateY(${dotY(i)}px)`}} />)}
          </div>
        )}
        <Bubble f={f} at={112} top={262}>On it. I will ask before I book.</Bubble>
        <Bubble f={f} at={150} top={364} time="">
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}>
            <svg width={26} height={26} viewBox="0 0 26 26"><circle cx={13} cy={13} r={10} fill="none" stroke={C.line} strokeWidth={4} /><path d="M 13 3 A 10 10 0 0 1 23 13" fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" transform={`rotate(${spinA} 13 13)`} /></svg>
            Searching beach stays
          </span>
        </Bubble>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.field, borderTop: `2px solid ${C.line}`}}>
        <div style={{position: 'absolute', left: 16, top: 20, width: 272, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
          {text.length === 0 && !sent && <span style={{position: 'absolute', left: 22, top: 17, fontFamily: FONT.body, fontSize: 27, color: C.muted}}>Message</span>}
          {sent && <span style={{position: 'absolute', left: 22, top: 17, fontFamily: FONT.body, fontSize: 27, color: C.muted}}>Message</span>}
          <span style={{position: 'absolute', left: 22 - shift, top: 17, fontFamily: FONT.body, fontWeight: 500, fontSize: 27, lineHeight: '34px', color: C.ink, whiteSpace: 'nowrap'}}>{text}{caret && !sent && f > 28 && <i style={{display: 'inline-block', width: 3, height: 30, background: C.blue, marginLeft: 2, verticalAlign: -6}} />}</span>
        </div>
        <div style={{position: 'absolute', right: 16, top: 20, width: 68, height: 68, borderRadius: 34, background: C.chatHead, display: 'grid', placeItems: 'center', transform: `scale(${1 - 0.1 * (f >= 74 && f < 80 ? 1 : 0)})`}}>
          <svg width={30} height={30} viewBox="0 0 30 30"><path d="M 4 15 L 26 15 M 17 6 L 26 15 L 17 24" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
};

const Phone: React.FC<{f: number}> = ({f}) => {
  const bob = 5 * Math.sin((f / 30) * ((2 * Math.PI) / 3.2)) * (1 - prog(f, 170, 224));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translateY(${bob}px)`}}>
      {/* flat offset shadow */}
      <div style={{position: 'absolute', left: PH.x + 16, top: PH.y + 22, width: PH.w, height: PH.h, borderRadius: 66, background: C.ground3}} />
      <div style={{position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: 66, background: C.dark}} />
      <Screen f={f} />
      <div style={{position: 'absolute', left: PH.x + PH.w / 2 - 46, top: PH.y + 26, width: 92, height: 26, borderRadius: 13, background: C.dark}} />
      <Hands f={f} tapX={SC.x + SC.w - 50} tapY={SC.y + SC.h - 54} />
    </div>
  );
};

const Line: React.FC<{f: number; at: number; children: React.ReactNode; size: number; color?: string; weight?: number; font?: string; lh?: number; p: number}> = ({f, at, children, size, color = C.ink, weight = 800, font = FONT.display, lh = 0.98, p}) => {
  const e = prog(f, at, at + 20);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 14, marginBottom: -14}}>
      <div style={{fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: font === FONT.display ? '-0.02em' : 0, transform: `translateY(${(1 - e) * 44}px)`, opacity: e, filter: `blur(${(1 - e) * 10 + p * 8}px)`}}>{children}</div>
    </div>
  );
};

export const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const p = cam(f);
  const titleX = -1100 * Math.pow(p, 1.4);
  const titleO = 1 - prog(f, 134, 168);
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={layerStyle(p, 0.35, -f * 0.12)}><Sofa /></div>
      <div style={layerStyle(p, 1.15)}><Phone f={f} /></div>
      <div style={{position: 'absolute', left: 150, top: 232, width: 860, transform: `translateX(${titleX}px)`, opacity: titleO}}>
        <div style={{height: 14}}><Eyebrow at={-8} x={0} y={-52}>For you</Eyebrow></div>
        <Line f={f} at={-14} size={226} p={p}>Just</Line>
        <Line f={f} at={-9} size={226} color={C.blue} p={p}>ask.</Line>
        <div style={{height: 34}} />
        <Line f={f} at={-2} size={46} font={FONT.body} weight={500} color={C.ink2} lh={1.25} p={p}>Say it in plain words, like a<br />message to a friend.</Line>
      </div>
      <Subs id="ask" align="left" left={150} shiftX={titleX * 0.6} bottom={66} />
    </AbsoluteFill>
  );
};

export const Opening: React.FC = () => {
  useFonts();
  return <Ask />;
};
