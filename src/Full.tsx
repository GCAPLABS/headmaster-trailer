import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AgentAvatar} from './Agent';
import {Check, Cursor} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, GREEN, HeaderGreen} from './ThreadUI';
import {BLACK, Center, Crt, Dialog, Hook, Hung, Photo, TERM, Term, TodoIcon, useRetroFonts, WALL} from './Trailer';

// Full launch trailer, 75 s at 30 fps. Beat = 15 frames. Retro (archive, CRT, old-OS) until "Until now",
// then the clean Studio look of the real app. Every frame reads with the sound off.
// One timeline file: the picture (this file) and the sound (tools/trailer_audio_full.py) both read it. Every hit sits on a 15-frame beat.
import TL from './trailer-timeline.json';
export const T = {acts: TL.acts as Record<string, number[]>, total: TL.total};
const L = TL.local;
// Cursor travel: closed-form spring from one point to the next (snappy UI preset), never a fixed easing curve.
const springTo = (f: number, at: number, fps: number) => spring({frame: f - at, fps, config: {damping: 20, stiffness: 140, mass: 0.9}});

const Cap: React.FC<{text: string; at: number; f: number; y?: number; color?: string}> = ({text, at, f, y = 960, color = '#ffe066'}) => {
  if (f < at) return null;
  const ws = text.split(' ');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
      <span style={{fontFamily: TERM, fontSize: 60, color, background: 'rgba(0,0,0,0.6)', padding: '2px 18px', whiteSpace: 'pre'}}>
        {ws.map((w, i) => <span key={i} style={{opacity: f >= at + i * 4 ? 1 : 0}}>{w}{i < ws.length - 1 ? ' ' : ''}</span>)}
      </span>
    </div>
  );
};

// A window from the old desktop: bevelled frame, royal-blue title bar, content inside.
export const Win: React.FC<{x: number; y: number; w: number; h: number; title: string; at: number; f: number; children: React.ReactNode}> = ({x, y, w, h, title, at, f, children}) => {
  const e = prog(f, at, at + 6);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, background: '#c8c8cc', border: '3px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6', boxShadow: '8px 8px 0 rgba(0,0,0,0.5)', opacity: e, transform: `scale(${0.95 + 0.05 * e})`}}>
      <div style={{height: 40, background: C.blue, display: 'flex', alignItems: 'center', padding: '0 12px'}}><span style={{fontFamily: TERM, fontSize: 32, color: '#fff'}}>{title}</span></div>
      <div style={{position: 'relative', height: h, margin: 6, background: '#fff', overflow: 'hidden'}}>{children}</div>
    </div>
  );
};

export const Pic: React.FC<{src: string; pos?: string}> = ({src, pos = '50% 50%'}) => <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.08)'}} />;

export const Lines: React.FC<{rows: string[]; f: number; at: number; size?: number}> = ({rows, f, at, size = 34}) => (
  <div style={{padding: '16px 20px', fontFamily: TERM, fontSize: size, color: '#111', lineHeight: 1.15}}>
    {rows.map((r, i) => <div key={i} style={{opacity: f >= at + i * 6 ? 1 : 0}}>{r}</div>)}
  </div>
);

// ---------------------------------------------------------------- Act 2: it evolved, but only reminds
const Evolved: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#1b1b22'}}>
    <Win x={80} y={60} w={620} h={400} title="LEDGER_1952.TIF" at={L.evolved.wins[0]} f={f}><Pic src="arch/GRC-1952-C-29212.jpg" /></Win>
    <Win x={640} y={110} w={640} h={410} title="BY_HAND_1956.TIF" at={L.evolved.wins[1]} f={f}><Pic src="arch/GRC-1956-C-42046.jpg" /></Win>
    <Win x={1210} y={60} w={630} h={400} title="DATA_ROOM_1963.TIF" at={L.evolved.wins[2]} f={f}><Pic src="arch/A-31183.jpg" /></Win>
    <Win x={110} y={560} w={560} h={300} title="TO-DO.TXT" at={L.evolved.wins[3]} f={f}><Lines f={f} at={L.evolved.wins[3] + 4} rows={['[ ] book the flight', '[ ] move the dentist', '[ ] send the deck', '[ ] ...44 more']} /></Win>
    <Dialog x={700} y={590} w={500} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, L.evolved.reminder, L.evolved.reminder + 6)}>Book the flight.<br />Due today.</Dialog>
    <Dialog x={1340} y={250} w={460} title="Sync" buttons={['OK']} pop={prog(f, L.evolved.sync, L.evolved.sync + 6)}>Synced to 3 devices.</Dialog>
    <Win x={1240} y={540} w={620} h={300} title="ASSISTANT" at={L.evolved.assistant} f={f}>
      <Lines f={f} at={L.evolved.assistant + 6} size={32} rows={['> change my flight to friday', 'Sure! Here are 7 steps:', '1. Open the airline site', '2. Sign in to your account', '3. Find "Manage booking"...']} />
    </Win>
    <Crt f={f} />
    <Cap f={f} at={4} text={f < 60 ? 'Oh, it evolved.' : f < 120 ? 'Constantly.' : f < 180 ? 'It learned to remind you. To sync.' : 'To answer back.'} />
  </AbsoluteFill>
);

const Fifty: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <Photo src="arch/office.jpg" f={f} dur={120} zoom={[1.0, 1.07]} dim={0.3} />
    <Crt f={f} />
    <Cap f={f} at={10} text="In fifty years, none of it did the work for you." />
  </AbsoluteFill>
);

const Remind: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <Photo src="arch/GRC-1968-C-00447.jpg" f={f} dur={120} zoom={[1.06, 1.0]} dim={0.25} pos="50% 40%" />
    <Dialog x={1220} y={140} w={580} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, L.remind.dialogs[0], L.remind.dialogs[0] + 6)}>Book the flight.<br />Due today.</Dialog>
    <Dialog x={1260} y={370} w={580} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, L.remind.dialogs[1], L.remind.dialogs[1] + 6)}>Move the dentist.<br />Overdue.</Dialog>
    <Dialog x={1300} y={600} w={580} title="To-do" buttons={['OK']} pop={prog(f, L.remind.dialogs[2], L.remind.dialogs[2] + 6)}>You have {Math.min(47, 12 + Math.max(0, Math.floor((f - L.remind.dialogs[2]) / 1.5)))} things to do.</Dialog>
    <Crt f={f} />
    <Cap f={f} at={L.remind.cap} text="It got better at reminding you. Never at doing it." />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- Act 3: Until now. CRT switches off, Headmaster lands.
const Until: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const U = L.until;
  if (f < U.land) {
    const off = prog(f, U.offA, U.offB, inOut);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{background: BLACK, transform: `scaleY(${1 - 0.995 * off}) scaleX(${1 - 0.6 * Math.max(0, off - 0.7) / 0.3})`, filter: `brightness(${1 + 3 * off})`}}>
          <Center><Term f={f} at={U.type} text="Until now." size={130} step={10} /></Center>
          <Crt f={f} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const g = f - U.land;
  const land = spring({frame: g, fps, config: {damping: 14, stiffness: 120, mass: 1.1}});
  const word = prog(g, 14, 34);
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {(
        <>
          <Center y={-110}><Img src={staticFile('headmaster-mark-ink.svg')} style={{height: 250, width: (250 * 898) / 983, opacity: Math.min(1, land * 1.5), transform: `translateY(${(1 - land) * -80}px) scale(${0.95 + 0.05 * land})`}} /></Center>
          <Center y={150}><div style={{overflow: 'hidden', paddingBottom: 20}}><div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 170, letterSpacing: '-0.035em', color: C.ink, transform: `translateY(${(1 - word) * 180}px)`}}>Headmaster</div></div></Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Act 4: the real product
const MSG = 'Sort tomorrow for me. Move the dentist, change my flight, send Sara the deck.';
export const Title: React.FC<{f: number; a: string; b?: string; at?: number; x?: number; y?: number; size?: number; stack?: boolean}> = ({f, a, b, at = 0, x = 150, y = 70, size = 92, stack}) => {
  const e = prog(f, at, at + 16);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: FONT.display, fontWeight: 800, fontSize: size, lineHeight: 1.02, whiteSpace: stack ? 'normal' : 'nowrap', width: stack ? 900 : undefined, letterSpacing: '-0.03em', color: C.ink, opacity: e, transform: `translateY(${(1 - e) * 24}px)`, filter: `blur(${(1 - e) * 6}px)`}}>
      {a}{b && (stack ? <div style={{color: C.blue}}>{b}</div> : <span style={{color: C.blue}}> {b}</span>)}
    </div>
  );
};

export const PhoneShell: React.FC<{x: number; y: number; scale: number; children: React.ReactNode; composer?: string; status?: 'idle' | 'working' | 'complete'}> = ({x, y, scale, children, composer, status = 'idle'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 430, height: 880, transformOrigin: '0 0', transform: `scale(${scale})`}}>
    <div style={{position: 'absolute', left: 16, top: 22, width: 430, height: 880, borderRadius: 66, background: C.ground3}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: 66, background: C.dark}} />
    <div style={{position: 'absolute', left: 16, top: 16, width: 398, height: 848, borderRadius: 50, overflow: 'hidden', background: C.chatPaper}}>
      <HeaderGreen avatar={<AgentAvatar size={64} id="ph" status={status} />} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 112, bottom: 108}}>{children}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.field, borderTop: `2px solid ${C.line}`}}>
        <div style={{position: 'absolute', left: 16, top: 20, width: 272, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
          <span style={{position: 'absolute', right: 20, left: 20, top: 17, fontFamily: FONT.body, fontSize: 27, color: composer ? C.ink : C.muted, whiteSpace: 'nowrap', direction: composer ? 'rtl' : 'ltr', textAlign: 'left'}}>{composer || 'Message'}</span>
        </div>
        <div style={{position: 'absolute', right: 16, top: 20, width: 68, height: 68, borderRadius: 34, background: C.chatHead}} />
      </div>
    </div>
    <div style={{position: 'absolute', left: 430 / 2 - 46, top: 26, width: 92, height: 26, borderRadius: 13, background: C.dark}} />
  </div>
);

const Ask: React.FC<{f: number}> = ({f}) => {
  const ws = MSG.split(' ');
  const {typeAt, per, sent, reply, working} = L.ask; // one word every 3 frames; send lands on a beat
  const typed = f < sent ? ws.filter((_, i) => f >= typeAt + i * per).join(' ') : '';
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <Title f={f} a="Just tell it." b="On WhatsApp." at={4} x={170} y={400} size={120} stack />
      <PhoneShell x={1080} y={44} scale={1.12} composer={typed} status={f > working ? 'working' : 'idle'}>
        <Bubble f={f} at={sent} top={24} out skin={GREEN} time="08:02">{MSG}</Bubble>
        <Bubble f={f} at={reply} top={250} skin={GREEN} time="08:02">On it. I will check with you before anything goes out.</Bubble>
      </PhoneShell>
    </AbsoluteFill>
  );
};

// The agent's own screen: it clicks through a clinic page, then an airline page.
const Slot: React.FC<{label: string; hot: number; pick?: boolean}> = ({label, hot, pick}) => (
  <div style={{padding: '14px 0', width: 170, textAlign: 'center', borderRadius: 12, fontFamily: FONT.body, fontWeight: 700, fontSize: 28, border: `2px solid ${pick && hot ? C.blue : C.line}`, background: pick && hot ? C.blue : C.white, color: pick && hot ? '#fff' : C.ink}}>{label}</div>
);

const Screen: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const S = L.screen;
  const page2 = f >= S.page2;
  const lf = page2 ? f - S.page2 : f;
  const from = [1500, 900], tgt = page2 ? [870, 640] : [1150, 640];
  const m = springTo(lf, S.move, fps);
  const cx = from[0] + (tgt[0] - from[0]) * m, cy = from[1] + (tgt[1] - from[1]) * m;
  const press = prog(lf, S.click - 4, S.click) * (1 - prog(lf, S.click + 2, S.click + 8));
  const picked = lf >= S.click;
  const ok = prog(lf, S.click + 4, S.click + 12);
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <Title f={f} a="It does the steps" b="itself." at={4} />
      <div style={{position: 'absolute', left: 160, top: 230, width: 1600, height: 760, background: C.white, borderRadius: 28, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
        <div style={{height: 76, background: C.field, borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px'}}>
          <AgentAvatar size={48} id="scr" status="working" bg={C.ground} />
          <span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: C.ink}}>Agent screen</span>
          <span style={{marginLeft: 20, fontFamily: FONT.body, fontWeight: 500, fontSize: 28, color: C.muted, background: C.white, border: `2px solid ${C.line}`, borderRadius: 12, padding: '6px 20px'}}>{page2 ? 'airline.example / manage booking' : 'clinic.example / appointments'}</span>
        </div>
        <div style={{padding: '56px 80px'}}>
          <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 76, color: C.ink, letterSpacing: '-0.025em'}}>{page2 ? 'Change your flight' : 'Pick a new time'}</div>
          <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 36, color: C.muted, marginTop: 10}}>{page2 ? 'Friday · same route · same seat' : 'Thursday · Dr. Lee · check-up'}</div>
          <div style={{display: 'flex', gap: 28, marginTop: 64}}>
            {(page2 ? ['07:15', '09:40', '13:05', '18:30'] : ['10:00 am', '1:30 pm', '4:00 pm', '5:30 pm']).map((sl, i) => {
              const pick = page2 ? i === 1 : i === 2;
              const on = picked && pick;
              return <div key={sl} style={{padding: '22px 0', width: 250, textAlign: 'center', borderRadius: 16, fontFamily: FONT.body, fontWeight: 700, fontSize: 38, border: `3px solid ${on ? C.blue : C.line}`, background: on ? C.blue : C.white, color: on ? '#fff' : C.ink, transform: `scale(${pick ? 1 - 0.03 * press : 1})`}}>{sl}</div>;
            })}
          </div>
          <div style={{marginTop: 64, display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT.body, fontWeight: 700, fontSize: 42, color: C.ink, opacity: ok, transform: `translateY(${(1 - ok) * 10}px)`}}><Check size={52} bg={C.blue} />{page2 ? 'Flight changed to Friday, 9:40.' : 'Moved to Thursday, 4:00 pm.'}</div>
        </div>
      </div>
      <Cursor x={cx} y={cy} press={press} fill={C.blue} scale={1.6} />
    </AbsoluteFill>
  );
};

export const Row: React.FC<{text: string; sub: string; done: number; wait?: boolean; press?: number}> = ({text, sub, done, wait, press = 0}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '26px 30px', borderTop: `2px solid ${C.line}`}}>
    <div style={{width: 46, height: 46, position: 'relative'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 23, border: `4px solid ${C.blue}`, boxSizing: 'border-box', opacity: 1 - done}} />
      <div style={{position: 'absolute', inset: 0, opacity: done, transform: `scale(${0.8 + 0.2 * done})`}}><Check size={46} bg={C.blue} /></div>
    </div>
    <div style={{flex: 1}}>
      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 34, color: done > 0.5 ? C.muted : C.ink, textDecoration: done > 0.5 ? 'line-through' : 'none'}}>{text}</div>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 25, color: C.muted, marginTop: 4}}>{sub}</div>
    </div>
    {wait && done < 1 && <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 28, color: '#fff', background: C.blue, borderRadius: 16, padding: '14px 26px', transform: `scale(${1 - 0.04 * press})`}}>Approve</div>}
  </div>
);

const List: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const d = (at: number) => prog(f, at, at + 8);
  const {ticks, cursorIn, tap, titleSwap} = L.list;
  const mv = springTo(f, cursorIn, fps);
  const cx = 1900 + (1755 - 1900) * mv, cy = 1060 + (845 - 1060) * mv;
  const press = prog(f, tap - 4, tap) * (1 - prog(f, tap + 2, tap + 8));
  const sent = f >= tap + 4;
  return (
    <AbsoluteFill style={{background: C.ground}}>
      {f < titleSwap ? <Title f={f} a="Your list," b="doing itself." at={4} /> : <Title f={f} a={sent ? 'All of it done.' : 'It asks before anything'} b={sent ? 'You just said yes.' : 'goes out.'} at={sent ? tap + 6 : titleSwap} />}
      <div style={{position: 'absolute', left: 300, top: 270, width: 1320, transformOrigin: '0 0', transform: 'scale(1)', zoom: 1.18, background: C.white, borderRadius: 28, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '28px 30px'}}>
          <AgentAvatar size={56} id="ls" bg={C.ground} status={sent ? 'complete' : 'working'} />
          <div style={{flex: 1}}>
            <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: C.ink}}>Tomorrow</div>
            <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 25, color: C.muted}}>Your agent worked on this while you were out</div>
          </div>
          <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.muted}}>{sent ? '0 left' : f >= ticks[1] ? '1 left' : f >= ticks[0] ? '2 left' : '3 left'}</div>
        </div>
        <Row text="Move the dentist" sub="Now Thursday, 4:00 pm. Calendar updated." done={d(ticks[0])} />
        <Row text="Change the flight" sub="Moved to Friday, 9:40 am. Same seat." done={d(ticks[1])} />
        <Row text="Send Sara the deck" sub={sent ? 'Sent at 08:14.' : 'Ready to send. Waiting for your OK.'} done={d(tap + 4)} wait press={press} />
      </div>
      {f >= cursorIn && <Cursor x={cx} y={cy} press={press} fill={C.ink} scale={1.4} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Act 5: gallery and end card
const Gallery: React.FC<{f: number}> = ({f}) => {
  const G = L.gallery;
  const pan = prog(f, G.pan[0], G.pan[1], inOut);
  const x = -1320 * pan;
  const img = (s: string, fit: 'cover' | 'contain' = 'cover', bg = '#d0d0ce', gray = false) => <Img src={staticFile(s)} style={{width: '100%', height: '100%', objectFit: fit, background: bg, filter: gray ? 'grayscale(1)' : 'none'}} />;
  return (
    <AbsoluteFill style={{background: WALL, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 868, bottom: 0, background: '#cfcdc7'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 8, background: '#e2e0da'}} />
      <div style={{position: 'absolute', left: x * 1.25, top: 0, width: 2600, height: 1080, transformOrigin: '0 420px', transform: 'scale(1.25)'}}>
        <Hung x={80} w={320} h={360} label="LIGHT">{img('arch/lamp.jpg', 'contain')}</Hung>
        <Hung x={500} w={310} h={400} label="MAPS">{img('arch/map.jpg', 'contain', '#c9c9c6')}</Hung>
        <Hung x={910} w={330} h={330} label="MONEY">{img('arch/dinar.jpg', 'contain')}</Hung>
        <Hung x={1340} w={420} h={340} label="COMPUTERS">{img('arch/GRC-1955-C-39782.jpg', 'cover', '#000', true)}</Hung>
        <Hung x={1900} w={380} h={480} label="YOUR TO-DO LIST">
          <div style={{position: 'absolute', inset: 0, background: C.ground, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('headmaster-icon-dark.svg')} style={{width: 230, height: 230, borderRadius: 52, opacity: prog(f, G.icon, G.icon + 12), transform: `scale(${0.95 + 0.05 * prog(f, G.icon, G.icon + 12)})`}} />
          </div>
        </Hung>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.ink, letterSpacing: '-0.02em', opacity: prog(f, 10, 24) * (1 - prog(f, 118, 126))}}>Everything we make finds its next form.</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.ink, letterSpacing: '-0.02em', opacity: prog(f, G.line2, G.line2 + 12)}}>Your to-do list just found <span style={{color: C.blue}}>its.</span></div>
    </AbsoluteFill>
  );
};

const End: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const land = spring({frame: f - 4, fps, config: {damping: 14, stiffness: 120, mass: 1.1}});
  const a = prog(f, 22, 40), b = prog(f, 44, 60);
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <Center y={-180}><Img src={staticFile('headmaster-icon-dark.svg')} style={{width: 220, height: 220, borderRadius: 50, opacity: Math.min(1, land * 1.5), transform: `translateY(${(1 - land) * 40}px) scale(${0.95 + 0.05 * land})`}} /></Center>
      <Center y={40}><div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 130, letterSpacing: '-0.035em', color: C.ink, opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>Headmaster</div></Center>
      <Center y={170}><div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 56, letterSpacing: '-0.02em', color: C.blue, opacity: a}}>Your agent. It does the list.</div></Center>
      <Center y={320}><div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 44, color: C.ink2, opacity: b, transform: `translateY(${(1 - b) * 10}px)`}}>headmaster.app</div></Center>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- assembly
const ACTS: {k: string; C: React.FC<{f: number}>}[] = [
  {k: 'evolved', C: Evolved}, {k: 'fifty', C: Fifty}, {k: 'remind', C: Remind}, {k: 'until', C: Until},
  {k: 'ask', C: Ask}, {k: 'screen', C: Screen}, {k: 'list', C: List}, {k: 'gallery', C: Gallery}, {k: 'end', C: End},
];

const Act: React.FC<{C: React.FC<{f: number}>}> = ({C: Comp}) => <Comp f={useCurrentFrame()} />;

export const Trailer: React.FC = () => {
  useRetroFonts();
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Audio src={staticFile('trailer-full.wav')} />
      <Sequence from={0} durationInFrames={T.acts.hook[1]} layout="none"><AbsoluteFill><Hook /></AbsoluteFill></Sequence>
      {ACTS.map(({k, C: Comp}) => {
        const [a, b] = T.acts[k];
        return <Sequence key={k} from={a} durationInFrames={b - a} layout="none"><AbsoluteFill><Act C={Comp} /></AbsoluteFill></Sequence>;
      })}
    </AbsoluteFill>
  );
};
