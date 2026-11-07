import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AgentAvatar} from './Agent';
import {Check, Cursor} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, GREEN} from './ThreadUI';
import {Gallery3D} from './Gallery3D';
import {Hook2} from './Hook2';
import {Lines, Pic, PhoneShell, Title, Win} from './Full';
import {BLACK, Center, Crt, Dialog, TERM, TodoIcon, useRetroFonts} from './Trailer';
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

const useHand = () => {
  const [h] = React.useState(() => delayRender('caveat'));
  React.useEffect(() => {
    new FontFace('Caveat', `url(${staticFile('fonts/Caveat.ttf')})`, {weight: '400 700'}).load().then((ff) => { document.fonts.add(ff); continueRender(h); });
  }, [h]);
};
const springAt = (f: number, at: number, cfg = {damping: 16, stiffness: 150, mass: 0.9}) => spring({frame: f - at, fps: FPS, config: cfg});

// ---------------------------------------------------------------- "Oh, it evolved. Constantly." Old list apps pile up on the CRT.
const Evolved: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#16161c'}}>
    <Win x={90} y={70} w={560} h={330} title="TO-DO.TXT" at={2} f={f}><Lines f={f} at={6} rows={['[ ] call the dentist', '[ ] school form', '[ ] reply to Sam', '[ ] ...']} size={40} /></Win>
    <Win x={600} y={150} w={640} h={360} title="ORGANIZER" at={12} f={f}><Pic src="arch/GRC-1956-C-42046.jpg" /></Win>
    <Dialog x={1250} y={90} w={560} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, 22, 28)}>Call the dentist.<br />Due today.</Dialog>
    <Win x={180} y={520} w={600} h={330} title="TASKS 2.0" at={32} f={f}><Lines f={f} at={36} rows={['Today (3)', '  Team dinner      !', '  Supplier form    !!', '  Reply to Sam     !']} size={40} /></Win>
    <Dialog x={860} y={600} w={480} title="Sync" pop={prog(f, 42, 48)}>Synced to 3 devices.</Dialog>
    <Win x={1330} y={470} w={520} h={340} title="SHARED LIST" at={52} f={f}><Pic src="arch/GRC-1952-C-29212.jpg" /></Win>
    <Crt f={f} />
  </AbsoluteFill>
);

// "It left the paper." A pad, the list written in by hand, then the sheet tears away.
const Paper: React.FC<{f: number}> = ({f}) => {
  const rows = ['call the dentist', 'school form!', 'reply to Sam'];
  const tear = prog(f, 40, 60, (t) => t * t);
  return (
    <AbsoluteFill style={{background: '#2a2620', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.04 + 0.04 * prog(f, 0, 60, inOut)})`}}>
        <div style={{position: 'absolute', left: 560, top: 110, width: 800, height: 860, background: '#f3e27a', boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}} />
        <div style={{position: 'absolute', left: 560, top: 110, width: 800, height: 860, background: '#fbec8f', transformOrigin: '50% 0%', transform: `translate(${tear * 300}px, ${tear * 900}px) rotate(${tear * 18}deg)`, boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
          <div style={{position: 'absolute', left: 70, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 96, color: '#1d2a6b'}}>To do</div>
          {rows.map((r, i) => {
            const w = prog(f, 6 + i * 9, 16 + i * 9, (t) => t);
            return (
              <div key={r} style={{position: 'absolute', left: 80, top: 250 + i * 150, display: 'flex', alignItems: 'center', gap: 34}}>
                <div style={{width: 56, height: 56, border: '5px solid #1d2a6b', borderRadius: 6}} />
                <div style={{fontFamily: HAND, fontWeight: 600, fontSize: 96, color: '#1d2a6b', clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: 'nowrap'}}>{r}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Crt f={f} grain={0.07} />
    </AbsoluteFill>
  );
};

// "It moved into your pocket." A pocket organiser, then a phone, same list.
const Pocket: React.FC<{f: number}> = ({f}) => {
  const phone = f >= 30;
  const lf = phone ? f - 30 : f;
  const e = springAt(lf, 0);
  return (
    <AbsoluteFill style={{background: phone ? '#1a1830' : '#24241f', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 960 - 270, top: 120, width: 540, height: 860, transform: `translateY(${(1 - e) * 500}px) rotate(${phone ? -4 : 5}deg)`}}>
        {!phone ? (
          <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: '#6c6f72', border: '6px solid #4a4d50', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
            <div style={{position: 'absolute', left: 50, top: 60, right: 50, height: 470, background: '#9fb08a', border: '8px solid #3b3e40', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.25)'}}>
              <div style={{padding: '24px 26px', fontFamily: TERM, fontSize: 52, color: '#1f2a18', lineHeight: 1.12}}>
                <div>TO DO  9:41</div><div>---------</div><div>1 Dentist</div><div>2 Form</div><div>3 Reply Sam</div>
              </div>
            </div>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', top: 600, left: 60 + i * 110, width: 84, height: 84, borderRadius: 42, background: '#3f4245'}} />)}
            <div style={{position: 'absolute', left: 200, top: 730, width: 140, height: 60, borderRadius: 30, background: '#3f4245'}} />
          </div>
        ) : (
          <div style={{position: 'absolute', inset: 0, borderRadius: 72, background: C.dark, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
            <div style={{position: 'absolute', inset: 16, borderRadius: 58, background: C.white, overflow: 'hidden', padding: '110px 40px'}}>
              <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 60, color: C.ink}}>Today</div>
              {['Call the dentist', 'School form', 'Reply to Sam'].map((r) => (
                <div key={r} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '28px 0', borderBottom: `2px solid ${C.line}`}}>
                  <div style={{width: 40, height: 40, borderRadius: 20, border: `4px solid ${C.blue}`}} />
                  <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 38, color: C.ink}}>{r}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Crt f={f} grain={0.06} />
    </AbsoluteFill>
  );
};

// "It learned to remind you." Reminder pop-ups land over an archive office.
const Remind: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{transform: `scale(${1.08 - 0.06 * prog(f, 0, 60)})`}}><Pic src="arch/GRC-1968-C-00447.jpg" pos="50% 40%" /></AbsoluteFill>
    <AbsoluteFill style={{background: '#000', opacity: 0.25}} />
    <Dialog x={1150} y={160} w={620} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, 4, 10)}>Call the dentist.<br />Due today.</Dialog>
    <Dialog x={1100} y={420} w={620} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, 20, 26)}>School form.<br />Overdue.</Dialog>
    <Dialog x={1050} y={680} w={620} title="Reminder" buttons={['OK', 'Snooze']} pop={prog(f, 36, 42)}>Reply to Sam.<br />Overdue.</Dialog>
    <Crt f={f} />
  </AbsoluteFill>
);

// "To sync." The same list on a desktop and a phone, a pulse running between them.
const Sync: React.FC<{f: number}> = ({f}) => {
  const p = (f % 18) / 18;
  return (
    <AbsoluteFill style={{background: '#101624'}}>
      <div style={{position: 'absolute', left: 260, top: 250, width: 720, height: 500, background: '#c8c8cc', border: '6px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6'}}>
        <div style={{height: 44, background: C.blue, fontFamily: TERM, fontSize: 34, color: '#fff', padding: '2px 12px'}}>TO-DO.TXT</div>
        <Lines f={99} at={0} size={48} rows={['[x] call the dentist', '[ ] school form', '[ ] reply to Sam']} />
      </div>
      <div style={{position: 'absolute', left: 1320, top: 220, width: 300, height: 600, borderRadius: 44, background: C.dark, border: '10px solid #2c2c35', overflow: 'hidden'}}>
        <div style={{margin: 10, height: 560, borderRadius: 32, background: C.white, padding: '60px 22px', fontFamily: FONT.body, fontWeight: 600, fontSize: 28, color: C.ink, lineHeight: 2.1}}>
          <div style={{textDecoration: 'line-through', color: C.muted}}>Call the dentist</div><div>School form</div><div>Reply to Sam</div>
        </div>
      </div>
      {[0, 1, 2].map((i) => {
        const t = (p + i / 3) % 1;
        return <div key={i} style={{position: 'absolute', left: 1000 + t * 300, top: 494, width: 22, height: 22, background: '#7fe3ff', boxShadow: '0 0 24px #7fe3ff', opacity: Math.sin(t * Math.PI)}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: TERM, fontSize: 64, color: '#7fe3ff'}}>SYNCING{'.'.repeat(1 + (Math.floor(f / 6) % 3))}</div>
      <Crt f={f} />
    </AbsoluteFill>
  );
};

// "To share." People join the list, one avatar at a time.
const Share: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#1c1430'}}>
    <div style={{position: 'absolute', left: 560, top: 230, width: 800, height: 560, background: '#c8c8cc', border: '6px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6'}}>
      <div style={{height: 44, background: C.blue, fontFamily: TERM, fontSize: 34, color: '#fff', padding: '2px 12px'}}>SHARED LIST</div>
      <Lines f={99} at={0} size={48} rows={['[ ] team dinner', '[ ] supplier form', '[ ] reply to Sam', '[ ] ...and 9 more']} />
      <div style={{position: 'absolute', left: 30, bottom: 30, display: 'flex'}}>
        {['#e5484d', '#30a46c', '#f5a623', '#0090ff'].map((c, i) => {
          const s = springAt(f, 4 + i * 6, {damping: 12, stiffness: 220, mass: 0.6});
          return <div key={c} style={{width: 96, height: 96, borderRadius: 48, marginLeft: i ? -24 : 0, background: c, border: '6px solid #c8c8cc', opacity: Math.min(1, s * 2), transform: `scale(${0.95 + 0.05 * Math.min(1, s)}) translateY(${(1 - s) * 30}px)`}} />;
        })}
      </div>
    </div>
    <Crt f={f} />
  </AbsoluteFill>
);

// "To nag." The badge climbs to 99 and the icon shakes with every jump.
const Nag: React.FC<{f: number}> = ({f}) => {
  const n = Math.min(99, Math.floor(12 + Math.pow(f / 50, 1.6) * 87));
  const k = Math.exp(-((f % 4) / 1.5));
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Center><div style={{transform: `translate(${(random(`n${f}`) - 0.5) * 18 * k}px, ${(random(`m${f}`) - 0.5) * 12 * k}px) scale(${1 + 0.1 * prog(f, 0, 60)})`}}><TodoIcon size={300} badge={n} /></div></Center>
      <Crt f={f} grain={0.06} />
    </AbsoluteFill>
  );
};

// "Every one of those steps made the list better at remembering." Sticky notes snow down and pile up.
const Snow: React.FC<{f: number}> = ({f}) => {
  const notes = Array.from({length: 90});
  const cols = ['#ffe066', '#ffd1e8', '#c6f1d6', '#cfe1ff'];
  return (
    <AbsoluteFill style={{background: `linear-gradient(${C.blue}, #5a5af0)`, overflow: 'hidden'}}>
      {notes.map((_, i) => {
        const start = random(`s${i}`) * 90;
        const t = Math.max(0, f - start);
        const x = random(`x${i}`) * 1980 - 30;
        const rest = 1080 - 60 - random(`r${i}`) * (40 + 200 * Math.min(1, f / 120));
        const y = Math.min(rest, -120 + t * t * 0.35 + t * 8);
        const rot = (random(`o${i}`) - 0.5) * 70 + (y < rest ? Math.sin(t / 6 + i) * 20 : 0);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 110, height: 110, background: cols[i % 4], transform: `rotate(${rot}deg)`, boxShadow: '0 6px 14px rgba(0,0,0,0.18)'}}><div style={{margin: '26px 18px', height: 6, background: 'rgba(0,0,0,0.25)'}} /><div style={{margin: '0 18px', width: 50, height: 6, background: 'rgba(0,0,0,0.25)'}} /></div>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: prog(f, 10, 24)}}>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, letterSpacing: '-0.02em', color: '#fff', background: C.blue, padding: '6px 34px', borderRadius: 20}}>better at remembering.</div>
      </div>
    </AbsoluteFill>
  );
};

// "Not one of them ever did a single thing on it." One long archive hold.
const Archive: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <AbsoluteFill style={{transform: `scale(${1.0 + 0.1 * prog(f, 0, 120, (t) => t)})`, transformOrigin: '40% 55%'}}><Pic src="arch/office.jpg" /></AbsoluteFill>
    <AbsoluteFill style={{background: '#000', opacity: 0.2}} />
    <Crt f={f} />
  </AbsoluteFill>
);

// "Your day hands you work all day." Notifications stack on a deep violet screen.
const NOTES = [
  ['Sam', 'Any news on the venue for Friday?'], ['Clinic', 'Please confirm your check-up.'], ['Dana', 'Supplier form is due Friday.'],
  ['Team', 'Who is booking dinner?'], ['Sam', 'Still need that venue list.'], ['Dana', 'Reminder: the form.'],
];
const Notif: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 0% 50%, #4b1f8f 0%, #170b2e 55%, #08060f 100%)'}}>
    {NOTES.map(([who, txt], i) => {
      const at = 2 + i * 11;
      const s = springAt(f, at, {damping: 18, stiffness: 200, mass: 0.7});
      const k = NOTES.filter((_, j) => f >= 2 + j * 11).length - 1 - i;
      if (f < at) return null;
      return (
        <div key={i} style={{position: 'absolute', right: 160, top: 120 + k * 150, width: 760, height: 128, borderRadius: 28, background: 'rgba(245,245,250,0.92)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', boxSizing: 'border-box', opacity: Math.min(1, s * 2) * (k > 4 ? 0 : 1), transform: `translateY(${(1 - s) * -60}px) scale(${0.95 + 0.05 * s})`}}>
          <div style={{width: 72, height: 72, borderRadius: 18, background: C.chatHead}} />
          <div><div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.ink}}>{who}</div><div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 30, color: C.ink2}}>{txt}</div></div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// "It knows what you promised. It has everything it needs." The real ask, each task highlighted.
const ASK = [
  {t: 'Hi! Before Friday could you ', h: 0}, {t: 'book dinner for the team', h: 1}, {t: ', ', h: 0}, {t: 'fill in the supplier form', h: 2},
  {t: ' and ', h: 0}, {t: 'reply to Sam about the venue', h: 3}, {t: '? ', h: 0}, {t: 'Everything you need is in this thread.', h: 4},
];
const Message: React.FC<{f: number}> = ({f}) => {
  const base = S.message[0];
  const hl = [0, voAt(19) - base + 4, voAt(19) - base + 14, voAt(19) - base + 24, voAt(20) - base + 6];
  return (
    <AbsoluteFill style={{background: '#e9e9ee', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.15 - 0.08 * prog(f, 0, 120, inOut)}) translateX(${-30 * prog(f, 0, 120, inOut)}px)`}}>
        <div style={{position: 'absolute', left: 260, top: 160, width: 1400, padding: '50px 60px', background: C.white, borderRadius: 30, boxShadow: '0 30px 80px rgba(20,20,60,0.12)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30}}>
            <div style={{width: 72, height: 72, borderRadius: 36, background: '#f5a623'}} />
            <div><div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 36, color: C.ink}}>Dana</div><div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 28, color: C.muted}}>Friday plans · 9:02</div></div>
          </div>
          <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 58, lineHeight: 1.5, color: C.ink}}>
            {ASK.map((p, i) => {
              const on = p.h ? prog(f, hl[p.h], hl[p.h] + 8) : 0;
              return <span key={i} style={{backgroundImage: 'linear-gradient(#ffe066, #ffe066)', backgroundRepeat: 'no-repeat', backgroundSize: `${on * 100}% 100%`, padding: p.h ? '0 4px' : 0}}>{p.t}</span>;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// "And it waits for you anyway." The list sits untouched while the clock runs all day.
const Wait: React.FC<{f: number}> = ({f}) => {
  const mins = 9 * 60 + Math.floor(prog(f, 0, 110, (t) => t) * 525);
  const clock = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  const blink = Math.floor(f / 12) % 2 === 0;
  return (
    <AbsoluteFill style={{background: '#14141a'}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.06 * prog(f, 0, 120, (t) => t)})`}}>
        <div style={{position: 'absolute', left: 360, top: 170, width: 1200, height: 700, background: '#c8c8cc', border: '6px solid', borderColor: '#f4f4f6 #505058 #505058 #f4f4f6'}}>
          <div style={{height: 52, background: C.blue, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', fontFamily: TERM, fontSize: 40, color: '#fff'}}><span>TO-DO.TXT</span><span>{clock}</span></div>
          <div style={{margin: 10, height: 616, background: '#fff', padding: '30px 40px', fontFamily: TERM, fontSize: 70, color: '#111', lineHeight: 1.25}}>
            <div>[ ] book the team dinner</div><div>[ ] supplier form</div><div>[ ] reply to Sam</div>
            <div>{blink ? '█' : ' '}</div>
          </div>
        </div>
      </AbsoluteFill>
      <Crt f={f} />
    </AbsoluteFill>
  );
};

// "Until now." Small type on black; the "o" grows into the Headmaster mark, which lights up.
const Until: React.FC<{f: number}> = ({f}) => {
  const typeAt = voAt(22) - S.until[0];
  const shown = 'Until now.'.slice(0, Math.max(0, Math.floor((f - typeAt) / 1.6)));
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
const App: React.FC<{f: number}> = ({f}) => {
  const nameAt = voAt(24) - S.app[0];
  const name = 'Headmaster'.slice(0, Math.max(0, Math.floor((f - nameAt) / 1.5)));
  const slide = prog(f, nameAt - 4, nameAt + 10);
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
const Ask: React.FC<{f: number}> = ({f}) => {
  const ws = MSG.split(' ');
  const sent = 66;
  const typed = f < sent ? ws.filter((_, i) => f >= 8 + i * 3).join(' ') : '';
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <Title f={f} a="Tell your agent." b="On WhatsApp." at={4} x={170} y={400} size={120} stack />
      <PhoneShell x={1080} y={44} scale={1.12} composer={typed} status={f > sent + 20 ? 'working' : 'idle'}>
        <Bubble f={f} at={sent} top={24} out skin={GREEN} time="09:04">{MSG}</Bubble>
        <Bubble f={f} at={sent + 22} top={286} skin={GREEN} time="09:04">On it. Nothing goes out until you say so.</Bubble>
      </PhoneShell>
    </AbsoluteFill>
  );
};

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
  {k: 'The booking.', v: 'Found.', title: 'Team dinner', rows: ['Friday · 7:30 pm · table for 8', 'Olive House, near the office', 'Held until 6 pm today']},
  {k: 'The form.', v: 'Filled.', title: 'Supplier form', rows: ['Company details · from last year', 'Bank details · from your files', '2 fields left for you']},
  {k: 'The reply.', v: 'Drafted.', title: 'Reply to Sam', rows: ['"Hi Sam! Three venues that fit 40:', 'the Loft, Harbour Room, Studio 9.', 'All free Friday. Pick one?"']},
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
            {f < none ? 'All of it ready.' : <>None of it <span style={{color: C.blue}}>sent.</span></>}
          </div>
        </Center>
      )}
    </AbsoluteFill>
  );
};

// "That part is still you." The draft waits; your click sends it.
const Approve: React.FC<{f: number}> = ({f}) => {
  const tap = 70;
  const mv = springAt(f, 20, {damping: 20, stiffness: 120, mass: 1});
  const cx = 1700 + (1255 - 1700) * mv, cy = 1000 + (772 - 1000) * mv;
  const press = prog(f, tap - 4, tap) * (1 - prog(f, tap + 2, tap + 8));
  const sent = f >= tap + 2;
  const ok = springAt(f, tap + 2, {damping: 12, stiffness: 240, mass: 0.6});
  return (
    <AbsoluteFill>
      <Aura f={f + 285} />
      <Title f={f} a="That part" b="is still you." at={4} x={600} y={110} size={92} />
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

// The museum ending is real 3D (Gallery3D.tsx): plinths, CC0 objects, our icon last.
const Museum: React.FC<{f: number}> = ({f}) => <Gallery3D f={f} />;

// End card, white: the icon lands, "Free in beta" and the address either side.
const End: React.FC<{f: number}> = ({f}) => {
  const land = springAt(f, 4, {damping: 14, stiffness: 120, mass: 1.1});
  const side = prog(f, 22, 40);
  return (
    <AbsoluteFill style={{background: C.white}}>
      <Center>
        <div style={{display: 'flex', alignItems: 'center', gap: 120}}>
          <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 52, color: C.ink2, opacity: side, transform: `translateX(${(1 - side) * 30}px)`}}>Free in beta</div>
          <Img src={staticFile('headmaster-icon-dark.svg')} style={{width: 240, height: 240, borderRadius: 54, opacity: Math.min(1, land * 1.5), transform: `translateY(${(1 - land) * 40}px) scale(${0.95 + 0.05 * Math.min(1, land)})`}} />
          <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 52, color: C.blue, opacity: side, transform: `translateX(${(1 - side) * -30}px)`}}>headmaster.app</div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// Subtitles for the narrated lines a scene does not already spell out. Dark scenes get light type and vice versa.
const LIGHT = new Set(['message', 'app', 'ask', 'results', 'approve', 'gallery', 'end']);
const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  const i = VO.findIndex((v, k) => v.sub && f >= v.at && f < Math.min(v.at + v.len + 12, k + 1 < VO.length ? VO[k + 1].at : 1e9));
  if (i < 0) return null;
  const v = VO[i];
  const scene = Object.entries(S).find(([, [a, b]]) => f >= a && f < b)?.[0] ?? '';
  if (scene === 'ask' || scene === 'approve') return null;
  const e = prog(f, v.at, v.at + 5);
  const light = LIGHT.has(scene);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: light ? C.ink : '#fff', background: light ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.55)', borderRadius: 12, padding: '8px 22px', opacity: e}}>{v.sub}</div>
    </div>
  );
};

const SCENES: [string, React.FC<{f: number}>][] = [
  ['evolved', Evolved], ['paper', Paper], ['pocket', Pocket], ['remind', Remind], ['sync', Sync], ['share', Share], ['nag', Nag],
  ['snow', Snow], ['archive', Archive], ['notif', Notif], ['message', Message], ['wait', Wait], ['until', Until], ['app', App],
  ['ask', Ask], ['results', Results], ['approve', Approve], ['gallery', Museum], ['end', End],
];
const Run: React.FC<{C: React.FC<{f: number}>}> = ({C: Comp}) => <Comp f={useCurrentFrame()} />;

export const Film2: React.FC = () => {
  useRetroFonts();
  useHand();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('film2-mix.wav')} />
      <Sequence from={0} durationInFrames={S.hook[1]} layout="none"><AbsoluteFill><Hook2 /></AbsoluteFill></Sequence>
      {SCENES.map(([k, Comp]) => (
        <Sequence key={k} from={S[k][0]} durationInFrames={S[k][1] - S[k][0]} layout="none"><AbsoluteFill><Run C={Comp} /></AbsoluteFill></Sequence>
      ))}
      <Subtitle />
    </AbsoluteFill>
  );
};
export const FILM2_TOTAL = TL.total;
void interpolate; void out;
