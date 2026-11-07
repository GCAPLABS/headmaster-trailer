import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AgentAvatar} from './Agent';
import {Check, Cursor} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, GREEN} from './ThreadUI';
import {Gallery3D} from './Gallery3D';
import {Badge, Hook2} from './Hook2';
import {Lines, Pic, PhoneShell, Title, Win} from './Full';
import {Center, Crt, useRetroFonts} from './Trailer';
import TL from './film2.json';
import WORDS from './vo-words.json';

// v2 full film, 96 s. Paced like the reference: 15 s of hard cuts, then a calm narrator carries long holds.
// One timeline (film2.json) drives the picture, the subtitles and the sound mix (tools/film2_audio.py).
const S = TL.scenes as Record<string, number[]>;
const FPS = 30;
const HAND = 'Caveat, cursive';
const W = WORDS as [number, number, string][];
// Film frame where each narration line starts, and how long it runs.
const VO = (TL.vo as [number, number, number, string | null][]).map(([a, b, t, sub]) => ({at: Math.round(t * FPS), len: Math.round((W[b][1] - W[a][0]) * FPS), sub}));
const voAt = (i: number) => VO[i].at;
// Film frame where a given word inside a narration line starts.
const wordAt = (i: number, word: string) => {
  const [a, b, t] = TL.vo[i] as [number, number, number, string | null];
  const k = W.slice(a, b + 1).findIndex((w) => w[2].toLowerCase().startsWith(word.toLowerCase()));
  return Math.round((t + (k < 0 ? 0 : W[a + k][0] - W[a][0])) * FPS);
};

const useHand = () => {
  const [h] = React.useState(() => delayRender('caveat'));
  React.useEffect(() => {
    new FontFace('Caveat', `url(${staticFile('fonts/Caveat.ttf')})`, {weight: '400 700'}).load().then((ff) => { document.fonts.add(ff); continueRender(h); });
  }, [h]);
};
const springAt = (f: number, at: number, cfg = {damping: 16, stiffness: 150, mass: 0.9}) => spring({frame: f - at, fps: FPS, config: cfg});

// ---------------------------------------------------------------- The middle story, v4: real footage and real screens only.
// Old web: real webcore pins (webcore-pinterest-urls.txt). Today: Apple's own iOS 26 and macOS screenshots (support.apple.com).
// Footage: Mixkit. No drawn dialogs, no drawn phones.
const GMAIL = 'Roboto, Arial, sans-serif';
const useRoboto = () => {
  const [h] = React.useState(() => delayRender('roboto'));
  React.useEffect(() => {
    new FontFace('Roboto', `url(${staticFile('fonts/Roboto.ttf')})`, {weight: '100 900'}).load().then((ff) => { document.fonts.add(ff); continueRender(h); });
  }, [h]);
};
// A real clip from its own in-point, filling the frame, with a slow push.
const Footage: React.FC<{src: string; from: number; f: number; len: number; pos?: string; push?: number}> = ({src, from, f, len, pos = '50% 50%', push = 0.06}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `scale(${1.02 + push * prog(f, 0, len, (t) => t)})`}}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(from * FPS)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.05) saturate(0.95)'}} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(120% 95% at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)'}} />
  </AbsoluteFill>
);
// A real screenshot that springs in and drifts, with a soft floor shadow.
const Shot: React.FC<{src: string; f: number; at?: number; x: number; y: number; w: number; rot?: number; radius?: number; shadow?: boolean; soft?: boolean}> = ({src, f, at = 0, x, y, w, rot = 0, radius = 0, shadow = true, soft = false}) => {
  const s = springAt(f, at, {damping: 18, stiffness: 140, mass: 0.9});
  if (f < at) return null;
  return (
    <Img src={staticFile(src)} style={{position: 'absolute', left: x, top: y, width: w, borderRadius: radius, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 50}px) rotate(${rot}deg) scale(${0.96 + 0.04 * Math.min(1, s)})`, boxShadow: !shadow ? 'none' : soft ? '0 24px 60px rgba(20,20,60,0.16), 0 0 0 1px rgba(0,0,0,0.06)' : '0 30px 70px rgba(0,0,0,0.45)'}} />
  );
};

// "It changed too. Again and again." Like the reference's history of email: on black, the line types in the centre on the
// spoken words while real to-do apps through the years drop in around it, oldest first (public/todo/, see docs/todo-history.md).
const COLLAGE: {src: string; x: number; y: number; w: number; rot: number}[] = [
  {src: 'todo/1947-secretarys-day-planner.jpg', x: 110, y: 70, w: 430, rot: -6},
  {src: 'todo/2008-todoist.jpg', x: 120, y: 650, w: 520, rot: 4},
  {src: 'todo/2009-things.jpg', x: 760, y: 40, w: 380, rot: 3},
  {src: 'todo/2013-google-tasks.jpg', x: 1330, y: 80, w: 500, rot: 5},
  {src: 'todo/2017-microsoft-to-do.jpg', x: 1300, y: 660, w: 520, rot: -4},
  {src: 'apple/mac-reminders-camping.png', x: 700, y: 660, w: 520, rot: -2},
];
const Evolved: React.FC<{f: number}> = ({f}) => {
  const g = f + S.evolved[0];
  const words = [['It', wordAt(8, 'It')], ['changed', wordAt(8, 'changed')], ['too.', wordAt(8, 'too')], ['Again', wordAt(9, 'Again')], ['and', wordAt(9, 'and')], ['again.', wordAt(9, 'again') + 6]] as [string, number][];
  const line = words.filter(([, t]) => g >= t).map(([w]) => w).join(' ');
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* pictures drop in at an even, steady pace through the line, like the reference (one every 12 frames) */}
      {COLLAGE.map((c, i) => <Shot key={c.src} src={c.src} f={f} at={i * 12} x={c.x} y={c.y} w={c.w} rot={c.rot} radius={6} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 64, letterSpacing: '-0.01em', color: '#fff', zIndex: 2}}>{line}</div>
    </AbsoluteFill>
  );
};

// "It left the paper." A pen on a real notepad.
const Paper: React.FC<{f: number}> = ({f}) => <Footage src="clips/42655.mp4" from={0.4} f={f} len={60} pos="50% 40%" />;

// "It moved into your pocket." A real phone in real hands.
const Pocket: React.FC<{f: number}> = ({f}) => <Footage src="clips/4915.mp4" from={1} f={f} len={60} pos="50% 55%" />;

// OFF by default (owner: faking it over real screenshots looks fake; use real filmed-screen footage instead).
// A screen filmed with a phone, like the reference's screen shots: a macro close-up, fine scanlines,
// drifting ring moiré, lifted soft image, cool cast, dark falloff and a slight handheld tilt.
const Filmed: React.FC<{f: number; children: React.ReactNode; strength?: number}> = ({f, children, strength = 1}) => {
  const t = f / FPS;
  const cx = 120 + 18 * Math.sin(t * 0.7), cy = -30 + 14 * Math.cos(t * 0.5);
  return (
    <AbsoluteFill style={{background: '#0a0a0c', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `perspective(2200px) rotateY(${-2.5 + 1.2 * Math.sin(t * 0.4)}deg) rotateX(${1.5 + 0.6 * Math.cos(t * 0.3)}deg) translate(${4 * Math.sin(t * 1.3)}px, ${3 * Math.cos(t * 1.1)}px)`, filter: `contrast(${1 - 0.14 * strength}) brightness(${1 - 0.06 * strength}) saturate(${1 - 0.18 * strength}) blur(${0.7 * strength}px)`}}>
        {children}
        <AbsoluteFill style={{background: `repeating-radial-gradient(circle at ${cx}% ${cy}%, rgba(40,40,60,0) 0px, rgba(40,40,60,${0.14 * strength}) 12px, rgba(40,40,60,0) 26px)`, mixBlendMode: 'multiply'}} />
        <AbsoluteFill style={{background: `repeating-linear-gradient(to bottom, rgba(0,0,0,${0.13 * strength}) 0px, rgba(0,0,0,${0.13 * strength}) 1px, transparent 1px, transparent 3px)`}} />
        <AbsoluteFill style={{background: 'rgba(190,205,230,0.10)', mixBlendMode: 'multiply'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(130% 115% at 50% 50%, transparent 52%, rgba(0,0,0,${0.62 * strength}) 100%)`}} />
    </AbsoluteFill>
  );
};

// Real Apple screens, filmed close up, pushed in slowly.
const Stage: React.FC<{f: number; len: number; origin?: string; children: React.ReactNode; bg?: string; zoom?: number; filmed?: boolean}> = ({f, len, origin = '50% 50%', children, bg = '#ffffff', zoom = 1, filmed = false}) => {
  const inner = (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: origin, transform: `scale(${zoom * (1 + 0.08 * prog(f, 0, len, inOut))})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
  return filmed ? <Filmed f={f}>{inner}</Filmed> : inner;
};

// A real capture (public/rec/, recorded on the owner's Mac, docs/capture-note.md), cropped to a 16:9 window
// [x, y, w, h in source pixels] and pushed in slowly.
const Rec: React.FC<{src: string; f: number; from?: number; sw: number; sh: number; crop: [number, number, number, number]; push?: number; origin?: string; bg?: string; marks?: {x0: number; x1: number; y0: number; y1: number; on: number}[]}> = ({src, f, from = 0, sw, sh, crop, push = 0.05, origin = '50% 40%', bg = '#ffffff', marks = []}) => {
  const [cx, cy, cw, ch] = crop;
  const k = 1920 / cw, z = 1 + push * prog(f, 0, 90, inOut);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: origin}}>
        <div style={{position: 'absolute', left: -cx * k, top: -cy * k + (1080 - ch * k) / 2, width: sw * k, height: sh * k}}>
          <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(from * FPS)} style={{width: '100%', height: '100%'}} />
          {/* highlighter marks over real words, in source pixels; multiply keeps the real text crisp underneath */}
          {marks.map((m, i) => <div key={i} style={{position: 'absolute', left: (m.x0 - 3) * k, top: m.y0 * k, width: (m.x1 - m.x0 + 6) * k * m.on, height: (m.y1 - m.y0) * k, background: '#fde293', mixBlendMode: 'multiply', borderRadius: 2}} />)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// "Then reminders." The real iPhone Reminders list; the "Supplier form" reminder drops in from the top.
const Remind: React.FC<{f: number}> = ({f}) => <Rec src="rec/ios-reminders-alert.mov" f={f} from={0.9} sw={1206} sh={2622} crop={[0, 0, 1206, 678]} />;

// "Syncing." The same Friday list in the Mac's Reminders app, a new item arriving.
const Sync: React.FC<{f: number}> = ({f}) => <Rec src="rec/reminders-sync.mov" f={f} from={1.0} sw={1920} sh={1080} crop={[300, 90, 440, 248]} />;

// "Sharing." A real shared list, scrolled slowly.
const Share: React.FC<{f: number}> = ({f}) => <Rec src="rec/ios-reminders-shared.mov" f={f} from={0.5} sw={1206} sh={2622} crop={[0, 0, 1206, 678]} />;

// "To nag." The real Reminders icon, its badge climbing to 99; the icon jolts on every jump.
const Nag: React.FC<{f: number}> = ({f}) => {
  const n = Math.min(99, Math.floor(12 + Math.pow(f / 50, 1.6) * 87));
  const k = Math.exp(-((f % 4) / 1.5));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Center>
        <div style={{position: 'relative', width: 340, height: 340, transform: `translate(${(random(`n${f}`) - 0.5) * 14 * k}px, ${(random(`m${f}`) - 0.5) * 10 * k}px) scale(${1 + 0.08 * prog(f, 0, 60)})`}}>
          <Img src={staticFile('apple/reminders-icon.png')} style={{width: 340, height: 340}} />
          <Badge n={n} size={340} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// "Each version got better at keeping score." Real Reminders icons snow down and pile up.
const Snow: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: 'linear-gradient(#2f7fe0, #8cc4f5)', overflow: 'hidden'}}>
    {Array.from({length: 80}).map((_, i) => {
      const start = random(`s${i}`) * 90;
      const t = Math.max(0, f - start);
      const x = random(`x${i}`) * 1980 - 30;
      const rest = 1080 - 70 - random(`r${i}`) * (40 + 200 * Math.min(1, f / 120));
      const y = Math.min(rest, -140 + t * t * 0.35 + t * 8);
      const rot = (random(`o${i}`) - 0.5) * 60 + (y < rest ? Math.sin(t / 6 + i) * 18 : 0);
      return <Img key={i} src={staticFile('apple/reminders-icon.png')} style={{position: 'absolute', left: x, top: y, width: 120, height: 120, transform: `rotate(${rot}deg)`}} />;
    })}
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: prog(f, 10, 24), zIndex: 2}}><span style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 64, color: '#fff', background: '#1d5fc4', borderRadius: 18, padding: '8px 30px'}}>better at keeping score.</span></div>
  </AbsoluteFill>
);

// "None of them ever lifted a finger." A real clip from Office Etiquette (Encyclopaedia Britannica Films, 1950, Prelinger Archives):
// a secretary powders her nose while the papers on her desk wait. Framed small on black, the way the reference frames its office clip here.
const Archive: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 880, height: 660, overflow: 'hidden', transform: `scale(${1.0 + 0.04 * prog(f, 0, 120, (t) => t)})`}}>
      <OffthreadVideo src={staticFile('archive/office-etiquette-powder.mp4')} muted style={{width: 880, height: 660, objectFit: 'cover'}} />
    </div>
  </AbsoluteFill>
);

// "Your day hands you work all day." Real iOS notifications land one on top of the other.
const CARDS = [{src: 'apple/notif-2.png', h: 148}, {src: 'apple/notif-1.png', h: 171}, {src: 'apple/notif-0.png', h: 120}];
const Notif: React.FC<{f: number}> = ({f}) => {
  const K = 1.75;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 0% 50%, #4b1f8f 0%, #170b2e 55%, #08060f 100%)', overflow: 'hidden'}}>
      {CARDS.map((c, i) => {
        const at = 4 + i * 16;
        if (f < at) return null;
        const s = springAt(f, at, {damping: 18, stiffness: 200, mass: 0.7});
        // Each new card lands on top and pushes the older ones down.
        const above = CARDS.slice(i + 1).reduce((acc, d, j) => acc + Math.min(1, springAt(f, 4 + (i + 1 + j) * 16, {damping: 18, stiffness: 200, mass: 0.7})) * (d.h * K + 22), 0);
        return <Img key={c.src} src={staticFile(c.src)} style={{position: 'absolute', right: 150, top: 150 + above, width: 548 * K, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * -60}px) scale(${0.96 + 0.04 * Math.min(1, s)})`}} />;
      })}
    </AbsoluteFill>
  );
};

// "It knows what you promised. It has everything it needs." The email, read close up; each task is highlighted.
// Stand-in for a real Gmail capture (docs/shot-list-iphone-gmail.md): Gmail's reading view, its type and colours.
const ASK = [
  {t: 'Hi! Before Friday could you ', h: 0}, {t: 'book dinner for the team', h: 1}, {t: ', ', h: 0}, {t: 'fill in the supplier form', h: 2},
  {t: ' and ', h: 0}, {t: 'reply to Sam about the venue', h: 3}, {t: '? ', h: 0}, {t: 'Everything you need is in this thread.', h: 4},
];
const MailHead: React.FC<{ago: string}> = ({ago}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 34}}>
      <div style={{fontFamily: GMAIL, fontWeight: 400, fontSize: 52, color: '#1f1f1f'}}>Friday plans</div>
      <div style={{fontFamily: GMAIL, fontWeight: 500, fontSize: 24, color: '#444746', background: '#e9eef6', borderRadius: 8, padding: '4px 14px'}}>Inbox</div>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{width: 80, height: 80, borderRadius: 40, background: '#e8710a', color: '#fff', fontFamily: GMAIL, fontWeight: 500, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>D</div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: GMAIL, fontSize: 34, color: '#1f1f1f'}}><b style={{fontWeight: 600}}>Dana Haddad</b> <span style={{color: '#5e5e5e', fontSize: 28}}>&lt;dana@northwind.co&gt;</span></div>
        <div style={{fontFamily: GMAIL, fontSize: 28, color: '#5e5e5e'}}>to me</div>
      </div>
      <div style={{fontFamily: GMAIL, fontSize: 28, color: '#5e5e5e'}}>{ago}</div>
    </div>
  </>
);
// "The asks are in your messages. The details are right there." Gmail's reading view, rebuilt large and sharp in its own
// layout and Roboto (the owner preferred this to the Mac capture); each ask is highlighted on its spoken word.
const Message: React.FC<{f: number}> = ({f}) => {
  const base = S.message[0];
  // each highlight lands on its spoken word, like the reference's: "asks", "your", "messages", then "details"
  const hl = [0, wordAt(19, 'asks') - base - 2, wordAt(19, 'your') - base - 2, wordAt(19, 'messages') - base - 2, wordAt(20, 'details') - base - 2];
  return (
    <AbsoluteFill style={{background: '#f8fafd', overflow: 'hidden', perspective: 2400}}>
      <AbsoluteFill style={{transformOrigin: '22% 52%', transform: `rotateY(${6 - 4 * prog(f, 0, 120, inOut)}deg) rotateX(3deg) scale(${1.55 - 0.1 * prog(f, 0, 120, inOut)}) translateX(${-40 * prog(f, 0, 120, inOut)}px)`}}>
        <div style={{position: 'absolute', left: 170, top: 120, width: 1580, height: 980, padding: '56px 70px', boxSizing: 'border-box', background: '#fff', borderRadius: 28}}>
          <MailHead ago="9:02 AM (0 minutes ago)" />
          <div style={{fontFamily: GMAIL, fontWeight: 400, fontSize: 54, lineHeight: 1.55, color: '#1f1f1f', marginTop: 46, marginLeft: 102}}>
            {ASK.map((p, i) => {
              const on = p.h ? prog(f, hl[p.h], hl[p.h] + 8) : 0;
              return <span key={i} style={{backgroundImage: 'linear-gradient(#fde293, #fde293)', backgroundRepeat: 'no-repeat', backgroundSize: `${on * 100}% 100%`, padding: p.h ? '0 4px' : 0}}>{p.t}</span>;
            })}
            <div style={{marginTop: 30}}>Thanks!<br />Dana</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const GmailReply: React.FC<{f: number}> = ({f}) => {
  const click = 26, press = prog(f, click - 3, click) * (1 - prog(f, click + 1, click + 6));
  const mv = springAt(f, 2, {damping: 22, stiffness: 90, mass: 1});
  const open = springAt(f, click + 1, {damping: 20, stiffness: 160, mass: 0.8});
  const cx = 1500 + (422 - 1500) * mv, cy = 980 + (640 - 980) * mv;
  const caret = f > click + 8 && Math.floor((f - click) / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{background: '#f8fafd', overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: '25% 70%', transform: `scale(${1.12 + 0.05 * prog(f, 0, 66, inOut)})`}}>
        <div style={{position: 'absolute', left: 170, top: 60, width: 1580, height: 1100, padding: '56px 70px', boxSizing: 'border-box', background: '#fff', borderRadius: 28}}>
          <MailHead ago="9:02 AM (3 days ago)" />
          <div style={{fontFamily: GMAIL, fontWeight: 400, fontSize: 40, lineHeight: 1.5, color: '#1f1f1f', marginTop: 34, marginLeft: 102}}>
            {ASK.map((p) => p.t).join('')}<div style={{marginTop: 18}}>Thanks!<br />Dana</div>
          </div>
          {open < 0.02 ? (
            <div style={{display: 'flex', gap: 22, marginTop: 44, marginLeft: 102}}>
              {['Reply', 'Forward'].map((b, i) => (
                <div key={b} style={{fontFamily: GMAIL, fontWeight: 500, fontSize: 30, color: '#444746', border: '2px solid #747775', borderRadius: 40, padding: '14px 34px', background: i === 0 && f > 14 ? `rgba(68,71,70,${0.08 + 0.1 * press})` : '#fff', transform: i === 0 ? `scale(${1 - 0.03 * press})` : 'none'}}>{i === 0 ? '↩  ' : '↪  '}{b}</div>
              ))}
            </div>
          ) : (
            <div style={{marginTop: 40, marginLeft: 102, marginRight: 20, border: '1px solid #dadce0', borderRadius: 18, boxShadow: '0 2px 10px rgba(60,64,67,0.18)', padding: '26px 34px', opacity: Math.min(1, open * 1.4), transform: `translateY(${(1 - open) * 20}px)`}}>
              <div style={{fontFamily: GMAIL, fontSize: 28, color: '#444746'}}>↩ ▾  Dana Haddad</div>
              <div style={{height: 170, marginTop: 20, position: 'relative'}}>
                {caret && <div style={{position: 'absolute', left: 0, top: 4, width: 3, height: 40, background: '#1f1f1f'}} />}
              </div>
              <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: GMAIL, fontWeight: 500, fontSize: 28, color: '#fff', background: '#0b57d0', borderRadius: 40, padding: '14px 36px'}}>Send</div>
            </div>
          )}
        </div>
      </AbsoluteFill>
      {f < click + 18 && <Cursor x={cx} y={cy} press={press} fill={C.ink} scale={1.4} />}
    </AbsoluteFill>
  );
};

// "And it waits for you anyway." Gmail's own nudge, from Google's Gmail page: the inbox, then "Received 3 days ago. Reply?" close up.
const Wait: React.FC<{f: number}> = ({f}) => {
  const cut = 66;
  return f < cut ? (
    // the same email: the cursor clicks Reply, the empty reply box opens and its caret blinks, and nothing gets written
    <GmailReply f={f} />
  ) : (
    <Stage f={f - cut} len={150 - cut} origin="48% 38%" bg="#f6f8fc" zoom={1.25}>
      <Img src={staticFile('google/gmail-nudge.png')} style={{position: 'absolute', left: 960 - 739, top: 540 - 415, width: 1478}} />
    </Stage>
  );
};

// "Until now." Small type on black; the "o" grows into the Headmaster mark, which lights up.
const Until: React.FC<{f: number}> = ({f}) => {
  const typeAt = voAt(22) - S.until[0];
  const shown = 'Not anymore.'.slice(0, Math.max(0, Math.floor((f - typeAt) / 1.6)));
  const go = 50;
  const m = springAt(f, go, {damping: 14, stiffness: 90, mass: 1.1});
  const fade = prog(f, go - 6, go + 4);
  const bloom = prog(f, 82, 92) * (1 - prog(f, 96, 105));
  const ring = 34 + (290 - 34) * Math.min(1, m);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Center><div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 64, color: '#fff', opacity: 1 - fade, whiteSpace: 'pre'}}>{shown}{f >= typeAt && f < go && Math.floor(f / 10) % 2 === 0 ? '|' : ' '}</div></Center>
      {f >= go - 6 && (
        <Center>
          <div style={{position: 'relative', width: 600, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{position: 'absolute', width: ring, height: ring, borderRadius: '50%', border: `${Math.max(4, 10 * (1 - m))}px solid #fff`, opacity: 1 - prog(f, go + 14, go + 26)}} />
            <Img src={staticFile('headmaster-mark-ink.svg')} style={{height: 300, filter: 'invert(1)', opacity: prog(f, go + 10, go + 24), transform: `scale(${0.95 + 0.05 * Math.min(1, m)}) rotate(${(1 - Math.min(1, m)) * -40}deg)`}} />
          </div>
        </Center>
      )}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #fff 0%, #c9c9f5 30%, rgba(0,0,218,0.35) 55%, transparent 75%)', opacity: bloom, transform: `scale(${0.6 + 1.2 * bloom})`}} />
      <AbsoluteFill style={{background: C.ground, opacity: prog(f, 92, 105)}} />
    </AbsoluteFill>
  );
};

// "This is the first to-do list that does itself. Headmaster." The app window opens; the name types in on the word.
// A real recording of our app with one gentle camera move (sine in-out), keys [t, focusX, focusY, zoom] in clip pixels.
const RealShot: React.FC<{src: string; f: number; skip?: number; cam: [number, number, number, number][]}> = ({src, f, skip = 0, cam}) => {
  const t = f / 30;
  let k = 0;
  while (k < cam.length - 2 && t > cam[k + 1][0]) k++;
  const [t0, x0, y0, z0] = cam[k], [t1, x1, y1, z1] = cam[Math.min(k + 1, cam.length - 1)];
  const u = t1 > t0 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 1, e = 0.5 - 0.5 * Math.cos(Math.PI * u);
  const cx = x0 + (x1 - x0) * e, cy = y0 + (y1 - y0) * e, z = z0 + (z1 - z0) * e;
  const tx = Math.min(0, Math.max(1920 - 1920 * z, 960 - cx * z)), ty = Math.min(0, Math.max(1080 - 1080 * z, 540 - cy * z));
  return (
    <AbsoluteFill style={{background: '#FAFAFC', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${z})`}}>
        <OffthreadVideo src={staticFile(src)} muted startFrom={skip} style={{width: 1920, height: 1080}} />
      </div>
    </AbsoluteFill>
  );
};
// Camera keys for the chat turn, [clip seconds, focusX, focusY, zoom] in 1920x1080 clip pixels.
const TURN_CAM: [number, number, number, number][] = [
  // gentle: never past 1.3x (sharp, and just enough to keep the mock's half-hidden sidebar out of frame), one steady hold
  // through the steps, the approval and the answer, then a pull back to the whole app on "fifty years"
  [0, 960, 540, 1.0], [4.0, 1150, 840, 1.22], [5.6, 1480, 600, 1.3], [7.0, 1480, 430, 1.3], [13.0, 1480, 450, 1.3],
  [14.6, 1480, 520, 1.3], [19.6, 1480, 540, 1.3], [25.7, 1480, 560, 1.3], [28.5, 960, 540, 1.0], [31.7, 960, 540, 1.0],
];
const App: React.FC<{f: number}> = ({f}) => {
  const nameAt = wordAt(23, 'Headmaster') - S.app[0];
  const name = 'Headmaster'.slice(0, Math.max(0, Math.floor((f - nameAt) / 1.5)));
  const slide = prog(f, nameAt - 4, nameAt + 10);
  const REAL = 40; // after the name reveal: the real app (our mock UI, recorded), see docs/app-showcase.md
  // One real chat turn, continuous and in real time (public/app/turn.mp4, docs/app-showcase.md): the ask is typed and sent on
  // "It gets to work.", each step checks on its line, it waits on "Send the reply to Sam" and Allow is clicked after "make the call".
  if (f >= REAL) return <Sequence from={REAL} layout="none"><RealShot src="app/turn.mp4" f={f - REAL} cam={TURN_CAM} /></Sequence>;
  const home = f >= 120;
  const hs = springAt(f, 120);
  const open = springAt(f, 0, {damping: 18, stiffness: 120, mass: 1});
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <div style={{position: 'absolute', left: 210, top: 110, width: 1500, height: 860, borderRadius: 28, background: C.white, boxShadow: '0 40px 100px rgba(40,40,120,0.18)', overflow: 'hidden', opacity: Math.min(1, open * 1.5), transform: `scale(${0.95 + 0.05 * Math.min(1, open)})`}}>
        <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px', borderBottom: `2px solid ${C.line}`}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c}} />)}
        </div>
        {!home ? (
          <div style={{position: 'absolute', inset: '64px 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 46 * slide}}>
            <Img src={staticFile('headmaster-mark-ink.svg')} style={{height: 260}} />
            <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 170, letterSpacing: '-0.035em', color: C.ink, maxWidth: slide * 1100, overflow: 'hidden', whiteSpace: 'nowrap'}}>{name}</div>
          </div>
        ) : (
          <div style={{position: 'absolute', inset: '64px 0 0 0', display: 'flex', opacity: Math.min(1, hs * 1.6), transform: `translateY(${(1 - hs) * 30}px)`}}>
            <div style={{width: 320, background: C.field, borderRight: `2px solid ${C.line}`, padding: 34, display: 'flex', alignItems: 'center', gap: 16, alignSelf: 'stretch', flexDirection: 'column'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start'}}><Img src={staticFile('headmaster-mark-ink.svg')} style={{height: 46}} /><span style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.ink}}>Headmaster</span></div>
            </div>
            <div style={{flex: 1, padding: '60px 80px'}}>
              <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 84, color: C.ink, letterSpacing: '-0.03em'}}>Good morning.</div>
              <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 36, color: C.muted, marginTop: 8}}>Your agent is on 3 things for you.</div>
              {['Book dinner for the team', 'Fill in the supplier form', 'Reply to Sam about the venue'].map((r, i) => (
                <div key={r} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '26px 0', borderBottom: `2px solid ${C.line}`, opacity: prog(f, 122 + i * 3, 128 + i * 3)}}>
                  <AgentAvatar size={52} id={`h${i}`} status="working" bg={C.ground} />
                  <div style={{flex: 1, fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.ink}}>{r}</div>
                  <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 28, color: C.blue, background: C.ground, borderRadius: 14, padding: '8px 18px'}}>Working</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// "Tell your agent what you need." The ask goes out on WhatsApp.
const MSG = 'Book dinner for the team Friday, fill in the supplier form and reply to Sam about the venue.';
// "Ask for what you need. It gets to work." Our ask typed into the real app and sent; it starts working.
const Ask: React.FC<{f: number}> = ({f}) => <RealShot src="app/ask-2.mp4" f={f} cam={[[0, 900, 560, 1.06], [4, 860, 600, 1.16]]} />;

// "The booking. Found. The form. Filled. The reply. Drafted. All of it ready. None of it sent."
// One result at a time inside a soft lavender aura; then the two lines alone.
const Aura: React.FC<{f: number; pulse?: number}> = ({f, pulse = 0}) => {
  const a = f * 0.6;
  return (
    <AbsoluteFill style={{background: C.white, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - 560, top: 540 - 560, width: 1120, height: 1120, borderRadius: '50%', background: `conic-gradient(from ${a}deg, #b9b9ff, #9fd8ff, #f3c4ff, #c9c9f5, #b9b9ff)`, filter: 'blur(70px)', opacity: 0.85, transform: `scale(${1 + 0.04 * Math.sin(f / 20) + 0.08 * pulse})`}} />
      <div style={{position: 'absolute', left: 960 - 420, top: 540 - 420, width: 840, height: 840, borderRadius: '50%', background: C.white, filter: 'blur(40px)'}} />
    </AbsoluteFill>
  );
};
const RES = [
  {k: 'The booking,', v: 'ready.', title: 'Team dinner', rows: ['Friday · 7:30 pm · table for 8', 'Olive House, near the office', 'Held until 6 pm today']},
  {k: 'The research,', v: 'done.', title: 'Venues for Friday', rows: ['3 venues fit 40 people', 'All free Friday evening', 'Menus and prices compared']},
  {k: 'The reply to Sam,', v: 'drafted.', title: 'Reply to Sam', rows: ['"Hi Sam! Three venues that fit 40:', 'the Loft, Harbour Room, Studio 9.', 'All free Friday. Pick one?"']},
];
const Results: React.FC<{f: number}> = ({f}) => {
  const base = S.results[0];
  const at = [voAt(26) - base, voAt(28) - base, voAt(30) - base];
  const ready = voAt(32) - base, none = voAt(33) - base;
  const i = f >= at[2] ? 2 : f >= at[1] ? 1 : 0;
  const r = RES[i];
  const s = springAt(f, at[i] - 4);
  const stamp = springAt(f, at[i] + 30, {damping: 11, stiffness: 260, mass: 0.6});
  return (
    <AbsoluteFill>
      <Aura f={f} pulse={f >= ready ? prog(f, ready, ready + 10) : 0} />
      {f < ready - 4 ? (
        <Center>
          <div style={{width: 900, background: C.white, borderRadius: 30, border: `2px solid ${C.line}`, boxShadow: '0 30px 80px rgba(60,60,160,0.16)', padding: '34px 40px', opacity: Math.min(1, s * 1.6) * (1 - prog(f, ready - 10, ready - 4)), transform: `translateY(${(1 - s) * 40}px) scale(${0.95 + 0.05 * Math.min(1, s)})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <AgentAvatar size={56} id={`r${i}`} bg={C.ground} status={f >= at[i] + 30 ? 'complete' : 'working'} />
              <div style={{flex: 1, fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.ink}}>{r.title}</div>
              <div style={{opacity: Math.min(1, stamp * 2), transform: `scale(${0.95 + 0.05 * Math.min(1.2, stamp)})`}}><Check size={52} bg={C.blue} /></div>
            </div>
            {r.rows.map((row, j) => <div key={j} style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 32, color: C.ink2, marginTop: 18, opacity: prog(f, at[i] + 2 + j * 4, at[i] + 10 + j * 4)}}>{row}</div>)}
            <div style={{marginTop: 34, display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: FONT.display, fontWeight: 800, fontSize: 68, letterSpacing: '-0.03em', color: C.ink, whiteSpace: 'nowrap'}}>
              <span>{r.k}</span><span style={{color: C.blue, opacity: Math.min(1, stamp * 2), display: 'inline-block', transform: `translateY(${(1 - Math.min(1, stamp)) * 20}px)`}}>{r.v}</span>
            </div>
          </div>
        </Center>
      ) : (
        <Center>
          <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 110, letterSpacing: '-0.035em', color: C.ink, opacity: prog(f, f < none ? ready : none, (f < none ? ready : none) + 8), filter: `blur(${(1 - prog(f, f < none ? ready : none, (f < none ? ready : none) + 8)) * 8}px)`}}>
            {f < none ? 'Everything prepared.' : <>Nothing goes <span style={{color: C.blue}}>out</span></>}
          </div>
        </Center>
      )}
    </AbsoluteFill>
  );
};

// "...until you make the call." The draft waits; your click sends it.
const Approve: React.FC<{f: number}> = ({f}) => {
  const tap = 70;
  const mv = springAt(f, 20, {damping: 20, stiffness: 120, mass: 1});
  const cx = 1700 + (1250 - 1700) * mv, cy = 1000 + (676 - 1000) * mv; // the tip lands on Approve (button centre 1262, 683)
  const press = prog(f, tap - 4, tap) * (1 - prog(f, tap + 2, tap + 8));
  const sent = f >= tap + 2;
  const ok = springAt(f, tap + 2, {damping: 12, stiffness: 240, mass: 0.6});
  return (
    <AbsoluteFill>
      <Aura f={f + 285} />
      <Title f={f} a="Until you" b="make the call." at={4} x={600} y={110} size={92} />
      <AbsoluteFill style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: 900, background: C.white, borderRadius: 30, border: `2px solid ${C.line}`, boxShadow: '0 30px 80px rgba(60,60,160,0.16)', padding: '36px 44px', marginTop: 80}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <AgentAvatar size={56} id="ap" bg={C.ground} status={sent ? 'complete' : 'needs-input'} />
            <div style={{flex: 1, fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.ink}}>Reply to Sam</div>
            <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 28, color: C.muted}}>{sent ? 'Sent 09:41' : 'Ready'}</div>
          </div>
          <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 34, color: C.ink2, lineHeight: 1.45, marginTop: 22}}>Hi Sam! Three venues that fit 40: the Loft, Harbour Room, Studio 9. All free Friday. Pick one?</div>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: 20, marginTop: 30}}>
            <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.ink, border: `2px solid ${C.line}`, borderRadius: 16, padding: '16px 30px'}}>Edit</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: '#fff', background: C.blue, borderRadius: 16, padding: '16px 38px', transform: `scale(${1 - 0.05 * press})`}}>
              {sent ? <><span style={{display: 'inline-block', transform: `scale(${0.95 + 0.05 * Math.min(1, ok)})`}}><Check size={34} bg="#fff" color={C.blue} /></span>Sent</> : 'Approve'}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {f >= 20 && <Cursor x={cx} y={cy} press={press} fill={C.ink} scale={1.4} />}
    </AbsoluteFill>
  );
};

// "Everything we make finds its next form." A museum room built with CSS 3D: plinths, a slow dolly, our icon last.
const EXHIBITS: {x: number; z: number; src?: string; icon?: boolean; w: number; h: number}[] = [
  {x: -1500, z: -400, src: 'arch/lamp.jpg', w: 260, h: 300}, {x: -950, z: -700, src: 'v2/oldmap_1.jpg', w: 300, h: 230},
  {x: -400, z: -300, src: 'arch/dinar.jpg', w: 240, h: 240}, {x: 150, z: -650, src: 'v2/pc1981_1.jpg', w: 320, h: 250},
  {x: 700, z: -350, src: 'v2/cassette_4.jpg', w: 280, h: 200}, {x: 1300, z: -600, src: 'v2/sticky_2.jpg', w: 280, h: 230},
  {x: 1900, z: -450, icon: true, w: 260, h: 260},
];
const Plinth: React.FC<{x: number; z: number; children: React.ReactNode; lit?: number}> = ({x, z, children, lit = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `translate3d(${x}px, 0px, ${z}px)`}}>
    <div style={{position: 'absolute', left: -150, top: -360, width: 300, height: 360, background: `linear-gradient(#fbfbfa, #e7e6e2)`}} />
    <div style={{position: 'absolute', left: -150, top: -510, width: 300, height: 300, transformOrigin: '50% 100%', transform: 'translateY(0) rotateX(90deg)', background: '#f6f5f2'}} />
    <div style={{position: 'absolute', left: 150, top: -360, width: 300, height: 360, transformOrigin: '0 50%', transform: 'rotateY(90deg)', background: '#d8d7d2'}} />
    <div style={{position: 'absolute', left: -170, top: -760, width: 340, height: 390, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', filter: `drop-shadow(0 ${20 + 30 * lit}px ${40 + 40 * lit}px rgba(0,0,0,${0.25 + 0.15 * lit}))`}}>{children}</div>
  </div>
);
const Gallery: React.FC<{f: number}> = ({f}) => {
  const t = prog(f, 0, 270, inOut);
  const camX = -1400 + 3300 * t;
  const camZ = 900 - 700 * prog(f, 150, 280, inOut);
  const yaw = -10 + 18 * t;
  const lit = prog(f, 200, 240);
  return (
    <AbsoluteFill style={{background: '#d9d8d4', overflow: 'hidden', perspective: 1300, perspectiveOrigin: '50% 40%'}}>
      <div style={{position: 'absolute', left: 960, top: 760, transformStyle: 'preserve-3d', transform: `rotateY(${yaw}deg) translate3d(${-camX}px, 0px, ${camZ}px)`}}>
        <div style={{position: 'absolute', left: -4000, top: -1700, width: 8000, height: 1700, transform: 'translateZ(-1100px)', background: 'linear-gradient(#e8e7e3, #dedcd7)'}} />
        <div style={{position: 'absolute', left: -4000, top: 0, width: 8000, height: 4000, transformOrigin: '50% 0%', transform: 'translateZ(-1100px) rotateX(90deg)', background: 'linear-gradient(#a9a8a4, #c4c3be)'}} />
        <div style={{position: 'absolute', left: -4000, top: -1700, width: 8000, height: 4000, transformOrigin: '50% 0%', transform: 'translateZ(-1100px) rotateX(90deg) translateZ(1700px)', background: '#efeeea'}} />
        {EXHIBITS.map((e, i) => (
          <Plinth key={i} x={e.x} z={e.z} lit={e.icon ? lit : 0}>
            {e.icon
              ? <Img src={staticFile('headmaster-icon-dark.svg')} style={{width: e.w, height: e.h, borderRadius: 60, transform: `scale(${0.95 + 0.05 * lit})`}} />
              : <Img src={staticFile(e.src!)} style={{width: e.w, height: e.h, objectFit: 'cover', border: '10px solid #fff', boxSizing: 'border-box'}} />}
          </Plinth>
        ))}
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(70% 60% at 50% 30%, rgba(255,255,255,0.35), transparent 70%)'}} />
    </AbsoluteFill>
  );
};

// App showcase (replaces the 3D museum, owner: it read as AI): ONE real chat turn in our app's mock UI (feedback.gcaplabs.com,
// recorded at 2x with the cursor's name label hidden, see docs/app-showcase.md). You send the ask, it works through the steps,
// it asks before booking and you click Allow, then it answers. Four cuts on the half-second grid, one gentle camera move each.
const TURN: {src: string; len: number; cam: [number, number, number, number][]}[] = [
  {src: 'app/turn-1.mp4', len: 75, cam: [[0, 760, 640, 1.18], [2.5, 820, 600, 1.3]]},
  {src: 'app/turn-2.mp4', len: 75, cam: [[0, 700, 260, 1.16], [2.5, 740, 320, 1.26]]},
  {src: 'app/turn-3.mp4', len: 60, cam: [[0, 560, 700, 1.24], [2, 520, 760, 1.34]]},
  {src: 'app/turn-4.mp4', len: 90, cam: [[0, 860, 560, 1.12], [3, 860, 640, 1.2]]},
];
// One continuous move per shot, sine in-out, so the camera never stops and restarts inside a shot.
const camAt = (keys: [number, number, number, number][], t: number) => {
  const [t0, x0, y0, z0] = keys[0], [t1, x1, y1, z1] = keys[keys.length - 1];
  const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))), e = 0.5 - 0.5 * Math.cos(Math.PI * u);
  return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e, z0 + (z1 - z0) * e];
};
const Museum: React.FC<{f: number}> = ({f}) => {
  let i = 0, start = 0;
  while (i < TURN.length - 1 && f >= start + TURN[i].len) { start += TURN[i].len; i++; }
  const lf = f - start, [cx, cy, z] = camAt(TURN[i].cam, lf / 30);
  const tx = Math.min(0, Math.max(1920 - 1920 * z, 960 - cx * z)), ty = Math.min(0, Math.max(1080 - 1080 * z, 540 - cy * z));
  return (
    <AbsoluteFill style={{background: '#FAFAFC', overflow: 'hidden'}}>
      <Sequence from={start} durationInFrames={TURN[i].len} layout="none">
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${z})`}}>
          <OffthreadVideo src={staticFile(TURN[i].src)} muted style={{width: 1920, height: 1080}} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// A brand mark from an SVG, tinted with a CSS mask so it takes our colour.
const Mark: React.FC<{src: string; size: number; color: string}> = ({src, size, color}) => (
  <div style={{width: size, height: size, background: color, WebkitMaskImage: `url(${staticFile(src)})`, maskImage: `url(${staticFile(src)})`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center'}} />
);
// End card, white: the icon lands, what it is and the address either side.
const End: React.FC<{f: number}> = ({f}) => {
  // Each part lands on Sara's line (vo-sara-end-a.mp3 at 95.4 s): Headmaster 95.4, Your own AI agent 96.6, Out now 98.7, Coming soon 100.7.
  const land = springAt(f, 4, {damping: 14, stiffness: 120, mass: 1.1});
  const side = prog(f, 10, 24);
  const tag = prog(f, 46, 60);
  const now = prog(f, 109, 122), soon = prog(f, 169, 182);
  return (
    <AbsoluteFill style={{background: C.white}}>
      <Center>
        <div style={{display: 'flex', alignItems: 'center', gap: 110}}>
          {/* Where it runs (the slot that used to read "Free in beta"): real marks from simple-icons, tinted to our ink. */}
          <div style={{width: 560, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: C.ink, opacity: now, transform: `translateX(${(1 - now) * 30}px)`}}>
              <span>Out now on</span><Mark src="brand/logos/windows.svg" size={34} color={C.ink} /><Mark src="brand/logos/apple.svg" size={40} color={C.ink} />
            </div>
            <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: C.ink, opacity: now, transform: `translateX(${(1 - now) * 30}px)`}}>Windows and Mac</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.body, fontWeight: 500, fontSize: 30, color: C.muted, marginTop: 6, opacity: soon, transform: `translateX(${(1 - soon) * 30}px)`}}>
              <span>Coming soon on</span><Mark src="brand/logos/appstore.svg" size={30} color={C.muted} /><span>iOS</span>
            </div>
          </div>
          <Img src={staticFile('headmaster-icon-dark.svg')} style={{width: 240, height: 240, borderRadius: 54, opacity: Math.min(1, land * 1.5), transform: `translateY(${(1 - land) * 40}px) scale(${0.95 + 0.05 * Math.min(1, land)})`}} />
          <div style={{width: 560, fontFamily: FONT.body, fontWeight: 700, fontSize: 52, color: C.blue, opacity: side, transform: `translateX(${(1 - side) * -30}px)`}}>headmaster.app</div>
        </div>
      </Center>
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 44, color: C.ink2, opacity: tag, transform: `translateY(${(1 - tag) * 14}px)`}}>Your own AI agent.</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', fontFamily: FONT.body, fontWeight: 500, fontSize: 22, color: C.muted, opacity: side}}>Not affiliated with any brand shown.</div>
    </AbsoluteFill>
  );
};

// Subtitles for the narrated lines a scene does not already spell out. Dark scenes get light type and vice versa.
// Captions: small Figtree, no background; near-white on dark scenes, ink on light ones so they never read as part of the app's UI. Like the
// reference, each word appears as it is spoken (word times from src/vo-words.json).
const LIGHT = new Set(['remind', 'sync', 'share', 'message', 'wait', 'app', 'end']);
const CAP = (TL.vo as [number, number, number, string | null][]).map(([a, b, t]) => W.slice(a, b + 1).map((w) => Math.round((t + w[0] - W[a][0]) * FPS)));
const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  const i = VO.findIndex((v, k) => v.sub && f >= v.at && f < Math.min(v.at + v.len + 12, k + 1 < VO.length ? VO[k + 1].at : 1e9));
  if (i < 0) return null;
  const v = VO[i];
  const scene = Object.entries(S).find(([, [a, b]]) => f >= a && f < b)?.[0] ?? '';
  const light = LIGHT.has(scene);
  const words = (v.sub as string).split(' '), times = CAP[i];
  const spoken = times.filter((t) => f >= t).length;
  const n = Math.max(1, Math.round((spoken / times.length) * words.length));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 32, letterSpacing: '0.005em', color: light ? 'rgba(17,17,21,0.88)' : 'rgba(255,255,255,0.94)', textShadow: light ? '0 0 12px rgba(255,255,255,0.9)' : '0 1px 3px rgba(0,0,0,0.6)', padding: '6px 18px'}}>
        {words.slice(0, n).join(' ')}
      </div>
    </div>
  );
};

const SCENES: [string, React.FC<{f: number}>][] = [
  ['evolved', Evolved], ['paper', Paper], ['pocket', Pocket], ['remind', Remind], ['sync', Sync], ['share', Share], ['nag', Nag],
  ['snow', Snow], ['archive', Archive], ['notif', Notif], ['message', Message], ['wait', Wait], ['until', Until], ['app', App],
  ['ask', Ask], ['results', Results], ['approve', Approve], ['gallery', Museum], ['end', End],
];
const SCENES_ON = SCENES.filter(([k]) => S[k] && S[k][1] > S[k][0]);
const Run: React.FC<{C: React.FC<{f: number}>}> = ({C: Comp}) => <Comp f={useCurrentFrame()} />;

export const Film2: React.FC = () => {
  useRetroFonts();
  useHand();
  useRoboto();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('film2-mix.wav')} />
      <Sequence from={0} durationInFrames={S.hook[1]} layout="none"><AbsoluteFill><Hook2 /></AbsoluteFill></Sequence>
      {SCENES_ON.map(([k, Comp]) => (
        <Sequence key={k} from={S[k][0]} durationInFrames={S[k][1] - S[k][0]} layout="none"><AbsoluteFill><Run C={Comp} /></AbsoluteFill></Sequence>
      ))}
      <Subtitle />
    </AbsoluteFill>
  );
};
export const FILM2_TOTAL = TL.total;
void interpolate; void out;
