import React from 'react';
import {AgentAvatar} from './Agent';
import {Check, Cursor, NavIcon, NavName, Spin, Star, typedWords} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, HeaderGreen, ThreadTop} from './ThreadUI';

// App window in 1920x1080 world space. Scene 2 pulls back onto it from the phone close-up (match cut).
export const WIN = {x: 110, y: 160, w: 1700, h: 780};
export const SIDE = 260;
export const PANE = {x: 370, w: 470};
export const COL = {x: 406, y: 272}; // thread column origin in world space (same 398 px column as the phone screen)

const NAV: {name: NavName; label: string}[] = [
  {name: 'chat', label: 'Chat'}, {name: 'files', label: 'Files'}, {name: 'memory', label: 'Memory'},
  {name: 'profiles', label: 'Profiles'}, {name: 'skills', label: 'Extensions'},
];

export const Sidebar: React.FC<{idx: number; avatarId: string}> = ({idx, avatarId}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SIDE, height: WIN.h, background: C.field, borderRight: `2px solid ${C.line}`}}>
    <div style={{position: 'absolute', left: 24, top: 30, display: 'flex', alignItems: 'center', gap: 14}}>
      <AgentAvatar size={52} id={avatarId} bg={C.ground} />
      <span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 28, color: C.ink}}>Headmaster</span>
    </div>
    <div style={{position: 'absolute', left: 16, top: 124 + idx * 70, width: SIDE - 32, height: 62, borderRadius: 14, background: C.ground}} />
    {NAV.map((n, i) => {
      const on = Math.abs(i - idx) < 0.5;
      return (
        <div key={n.name} style={{position: 'absolute', left: 34, top: 124 + i * 70, height: 62, display: 'flex', alignItems: 'center', gap: 16}}>
          <NavIcon name={n.name} color={on ? C.blue : C.ink2} />
          <span style={{fontFamily: FONT.body, fontWeight: on ? 700 : 500, fontSize: 28, color: on ? C.ink : C.ink2}}>{n.label}</span>
        </div>
      );
    })}
  </div>
);

export const Frame: React.FC<{children: React.ReactNode; dim?: number}> = ({children, dim = 0}) => (
  <>
    <div style={{position: 'absolute', left: WIN.x + 14, top: WIN.y + 16, width: WIN.w, height: WIN.h, borderRadius: 24, background: C.ground3}} />
    <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 24, background: C.white, border: `2px solid ${C.line}`, boxSizing: 'border-box', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -2, top: -2, width: WIN.w, height: WIN.h}}>{children}</div>
      {dim > 0 && <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: C.ink, opacity: dim}} />}
    </div>
  </>
);

// ---------- Scene 2 content ----------
// The booking page the agent opens; scene 2 shows it in the mini browser, the takeover scene shows it large.
export const BookingPage: React.FC<{k?: number}> = ({k = 1}) => (
  <div style={{width: 834 * k, transformOrigin: '0 0'}}>
    <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40 * k, color: C.ink}}>Palm Bay Resort, 2 nights</div>
    <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 28 * k, color: C.ink2, marginTop: 4 * k}}>Beach view, double room</div>
    <div style={{marginTop: 18 * k, borderTop: `2px solid ${C.line}`, paddingTop: 14 * k, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.body, fontSize: 30 * k, fontWeight: 500, color: C.ink}}><span>AED 570 x 2 nights</span><span>AED 1,140</span></div>
    <div style={{marginTop: 12 * k, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.body, fontSize: 36 * k, fontWeight: 800, color: C.ink}}><span>Total</span><span>AED 1,140</span></div>
    <div style={{marginTop: 28 * k, width: 330 * k, height: 66 * k, borderRadius: 14 * k, background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 30 * k, textAlign: 'center', lineHeight: `${66 * k}px`}}>Continue to payment</div>
  </div>
);

type Hotel = {name: string; price: string; rate: string; tone: string; tone2: string; best?: boolean};
const HOTELS: Hotel[] = [
  {name: 'Palm Bay Resort', price: 'AED 570', rate: '4.8', tone: '#d8ecff', tone2: '#7aa7e8', best: true},
  {name: 'Shore House', price: 'AED 610', rate: '4.6', tone: C.ground, tone2: C.ground3},
  {name: 'Coral Inn', price: 'AED 640', rate: '4.5', tone: C.chatPaper, tone2: '#c9bba4'},
];

const Building: React.FC<{tone: string; tone2: string; seed: number}> = ({tone, tone2, seed}) => (
  <svg width={280} height={118} viewBox="0 0 280 118" style={{display: 'block'}}>
    <rect width={280} height={118} fill={tone} />
    <rect x={0} y={96} width={280} height={22} fill={tone2} opacity={0.5} />
    <rect x={70 - seed * 8} y={22} width={140 + seed * 16} height={80} rx={6} fill={tone2} />
    {[0, 1, 2, 3].map((c) => [0, 1].map((r) => (
      <rect key={`${c}${r}`} x={86 - seed * 8 + c * (30 + seed * 4)} y={34 + r * 26} width={18} height={16} rx={3} fill="#fff" />
    )))}
    <rect x={128} y={74} width={24} height={28} rx={4} fill="#fff" />
  </svg>
);

const StepRow: React.FC<{f: number; label: string; state: 'wait' | 'active' | 'done'; popAt: number}> = ({f, label, state, popAt}) => {
  const pop = 0.7 + 0.3 * out(prog(f, popAt, popAt + 8));
  return (
    <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 30, height: 30}}>
        {state === 'done' && <Check size={30} pop={pop} />}
        {state === 'active' && <Spin size={30} f={f} />}
        {state === 'wait' && <svg width={30} height={30}><circle cx={15} cy={15} r={11} fill="none" stroke={C.line} strokeWidth={3} /></svg>}
      </div>
      <span style={{fontFamily: FONT.body, fontWeight: state === 'active' ? 700 : 600, fontSize: 29, color: state === 'wait' ? C.muted : C.ink}}>{label}</span>
    </div>
  );
};

export const S2 = {search: 100, compare: 126, open: 172, typeAt: [34, 39, 44, 49, 54, 59], pressSearch: 72, fan: 78, best: 124, clickCard: 148, pageIn: 150};

export const WorkWindow: React.FC<{f: number; dim?: number}> = ({f, dim = 0}) => {
  const st1 = f < S2.search ? 'active' : 'done';
  const st2 = f < S2.search ? 'wait' : f < S2.compare ? 'active' : 'done';
  const st3 = f < S2.compare ? 'wait' : f < S2.open ? 'active' : 'done';
  const phase = f < S2.search ? 0 : f < S2.compare ? 1 : f < S2.open ? 2 : 3;
  const bubbleAt = [-100, S2.search, S2.compare, S2.open][phase];
  const bubbleText = ['Searching beach stays', 'Comparing prices', 'Opening the booking page', 'Waiting for your OK to book.'][phase];
  const page = prog(f, S2.pageIn, S2.pageIn + 12, inOut);
  const query = typedWords('Beach, 2 nights, under AED 600', S2.typeAt, f);
  // agent cursor path (browser local coordinates)
  const kx = [[40, 900, 420], [58, 900, 420], [70, 820, 170], [72, 820, 170], [110, 700, 300], [128, 190, 180], [146, 190, 180], [150, 190, 180], [172, 230, 330], [190, 230, 330]];
  const cursorAt = () => {
    for (let i = 0; i < kx.length - 1; i++) {
      if (f >= kx[i][0] && f <= kx[i + 1][0]) {
        const t = inOut((f - kx[i][0]) / Math.max(1, kx[i + 1][0] - kx[i][0]));
        return [kx[i][1] + (kx[i + 1][1] - kx[i][1]) * t, kx[i][2] + (kx[i + 1][2] - kx[i][2]) * t];
      }
    }
    return f < kx[0][0] ? [kx[0][1], kx[0][2]] : [kx[kx.length - 1][1], kx[kx.length - 1][2]];
  };
  const [cx, cy] = cursorAt();
  const press = Math.max(prog(f, 71, 73) - prog(f, 74, 77), prog(f, 147, 149) - prog(f, 150, 153));
  const curA = prog(f, 40, 52);
  return (
    <Frame dim={dim}>
      <Sidebar idx={0} avatarId="w1" />
      {/* thread pane */}
      <div style={{position: 'absolute', left: PANE.x - WIN.x, top: 0, width: PANE.w, height: WIN.h, background: C.chatPaper}}>
        <HeaderGreen sub="your agent" avatar={<AgentAvatar size={64} id="w2" status={f >= S2.open ? 'needs-input' : 'working'} />} />
        <div style={{position: 'absolute', left: COL.x - PANE.x, top: COL.y - WIN.y, width: 398, height: 540}}>
          <ThreadTop f={f} />
          {phase === 0 && (
            <Bubble f={f} at={bubbleAt} top={364} time="">
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}><Spin size={26} f={f - 150} />{bubbleText}</span>
            </Bubble>
          )}
          {phase > 0 && phase < 3 && <Bubble f={f} at={bubbleAt} top={364} time=""><span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}><Spin size={26} f={f} />{bubbleText}</span></Bubble>}
          {phase === 3 && <Bubble f={f} at={bubbleAt} top={364} time="09:43">{bubbleText}</Bubble>}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.field, borderTop: `2px solid ${C.line}`}}>
          <div style={{position: 'absolute', left: 16, top: 20, width: 340, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`}}>
            <span style={{position: 'absolute', left: 22, top: 17, fontFamily: FONT.body, fontSize: 27, color: C.muted}}>Message</span>
          </div>
          <div style={{position: 'absolute', right: 16, top: 20, width: 68, height: 68, borderRadius: 34, background: C.chatHead}} />
        </div>
      </div>
      {/* its own computer */}
      <div style={{position: 'absolute', left: PANE.x + PANE.w - WIN.x, top: 0, width: WIN.w - (PANE.x + PANE.w - WIN.x) , height: WIN.h, background: C.white, borderLeft: `2px solid ${C.line}`}}>
        <div style={{position: 'absolute', left: 28, top: 22, display: 'flex', alignItems: 'center', gap: 16}}>
          <svg width={44} height={44} viewBox="0 0 44 44"><rect x={5} y={7} width={34} height={23} rx={4} fill="none" stroke={C.blue} strokeWidth={3.2} /><path d="M 14 38 H 30 M 22 30 V 38" stroke={C.blue} strokeWidth={3.2} strokeLinecap="round" /></svg>
          <div>
            <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.ink, lineHeight: '36px'}}>Its own computer</div>
            <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 22, color: C.muted, lineHeight: '26px'}}>Working for you</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 28, top: 120, width: 914, background: C.field, border: `2px solid ${C.line}`, borderRadius: 16, padding: '12px 24px', boxSizing: 'border-box'}}>
          <StepRow f={f} label="Searching beach stays" state={st1} popAt={S2.search} />
          <StepRow f={f} label="Comparing prices" state={st2} popAt={S2.compare} />
          <StepRow f={f} label="Opening the booking page" state={st3} popAt={S2.open} />
        </div>
        {/* mini browser */}
        <div style={{position: 'absolute', left: 28, top: 330, width: 914, height: 424, borderRadius: 16, border: `2px solid ${C.line}`, background: C.white, overflow: 'hidden', boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.field, borderBottom: `2px solid ${C.line}`}}>
            <svg width={120} height={56} style={{position: 'absolute', left: 14, top: 0}}><path d="M 28 18 L 16 28 L 28 38 M 70 18 L 82 28 L 70 38" fill="none" stroke={C.ink2} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{position: 'absolute', left: 130, top: 8, width: 600, height: 40, borderRadius: 20, background: C.white, border: `2px solid ${C.line}`, fontFamily: FONT.body, fontSize: 24, fontWeight: 500, color: C.ink2, lineHeight: '36px', paddingLeft: 20, boxSizing: 'border-box'}}>{page > 0.5 ? 'beach-stays.com/palm-bay' : 'beach-stays.com/search'}</div>
          </div>
          <div style={{position: 'absolute', left: 0, top: 56, right: 0, bottom: 0, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 914, height: 368, transform: `translateX(${-page * 914}px)`}}>
              <div style={{position: 'absolute', left: 24, top: 14, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.ink}}>{f < S2.fan ? 'Find a stay' : '3 beach stays'}</div>
              {f < S2.fan + 4 && (
                <div style={{position: 'absolute', left: 24, top: 78, width: 700, height: 64, borderRadius: 14, border: `2px solid ${C.line}`, background: C.field, fontFamily: FONT.body, fontWeight: 500, fontSize: 30, color: C.ink, lineHeight: '60px', paddingLeft: 20, boxSizing: 'border-box', opacity: 1 - prog(f, S2.fan - 2, S2.fan + 4)}}>{query || <span style={{color: C.muted}}>Where to?</span>}</div>
              )}
              {f < S2.fan + 4 && (
                <div style={{position: 'absolute', left: 744, top: 78, width: 146, height: 64, borderRadius: 14, background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 28, textAlign: 'center', lineHeight: '64px', opacity: 1 - prog(f, S2.fan - 2, S2.fan + 4), transform: `scale(${1 - 0.05 * press})`}}>Search</div>
              )}
              {f >= S2.fan - 2 && HOTELS.map((h, i) => {
                const p = out(prog(f, S2.fan + i * 3, S2.fan + i * 3 + 16));
                const fx = 20 + i * 297, fy = 66;
                const sx = 20 + 297, sy = 90;
                const dim2 = f >= S2.best && !h.best ? 0.5 : 1;
                const best = !!h.best && f >= S2.best;
                return (
                  <div key={h.name} style={{position: 'absolute', left: sx + (fx - sx) * p, top: sy + (fy - sy) * p, width: 280, borderRadius: 14, background: C.white, border: `2px solid ${best ? C.blue : C.line}`, overflow: 'hidden', boxSizing: 'border-box', opacity: Math.min(1, p * 3) * dim2, transform: `rotate(${(1 - p) * (i - 1) * 7}deg)`}}>
                    <Building tone={h.tone} tone2={h.tone2} seed={i} />
                    <div style={{padding: '8px 14px 12px'}}>
                      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.ink, lineHeight: '32px'}}>{h.name}</div>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2}}>
                        <span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: best || f < S2.search ? C.ink : C.ink}}>{h.price}<span style={{fontWeight: 500, fontSize: 20, color: C.muted}}> a night</span></span>
                        <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: FONT.body, fontWeight: 600, fontSize: 24}}><Star size={20} />{h.rate}</span>
                      </div>
                    </div>
                    {best && <div style={{position: 'absolute', left: 10, top: 10, background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 22, padding: '4px 12px', borderRadius: 8, opacity: prog(f, S2.best, S2.best + 6)}}>Best price</div>}
                  </div>
                );
              })}
              {/* booking page */}
              <div style={{position: 'absolute', left: 914 + 40, top: 16, width: 834}}><BookingPage /></div>
            </div>
          </div>
        </div>
        {curA > 0 && f < 500 && (
          <div style={{position: 'absolute', left: 28 + 2, top: 330 + 2, width: 910, height: 420, pointerEvents: 'none', overflow: 'hidden', opacity: curA}}>
            <Cursor x={cx} y={cy} press={press} />
            <div style={{position: 'absolute', left: cx + 30, top: cy + 38, background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 600, fontSize: 20, padding: '3px 12px', borderRadius: 8, whiteSpace: 'nowrap'}}>Headmaster</div>
          </div>
        )}
      </div>
    </Frame>
  );
};

// ---------- Scene 4 content ----------
export const MEM = {rowAt: [16, 26, 36], words: [130, 141, 148], send: 158, reply: 164, used: [168, 173, 178]};
const ROWS = [['Beach stays', 'Learned from 3 trips'], ['Late check-out', 'Learned from 2 trips'], ['Under AED 600 a night', 'You said it once']];

export const MemoryWindow: React.FC<{f: number}> = ({f}) => {
  const idx = 1 + prog(f, 4, 20, inOut);
  const text = typedWords('Book the usual.', MEM.words, f);
  const sent = f >= MEM.send;
  const caret = !sent && f >= 120 && Math.floor(f / 8) % 2 === 0;
  const tap = prog(f, MEM.send - 2, MEM.send + 12);
  return (
    <Frame>
      <Sidebar idx={idx} avatarId="m1" />
      <div style={{position: 'absolute', left: SIDE, top: 0, right: 0, bottom: 0}}>
        <div style={{position: 'absolute', left: 64, top: 34, fontFamily: FONT.display, fontWeight: 800, fontSize: 56, color: C.ink, letterSpacing: '-0.02em'}}>Memory</div>
        <div style={{position: 'absolute', left: 64, top: 108, fontFamily: FONT.body, fontWeight: 500, fontSize: 28, color: C.ink2}}>What Headmaster remembers about you</div>
        {ROWS.map((r, i) => {
          const e = out(prog(f, MEM.rowAt[i], MEM.rowAt[i] + 18));
          const used = prog(f, MEM.used[i], MEM.used[i] + 8);
          return (
            <div key={r[0]} style={{position: 'absolute', left: 64, top: 168 + i * 112, width: 1310, height: 96, borderRadius: 18, background: C.white, border: `2px solid ${used > 0 ? C.blue : C.line}`, boxSizing: 'border-box', opacity: e, transform: `translateX(${(1 - e) * -90}px)`, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 24}}>
              <div style={{width: 12, height: 44, borderRadius: 6, background: C.blue}} />
              <span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.ink, flex: 1}}>{r[0]}</span>
              <span style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 26, color: C.muted}}>{r[1]}</span>
              <span style={{width: 96, textAlign: 'right', fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.blue, opacity: used}}>Used</span>
            </div>
          );
        })}
        {f >= MEM.reply && (() => {
          const e = out(prog(f, MEM.reply, MEM.reply + 14));
          return (
            <div style={{position: 'absolute', left: 64, top: 512, display: 'flex', alignItems: 'center', gap: 16, opacity: e, transform: `translateY(${(1 - e) * 18}px)`}}>
              <AgentAvatar size={56} id="m2" bg={C.ground} status="working" />
              <div style={{background: C.ground, borderRadius: '22px 22px 22px 6px', padding: '14px 24px', fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: C.ink}}>Booking the usual: beach stay, late check-out, under AED 600 a night.</div>
            </div>
          );
        })()}
        <div style={{position: 'absolute', left: 64, top: 626, width: 1310, height: 92, borderRadius: 46, background: C.white, border: `2px solid ${C.line}`, boxSizing: 'border-box'}}>
          {!text && !sent && <span style={{position: 'absolute', left: 36, top: 24, fontFamily: FONT.body, fontSize: 34, color: C.muted}}>Ask Headmaster</span>}
          {!sent && <span style={{position: 'absolute', left: 36, top: 22, fontFamily: FONT.body, fontWeight: 500, fontSize: 36, color: C.ink, lineHeight: '44px', whiteSpace: 'nowrap'}}>{text}{caret && <i style={{display: 'inline-block', width: 3, height: 36, background: C.blue, marginLeft: 3, verticalAlign: -6}} />}</span>}
          {sent && <span style={{position: 'absolute', left: 36, top: 24, fontFamily: FONT.body, fontSize: 34, color: C.muted}}>Ask Headmaster</span>}
          <div style={{position: 'absolute', right: 12, top: 12, width: 64, height: 64, borderRadius: 32, background: C.blue, display: 'grid', placeItems: 'center', transform: `scale(${1 - 0.1 * (tap > 0 && tap < 0.3 ? 1 : 0)})`}}>
            <svg width={30} height={30} viewBox="0 0 30 30"><path d="M 4 15 L 26 15 M 17 6 L 26 15 L 17 24" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          {tap > 0 && tap < 1 && <div style={{position: 'absolute', right: 12 + 32 - (30 + 40 * out(tap)), top: 12 + 32 - (30 + 40 * out(tap)), width: 60 + 80 * out(tap), height: 60 + 80 * out(tap), borderRadius: '50%', border: `4px solid ${C.blue}`, opacity: 0.5 * (1 - tap), boxSizing: 'border-box'}} />}
        </div>
      </div>
    </Frame>
  );
};
