import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import TL from './film2.json';
import {C, FONT, out, prog} from './theme';
import {BLACK, Center, Crt, TERM, Term} from './Trailer';

// v2 opening, paced like the reference: a cut every half beat (15 frames at 120 bpm), 4 photos per word
// running old -> today, type that smashes through the camera, an original 8-bit "evolving" gag, a music run,
// then "And this?" on a phone home screen. Photos: The Met (CC0), NASA (PD), Wikimedia Commons (credits.json).
export const H2 = {
  on: 0, line1: 18, line2: 84, smash: [138, 150], montage: 150, img: 15,
  words: [
    {w: 'Light', imgs: ['clips/48919.mp4', 'clips/41740.mp4', 'clips/47241.mp4', 'clips/48298.mp4', 'clips/6754.mp4']},
    {w: 'Maps', imgs: ['clips/21612.mp4', 'clips/21621.mp4', 'clips/21607.mp4', 'clips/45032.mp4', 'brand/maps-today.jpg']},
    {w: 'Money', imgs: ['clips/31100.mp4', 'clips/18249.mp4', 'clips/18297.mp4', 'brand/money-today.jpg']},
    {w: 'Computers', imgs: ['clips/41266.mp4', 'clips/50748.mp4', 'clips/46635.mp4', 'clips/308.mp4']},
    {w: 'Music', imgs: ['clips/42920.mp4', 'clips/48459.mp4', 'clips/48532.mp4', 'brand/music-today.jpg']},
  ],
 gag: 0, ask: 0, end: 0,
};
// Lay the montage out on the half-beat grid.
{
  let t = H2.montage;
  (H2 as any).starts = H2.words.map((w) => { const s = t; t += w.imgs.length * H2.img; return s; });
  // The gag sits between Computers and Music.
  const gi = 4;
  const st = (H2 as any).starts as number[];
  H2.gag = st[gi];
  // 62 frames: the reference's evolve gag runs 11.20 to 13.27 s.
  const gagLen = 62;
  st[gi] = H2.gag + gagLen;
  H2.ask = st[gi] + H2.words[gi].imgs.length * H2.img;
  H2.end = (TL as any).scenes.hook[1];
}
const STARTS = (H2 as any).starts as number[];

// Cut punch: each cut lands slightly zoomed and shaken, then settles fast (heavy spring feel, no overshoot on type).
const Punch: React.FC<{lf: number; seed: number; children: React.ReactNode}> = ({lf, seed, children}) => {
  const k = Math.exp(-lf / 4);
  const dx = (random(`x${seed}`) - 0.5) * 34 * k, dy = (random(`y${seed}`) - 0.5) * 22 * k;
  const s = 1.18 - 0.14 * out(Math.min(1, lf / 15)) + 0.04 * k;
  return <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(${s})`}}>{children}</AbsoluteFill>;
};

// A real clip on its own clock: the clip starts at its cut, from a hand-picked moment (START, seconds).
const START: Record<string, number> = {'pokemon-evolve.mp4': 0, 'clips/18249.mp4': 2.2, 'clips/48532.mp4': 1, 'clips/47241.mp4': 1.5, 'clips/31100.mp4': 4, 'clips/7248.mp4': 2, 'clips/6833.mp4': 2};
const Clip: React.FC<{src: string; lf: number; fit?: 'cover'}> = ({src, lf}) => {
  const f = useCurrentFrame();
  return (
    <Sequence from={f - lf} layout="none">
      <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round((START[src] ?? 2) * 30)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.06) saturate(0.95)'}} />
    </Sequence>
  );
};

const Shot: React.FC<{src: string; lf: number; seed: number}> = ({src, lf, seed}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Punch lf={lf} seed={seed}>
      {src.endsWith('.mp4')
        ? <Clip src={src} lf={lf} />
        : <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}

    </Punch>
    <AbsoluteFill style={{background: 'radial-gradient(120% 95% at 50% 50%, transparent 45%, rgba(0,0,0,0.62) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,12,0,0.10), rgba(0,10,20,0.14))', mixBlendMode: 'multiply'}} />
  </AbsoluteFill>
);

const Word: React.FC<{w: string; lf: number}> = ({w, lf}) => {
  const e = out(Math.min(1, lf / 6));
  return (
    <Center>
      <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 250, letterSpacing: '-0.045em', color: '#fff', textShadow: '0 6px 60px rgba(0,0,0,0.45)', transform: `scale(${1.25 - 0.25 * e})`, filter: `blur(${(1 - e) * 8}px)`}}>{w}</div>
    </Center>
  );
};

// Original 8-bit gag on "Games.": a small pixel creature of our own flickers, flashes white and really evolves.
const SPRITE_A = ['....XXXX....', '..XXOOOOXX..', '.XOOOOOOOOX.', 'XOOEOOOOEOOX', 'XOOEOOOOEOOX', 'XOOOOOOOOOOX', 'XOOOOMMOOOOX', '.XOOOOOOOOX.', '..XX....XX..'];
const SPRITE_B = ['.X........X.', 'XLX......XLX', 'XLLXXXXXXLLX', '.XOOOOOOOOX.', 'XOOEEOOEEOOX', 'XOOEWOOEWOOX', 'XOOOOOOOOOOX', 'XOOOMMMMOOOX', 'XOOOOOOOOOOX', '.XOOXOOXOOX.', '.XXX.XX.XXX.'];
const PAL: Record<string, string> = {X: '#1b1b1b', O: '#c9c9f5', E: '#1b1b1b', M: '#8f8ff0', L: '#8f8ff0', W: '#ffffff'};
const Sprite: React.FC<{rows: string[]; px: number}> = ({rows, px}) => (
  <svg width={rows[0].length * px} height={rows.length * px} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges">
    {rows.flatMap((r, y) => r.split('').map((c, x) => (c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PAL[c]} />)))}
  </svg>
);
const Gag: React.FC<{lf: number}> = ({lf}) => {
  // The owner's clip, retimed frame by frame to the reference (tools/pokemon_evolve.py): it plays from the cut, no title.
  if ((TL as any).evolveClip) return <AbsoluteFill style={{background: '#000'}}><Clip src={(TL as any).evolveClip} lf={lf} /></AbsoluteFill>;
  const flick = lf >= 24 && lf < 54 ? Math.floor(lf / Math.max(2, 8 - (lf - 24) / 4)) % 2 === 1 : false;
  const flash = lf >= 54 && lf < 58;
  const done = lf >= 58;
  const line = done ? 'It evolved!' : 'What? It is evolving!';
  const shown = line.split(' ').filter((_, i) => lf >= (done ? 60 : 26) + i * 4).join(' ');
  const pop = done ? 1 + 0.12 * Math.exp(-(lf - 58) / 5) : 1;
  return (
    <AbsoluteFill style={{background: flash ? '#fff' : done ? '#e8e8f8' : '#0f1220', imageRendering: 'pixelated'}}>
      {!done && lf >= 24 && Array.from({length: 14}).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + lf * 0.06;
        const r = 260 + ((lf * 9 + i * 37) % 260);
        return <div key={i} style={{position: 'absolute', left: 960 + Math.cos(a) * r - 9, top: 420 + Math.sin(a) * r - 9, width: 18, height: 18, background: '#fff', opacity: 0.85}} />;
      })}
      {lf >= 20 && (TL as any).evolveClip && (
        <AbsoluteFill style={{overflow: 'hidden'}}><Clip src={(TL as any).evolveClip} lf={lf - 20} /></AbsoluteFill>
      )}
      {lf >= 20 && !(TL as any).evolveClip && !flash && (
        <AbsoluteFill style={{overflow: 'hidden', filter: flick ? 'brightness(2.2) saturate(0)' : 'none'}}>
          <Clip src={done ? 'clips/6833.mp4' : 'clips/7248.mp4'} lf={done ? lf - 58 : lf - 20} />
        </AbsoluteFill>
      )}
      {false && <Center y={-120}>
        <div style={{transform: `scale(${pop})`, filter: flick ? 'brightness(0) invert(1)' : 'none'}}>
          {done ? <Sprite rows={SPRITE_B} px={40} /> : <Sprite rows={SPRITE_A} px={30} />}
        </div>
      </Center>}
      {lf >= 24 && !(TL as any).evolveClip && (
        <div style={{position: 'absolute', left: 160, right: 160, bottom: 90, height: 190, background: '#f8f8f8', border: '10px solid #2b4a6f', borderRadius: 14, boxShadow: 'inset 0 0 0 6px #d8a440'}}>
          <div style={{padding: '34px 46px', fontFamily: TERM, fontSize: 96, color: '#1b1b1b', lineHeight: 1}}>{shown}</div>
        </div>
      )}
      {lf >= 6 && lf < 24 && <Word w="Games" lf={lf - 6} />}
    </AbsoluteFill>
  );
};

// "And this?" The real Reminders icon on black, like the reference's real Mail icon; its badge starts climbing.
export const Badge: React.FC<{n: number; size: number}> = ({n, size}) => (
  <div style={{position: 'absolute', right: -size * 0.12, top: -size * 0.12, minWidth: size * 0.36, height: size * 0.36, padding: `0 ${size * 0.08}px`, boxSizing: 'border-box', borderRadius: size * 0.18, background: '#ff3b30', color: '#fff', fontFamily: FONT.body, fontWeight: 600, fontSize: size * 0.22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontVariantNumeric: 'tabular-nums'}}>{n}</div>
);
const Ask: React.FC<{lf: number}> = ({lf}) => {
  const e = out(prog(lf, 0, 24));
  const badge = lf < 34 ? 0 : Math.min(47, 3 + Math.floor((lf - 34) / 1.6));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Center y={-70}>
        <div style={{position: 'relative', width: 300, height: 300, opacity: e, transform: `scale(${0.94 + 0.06 * e + 0.05 * prog(lf, 24, 103, (t) => t)})`}}>
          <Img src={staticFile('apple/reminders-icon.png')} style={{width: 300, height: 300, borderRadius: 68}} />
          {badge > 0 && <Badge n={badge} size={300} />}
        </div>
      </Center>
      <Center y={250}><Term f={lf} at={10} text="And this?" size={96} /></Center>
    </AbsoluteFill>
  );
};

export const Hook2: React.FC = () => {
  const f = useCurrentFrame();
  // Cold open: CRT power-on line, then the lines type in.
  if (f < H2.montage) {
    const on = prog(f, 0, 10);
    const sm = prog(f, H2.smash[0], H2.smash[1], (t) => t * t * t);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{background: BLACK, transform: `scaleY(${0.004 + 0.996 * on})`, filter: `brightness(${1 + 2 * (1 - on)})`}}>
          {f < 78 && <Center><Term f={f} at={H2.line1} text="Everything we make evolves." step={7} size={124} /></Center>}
          {f >= 78 && (
            <Center>
              <div style={{transform: `scale(${1 + 14 * sm})`, filter: `blur(${sm * 14}px)`, opacity: 1 - prog(f, H2.smash[1] - 3, H2.smash[1])}}>
                <Term f={f} at={H2.line2} text="It's not a choice." step={9} size={124} cursor={sm === 0} />
              </div>
            </Center>
          )}
          <Crt f={f} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (f >= H2.gag && f < STARTS[4]) return <Gag lf={f - H2.gag} />;
  if (f >= H2.ask) return <Ask lf={f - H2.ask} />;
  const wi = STARTS.reduce((acc, s, i) => (f >= s ? i : acc), 0);
  const w = H2.words[wi];
  const lf = f - STARTS[wi];
  const ii = Math.min(w.imgs.length - 1, Math.floor(lf / H2.img));
  const cut = lf - ii * H2.img;
  return (
    <AbsoluteFill>
      <Shot src={w.imgs[ii]} lf={cut} seed={wi * 10 + ii} />
      <Crt f={f} grain={0.07} />
      <Word w={w.w} lf={lf} />
      {lf < 2 && <AbsoluteFill style={{background: '#fff', opacity: 0.55 * (1 - lf / 2)}} />}
    </AbsoluteFill>
  );
};

// Opening preview with the generated track. The track's drop (16.0 s) lands on the first montage cut (frame 150),
// so the music starts 11 s in; its beats then sit on our 15-frame grid.
import {Audio, interpolate} from 'remotion';
import {useRetroFonts} from './Trailer';
export const MUSIC_OFFSET = 330;
export const Hook2Film: React.FC = () => {
  useRetroFonts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music-a.mp3')} startFrom={MUSIC_OFFSET} volume={(f) => interpolate(f, [H2.end - 20, H2.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Hook2 />
    </AbsoluteFill>
  );
};
