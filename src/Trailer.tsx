import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, staticFile, useCurrentFrame} from 'remotion';
import {AgentAvatar} from './Agent';
import {Check, useFonts} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, HeaderGreen, GREEN} from './ThreadUI';

// Launch trailer, "Everything finds its next form". 30 fps, beat = 15 frames (120 bpm).
// Archival photos: The Met Open Access (CC0) and NASA (public domain). Credits in README.

export const BLACK = '#0a0a0c';
export const WALL = '#f3f2ef';

// ---------------------------------------------------------------- retro layer (owner 6 Nov: old NASA / computer feel, same calm vibe)
export const TERM = 'VT323, monospace';
export const useRetroFonts = () => {
  useFonts();
  const [h] = React.useState(() => delayRender('vt323'));
  React.useEffect(() => {
    new FontFace('VT323', `url(${staticFile('fonts/VT323-Regular.ttf')})`).load().then((ff) => { document.fonts.add(ff); continueRender(h); });
  }, [h]);
};

// CRT texture over archive shots and black cards: fine scanlines, moving grain, soft corners.
export const Crt: React.FC<{f: number; grain?: number}> = ({f, grain = 0.09}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: grain, mixBlendMode: 'overlay'}}>
      <filter id={`g${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={f % 6} /></filter>
      <rect width={1920} height={1080} filter={`url(#g${f % 6})`} />
    </svg>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 5px)'}} />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.55)'}} />
  </AbsoluteFill>
);

// Terminal line: words land one per step, block cursor blinks after the last one.
export const Term: React.FC<{text: string; at: number; f: number; size?: number; step?: number; color?: string; cursor?: boolean}> = ({text, at, f, size = 84, step = 5, color = '#ececec', cursor = true}) => {
  const ws = text.split(' ');
  const shown = ws.filter((_, i) => f >= at + i * step).length;
  const blink = Math.floor(f / 12) % 2 === 0;
  return (
    <div style={{fontFamily: TERM, fontSize: size, color, whiteSpace: 'pre', lineHeight: 1}}>
      {ws.map((w, i) => <span key={i} style={{opacity: i < shown ? 1 : 0}}>{w}{i < ws.length - 1 ? ' ' : ''}</span>)}
      {cursor && <span style={{display: 'inline-block', width: size * 0.5, height: size * 0.82, marginLeft: size * 0.12, background: color, opacity: blink ? 1 : 0, verticalAlign: 'baseline', transform: `translateY(${size * 0.08}px)`}} />}
    </div>
  );
};

// Old-OS dialog in our royal blue, bevelled like the machines in the archive shots.
export const Dialog: React.FC<{x: number; y: number; w: number; title: string; children: React.ReactNode; buttons?: string[]; pop?: number}> = ({x, y, w, title, children, buttons = ['OK'], pop = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, background: '#c8c8cc', border: '3px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6', boxShadow: '6px 6px 0 rgba(0,0,0,0.45)', opacity: pop, transform: `scale(${0.95 + 0.05 * pop})`, transformOrigin: '50% 50%'}}>
    <div style={{height: 40, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 0 12px'}}>
      <span style={{fontFamily: TERM, fontSize: 32, color: '#fff'}}>{title}</span>
      <span style={{width: 28, height: 26, background: '#c8c8cc', border: '2px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6', fontFamily: TERM, fontSize: 26, lineHeight: '22px', textAlign: 'center', color: '#111'}}>x</span>
    </div>
    <div style={{padding: '22px 24px 10px', fontFamily: TERM, fontSize: 40, color: '#111', lineHeight: 1.1}}>{children}</div>
    <div style={{display: 'flex', justifyContent: 'center', gap: 18, padding: '10px 0 20px'}}>
      {buttons.map((b) => <span key={b} style={{minWidth: 120, textAlign: 'center', padding: '6px 14px', fontFamily: TERM, fontSize: 34, color: '#111', border: '3px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6', background: '#c8c8cc'}}>{b}</span>)}
    </div>
  </div>
);

// ---------------------------------------------------------------- shared bits
export const Words: React.FC<{text: string; at: number; f: number; size?: number; color?: string; step?: number; weight?: number}> = ({text, at, f, size = 64, color = '#fff', step = 5, weight = 600}) => (
  <div style={{fontFamily: FONT.display, fontWeight: weight, fontSize: size, color, letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>
    {text.split(' ').map((w, i) => (
      <span key={i} style={{opacity: f >= at + i * step ? 1 : 0}}>{w}{' '}</span>
    ))}
  </div>
);

export const Center: React.FC<{children: React.ReactNode; y?: number; gap?: number}> = ({children, y = 0, gap = 0}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap, transform: `translateY(${y}px)`}}>{children}</div>
);

// Full-bleed archival photo with a slow push-in. `fit` contain keeps museum objects whole on their grey sweep.
export const Photo: React.FC<{src: string; f: number; dur: number; fit?: 'cover' | 'contain'; bg?: string; zoom?: [number, number]; pos?: string; dim?: number}> = ({src, f, dur, fit = 'cover', bg = '#cfcfcf', zoom = [1.08, 1.0], pos = '50% 50%', dim = 0.18}) => {
  const s = zoom[0] + (zoom[1] - zoom[0]) * prog(f, 0, dur, inOut);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit, objectPosition: pos, transform: `scale(${s})`}} />
      <AbsoluteFill style={{background: '#000', opacity: dim}} />
    </AbsoluteFill>
  );
};

export const BigWord: React.FC<{children: React.ReactNode; color?: string; y?: number; size?: number}> = ({children, color = '#fff', y = 0, size = 230}) => (
  <Center y={y}><div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: size, letterSpacing: '-0.04em', color, textShadow: color === '#fff' ? '0 4px 40px rgba(0,0,0,0.35)' : 'none'}}>{children}</div></Center>
);

// ---------------------------------------------------------------- modern forms (drawn, Studio palette)
export const Phone: React.FC<{x: number; y: number; w?: number; children: React.ReactNode; rot?: number}> = ({x, y, w = 420, children, rot = 0}) => {
  const h = w * 2.06;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', left: 16, top: 22, width: w, height: h, borderRadius: w * 0.15, background: C.ground3}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: w * 0.15, background: C.dark}} />
      <div style={{position: 'absolute', left: 14, top: 14, right: 14, bottom: 14, borderRadius: w * 0.12, overflow: 'hidden', background: C.white}}>{children}</div>
      <div style={{position: 'absolute', left: w / 2 - 44, top: 28, width: 88, height: 24, borderRadius: 12, background: C.dark}} />
    </div>
  );
};

export const LightNew: React.FC<{f: number}> = ({f}) => {
  const on = prog(f, 4, 10);
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <line x1={960} y1={0} x2={960} y2={250} stroke={C.ink} strokeWidth={8} />
        <rect x={922} y={250} width={76} height={70} rx={10} fill={C.ink2} />
        <path d="M 960 320 C 820 320 760 420 760 520 C 760 640 860 690 960 690 C 1060 690 1160 640 1160 520 C 1160 420 1100 320 960 320 Z" fill={on > 0.5 ? '#ffe9a8' : '#ffffff'} stroke={C.ink} strokeWidth={8} />
        <path d="M 920 330 L 920 470 M 1000 330 L 1000 470 M 920 470 Q 960 520 1000 470" fill="none" stroke={on > 0.5 ? '#e0a400' : C.ink2} strokeWidth={8} strokeLinecap="round" />
        {on > 0.5 && [0, 35, 145, 180, 215, 270, 325].map((d) => {
          const a = (d * Math.PI) / 180;
          const r1 = 240, r2 = 300 + 20 * on;
          return <line key={d} x1={960 + Math.cos(a) * r1} y1={505 - Math.sin(a) * r1} x2={960 + Math.cos(a) * r2} y2={505 - Math.sin(a) * r2} stroke="#e0a400" strokeWidth={10} strokeLinecap="round" />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const MapScreen: React.FC<{f: number}> = ({f}) => {
  const t = prog(f, 0, 28, inOut);
  const route = 'M 60 760 L 60 600 L 220 600 L 220 420 L 330 420 L 330 200';
  return (
    <svg width="100%" height="100%" viewBox="0 0 392 836">
      <rect width={392} height={836} fill="#f1efe8" />
      <rect x={250} y={470} width={140} height={160} fill="#cfe8c4" />
      <rect x={0} y={90} width={150} height={120} fill="#cfe8c4" />
      {[120, 300, 420, 600, 760].map((y) => <rect key={y} x={0} y={y - 9} width={392} height={18} fill="#fff" />)}
      {[60, 220, 330].map((x) => <rect key={x} x={x - 9} y={0} width={18} height={836} fill="#fff" />)}
      <path d={route} fill="none" stroke={C.blue} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1200} strokeDashoffset={1200 * (1 - t)} />
      <circle cx={60} cy={760} r={18} fill={C.blue} stroke="#fff" strokeWidth={6} />
      <path d="M 330 170 C 310 170 300 186 300 200 C 300 222 330 250 330 250 C 330 250 360 222 360 200 C 360 186 350 170 330 170 Z" fill="#e5484d" />
      <circle cx={330} cy={200} r={10} fill="#fff" />
    </svg>
  );
};

export const MapsNew: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: C.ground}}><Phone x={960} y={560} w={430}><MapScreen f={f} /></Phone></AbsoluteFill>
);

export const MoneyNew: React.FC<{f: number}> = ({f}) => {
  const pop = prog(f, 6, 16);
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <Phone x={960} y={560} w={430}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <div style={{transform: `scale(${0.6 + 0.4 * pop})`, opacity: pop}}><Check size={150} bg={C.blue} /></div>
          <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 64, color: C.ink, letterSpacing: '-0.02em'}}>AED 18.00</div>
          <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: C.muted}}>Paid · Corner café</div>
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

export const ComputersNew: React.FC<{f: number}> = ({f}) => {
  const win = (i: number) => prog(f, 2 + i * 4, 14 + i * 4);
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <div style={{position: 'absolute', left: 960 - 520 + 16, top: 250 + 18, width: 1040, height: 650, borderRadius: 30, background: C.ground3}} />
      <div style={{position: 'absolute', left: 960 - 520, top: 250, width: 1040, height: 650, borderRadius: 30, background: C.dark}} />
      <div style={{position: 'absolute', left: 960 - 500, top: 270, width: 1000, height: 610, borderRadius: 12, overflow: 'hidden', background: '#d9d9f7'}}>
        {[[70, 70, 520, 330], [430, 160, 500, 360], [230, 300, 420, 260]].map(([x, y, w, h], i) => (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, background: C.white, border: `2px solid ${C.line}`, opacity: win(i), transform: `translateY(${(1 - win(i)) * 30}px)`}}>
            <div style={{height: 40, borderBottom: `2px solid ${C.line}`, display: 'flex', gap: 8, alignItems: 'center', paddingLeft: 14}}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />)}
            </div>
            {[0, 1, 2].map((r) => <div key={r} style={{margin: '22px 22px 0', height: 18, width: `${80 - r * 18}%`, borderRadius: 9, background: C.line}} />)}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 960 - 640, top: 900, width: 1280, height: 26, borderRadius: '0 0 22px 22px', background: C.ground3}} />
    </AbsoluteFill>
  );
};

// The to-do list app icon: the thing that never evolved.
export const TodoIcon: React.FC<{size: number; badge: number}> = ({size, badge}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: size * 0.23, background: C.white, border: `3px solid ${C.line}`, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: size * 0.18, top: size * (0.22 + i * 0.21), display: 'flex', alignItems: 'center', gap: size * 0.07}}>
          <div style={{width: size * 0.13, height: size * 0.13, borderRadius: size * 0.04, border: `${size * 0.025}px solid ${C.blue}`}} />
          <div style={{width: size * (0.42 - i * 0.06), height: size * 0.05, borderRadius: size * 0.03, background: C.ink2}} />
        </div>
      ))}
    </div>
    {badge > 0 && (
      <div style={{position: 'absolute', right: -size * 0.12, top: -size * 0.12, minWidth: size * 0.34, height: size * 0.34, borderRadius: size * 0.17, background: '#e5484d', color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: size * 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${size * 0.06}px`, boxSizing: 'border-box'}}>{badge}</div>
    )}
  </div>
);

// ---------------------------------------------------------------- ACT 1: hook (0 to 450)
const CATS: {word: string; old: string; old2?: string; fit: 'cover' | 'contain'; bg: string; New: React.FC<{f: number}>}[] = [
  {word: 'Light', old: 'arch/lamp.jpg', fit: 'contain' as const, bg: '#d5d5d3', New: LightNew},
  {word: 'Maps', old: 'arch/map.jpg', fit: 'contain' as const, bg: '#c9c9c6', New: MapsNew},
  {word: 'Money', old: 'arch/dinar.jpg', fit: 'contain' as const, bg: '#cfcfcd', New: MoneyNew},
  {word: 'Computers', old: 'arch/GRC-1955-C-39782.jpg', old2: 'arch/computers.jpg', fit: 'cover' as const, bg: '#000', New: ComputersNew},
];
export const H = {line1: 8, evolves: 40, line2: 96, montage: 150, cat: 60, half: 30, ask: 400, end: 480};

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  if (f < H.montage) {
    return (
      <AbsoluteFill style={{background: BLACK}}>
        {f < 88 && <Center><Term f={f} at={H.line1} text="Everything we make evolves." step={8} size={96} /></Center>}
        {f >= 88 && <Center><Term f={f} at={H.line2} text="It's not a choice." step={9} size={96} /></Center>}
        <Crt f={f} />
      </AbsoluteFill>
    );
  }
  const m = f - H.montage;
  const i = Math.floor(m / H.cat);
  if (i < CATS.length) {
    const c = CATS[i];
    const lf = m - i * H.cat;
    const isOld = lf < H.half;
    return (
      <AbsoluteFill>
        {isOld ? <Photo src={c.old2 && lf >= 15 ? c.old2 : c.old} f={c.old2 ? lf % 15 : lf} dur={c.old2 ? 15 : H.half} fit={c.fit} bg={c.bg} dim={c.fit === 'cover' ? 0.28 : 0.12} /> : (
          <AbsoluteFill style={{background: C.ground}}><AbsoluteFill style={{transform: 'translateY(150px) scale(0.72)'}}><c.New f={lf - H.half} /></AbsoluteFill></AbsoluteFill>
        )}
        {isOld && <Crt f={f} />}
        {isOld ? <BigWord>{c.word}</BigWord> : <BigWord color={C.ink} y={-370} size={170}>{c.word}</BigWord>}
      </AbsoluteFill>
    );
  }
  // "And this?" on the to-do list icon, its badge creeping up.
  const lf = f - H.ask;
  const e = prog(lf, 0, 14);
  const badge = lf < 0 ? 0 : Math.min(47, 3 + Math.floor(Math.max(0, lf - 16) / 2.2));
  return (
    <AbsoluteFill style={{background: BLACK}}>
      {f >= H.ask && (
        <>
          <Center y={-60}><div style={{opacity: e, transform: `scale(${0.9 + 0.1 * e})`}}><TodoIcon size={220} badge={badge} /></div></Center>
          <Center y={200}><Term f={f} at={H.ask + 8} text="And this?" size={72} /></Center>
        </>
      )}
      <Crt f={f} />
    </AbsoluteFill>
  );
};

export const HookFilm: React.FC = () => {
  useRetroFonts();
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Audio src={staticFile('trailer-hook.wav')} />
      <Hook />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- style frame: pivot (archival office)
export const FramePivot: React.FC = () => {
  useRetroFonts();
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Photo src="arch/GRC-1968-C-00447.jpg" f={0} dur={1} zoom={[1, 1]} dim={0.25} pos="50% 40%" />
      <Dialog x={1220} y={140} w={580} title="Reminder" buttons={['OK', 'Snooze']}>Book the flight.<br />Due today.</Dialog>
      <Dialog x={1260} y={370} w={580} title="Reminder" buttons={['OK', 'Snooze']}>Move the dentist.<br />Overdue.</Dialog>
      <Dialog x={1300} y={600} w={580} title="To-do" buttons={['OK']}>You have 47 things to do.</Dialog>
      <Crt f={3} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center'}}>
        <span style={{fontFamily: TERM, fontSize: 60, color: '#ffe066', background: 'rgba(0,0,0,0.55)', padding: '2px 18px'}}>It got better at reminding you. Never at doing it.</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- style frame: reveal
export const FrameReveal: React.FC = () => {
  useRetroFonts();
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Center><Term f={100} at={0} text="Until now." size={120} /></Center>
      <Crt f={1} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- style frame: demo (real product: WhatsApp + the list doing itself)
export const TodoRow: React.FC<{text: string; state: 'done' | 'wait'; sub: string}> = ({text, state, sub}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '26px 30px', borderTop: `2px solid ${C.line}`}}>
    {state === 'done' ? <Check size={46} bg={C.blue} /> : <div style={{width: 46, height: 46, borderRadius: 23, border: `4px solid ${C.blue}`, boxSizing: 'border-box'}} />}
    <div style={{flex: 1}}>
      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 34, color: state === 'done' ? C.muted : C.ink, textDecoration: state === 'done' ? 'line-through' : 'none'}}>{text}</div>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 25, color: C.muted, marginTop: 4}}>{sub}</div>
    </div>
    {state === 'wait' && <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 28, color: '#fff', background: C.blue, borderRadius: 16, padding: '14px 26px'}}>Approve</div>}
  </div>
);

export const FrameDemo: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <div style={{position: 'absolute', left: 150, top: 70, fontFamily: FONT.display, fontWeight: 800, fontSize: 92, letterSpacing: '-0.03em', color: C.ink}}>All of it done.<span style={{color: C.blue}}> You just said yes.</span></div>
      <div style={{position: 'absolute', left: 150, top: 230, width: 430, height: 880, transformOrigin: '0 0', transform: 'scale(0.92)'}}>
        <div style={{position: 'absolute', left: 16, top: 22, width: 430, height: 880, borderRadius: 66, background: C.ground3}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 66, background: C.dark}} />
        <div style={{position: 'absolute', left: 16, top: 16, width: 398, height: 848, borderRadius: 50, overflow: 'hidden', background: C.chatPaper}}>
          <HeaderGreen avatar={<AgentAvatar size={64} id="d1" status="complete" />} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 112}}>
            <Bubble f={999} at={0} top={24} out skin={GREEN} time="08:02">Sort tomorrow for me. Move the dentist, change my flight, send Sara the deck.</Bubble>
            <Bubble f={999} at={0} top={250} skin={GREEN} time="08:02">On it. I will check with you before anything goes out.</Bubble>
            <Bubble f={999} at={0} top={400} skin={GREEN} time="08:09">Dentist moved to 4 pm. Flight changed to Friday. Deck is ready for Sara.</Bubble>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.field, borderTop: `2px solid ${C.line}`}}>
            <div style={{position: 'absolute', left: 16, top: 20, width: 272, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`}}><span style={{position: 'absolute', left: 22, top: 17, fontFamily: FONT.body, fontSize: 27, color: C.muted}}>Message</span></div>
            <div style={{position: 'absolute', right: 16, top: 20, width: 68, height: 68, borderRadius: 34, background: C.chatHead}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 430 / 2 - 46, top: 26, width: 92, height: 26, borderRadius: 13, background: C.dark}} />
      </div>
      <div style={{position: 'absolute', left: 700, top: 300, width: 1070, background: C.white, borderRadius: 28, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '28px 30px'}}>
          <AgentAvatar size={56} id="d2" bg={C.ground} status="needs-input" />
          <div>
            <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: C.ink}}>Tomorrow</div>
            <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 25, color: C.muted}}>Your agent worked on this while you were out</div>
          </div>
        </div>
        <TodoRow text="Move the dentist" state="done" sub="Now Thursday, 4:00 pm. Calendar updated." />
        <TodoRow text="Change the flight" state="done" sub="Moved to Friday, 9:40 am. Same seat." />
        <TodoRow text="Send Sara the deck" state="wait" sub="Ready to send. Waiting for your OK." />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- style frame: gallery outro
export const Hung: React.FC<{x: number; w: number; h: number; children: React.ReactNode; label: string}> = ({x, w, h, children, label}) => (
  <div style={{position: 'absolute', left: x, top: 430 - h / 2, width: w}}>
    <div style={{width: w, height: h, background: '#fff', padding: 18, boxSizing: 'border-box', boxShadow: '0 18px 30px rgba(0,0,0,0.18)', border: '10px solid #2a2a2e'}}>
      <div style={{width: '100%', height: '100%', overflow: 'hidden', position: 'relative'}}>{children}</div>
    </div>
    <div style={{marginTop: 22, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: '#55565c', letterSpacing: '0.04em'}}>{label}</div>
  </div>
);

export const FrameGallery: React.FC = () => {
  useFonts();
  const img = (s: string, fit: 'cover' | 'contain' = 'cover', bg = '#d0d0ce') => <Img src={staticFile(s)} style={{width: '100%', height: '100%', objectFit: fit, background: bg}} />;
  return (
    <AbsoluteFill style={{background: WALL}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 868, bottom: 0, background: '#cfcdc7'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 8, background: '#e2e0da'}} />
      <Hung x={-150} w={320} h={360} label="LIGHT">{img('arch/lamp.jpg', 'contain')}</Hung>
      <Hung x={250} w={310} h={400} label="MAPS">{img('arch/map.jpg', 'contain', '#c9c9c6')}</Hung>
      <Hung x={640} w={330} h={330} label="MONEY">{img('arch/dinar.jpg', 'contain')}</Hung>
      <Hung x={1050} w={420} h={340} label="COMPUTERS">{img('arch/GRC-1955-C-39782.jpg')}</Hung>
      <Hung x={1530} w={360} h={470} label="YOUR TO-DO LIST">
        <div style={{position: 'absolute', inset: 0, background: C.ground, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('headmaster-icon-dark.svg')} style={{width: 220, height: 220, borderRadius: 50}} />
        </div>
      </Hung>
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.ink, letterSpacing: '-0.02em'}}>Everything we make finds its next form.</div>
    </AbsoluteFill>
  );
};
