import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Laptop, Monitor, PhoneBody} from './Devices';
import {Check, Eyebrow, Headline, Subs} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, GREEN, STUDIO, ThreadDone} from './ThreadUI';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// ---------------------------------------------------------------- scene 5: anywhere
const DESK = 864;
const CX = {p1: 300, lap: 1120, mon: 2220, p2: 2980};
const SPAN: [string, number, number][] = [['p1', 0, 92], ['lap', 92, 125], ['mon', 125, 143], ['p2', 143, 176]];

const Plate: React.FC<{cx: number; label: string; lit: number}> = ({cx, label, lit}) => (
  <div style={{position: 'absolute', left: cx - 160, top: DESK + 40, width: 320, height: 68, borderRadius: 16, boxSizing: 'border-box', background: lit > 0.5 ? C.blue : C.white, border: `2px solid ${lit > 0.5 ? C.blue : C.line}`, color: lit > 0.5 ? '#fff' : C.ink, fontFamily: FONT.body, fontWeight: 700, fontSize: 36, display: 'grid', placeItems: 'center'}}>{label}</div>
);

export const Anywhere: React.FC = () => {
  const f = useCurrentFrame();
  const L = 1300 * prog(f, 112, 148, inOut);
  const rise = (i: number) => out(prog(f, 2 + i * 5, 2 + i * 5 + 24));
  const lit = (k: string) => {
    const [, a, b] = SPAN.find((s) => s[0] === k)!;
    return clamp(prog(f, a - 3, a + 3) - prog(f, b - 3, b + 3) + prog(f, 176, 184));
  };
  const dev = (k: string, i: number): React.CSSProperties => ({position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, opacity: Math.min(1, rise(i) * 2), transform: `translateY(${(1 - rise(i)) * 150}px)`, pointerEvents: 'none'});
  const dimOf = (k: string) => 0.45 * (1 - lit(k));
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, transform: `translateX(${-L * 0.6}px)`}}>
      </div>
      <div style={{position: 'absolute', left: 0, top: DESK, width: 1920, height: 300, background: C.ground2}} />
      <div style={{position: 'absolute', left: 0, top: DESK - 2, width: 1920, height: 12, background: C.ground3}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, transform: `translateX(${-L}px)`}}>
        <div style={dev('p1', 0)}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, transformOrigin: `${CX.p1}px ${DESK}px`, transform: `scale(${1 + 0.03 * lit('p1')})`}}>
            <PhoneBody x={CX.p1 - 178} y={DESK - 730 + 6} scale={0.83} id="s5a" dim={dimOf('p1')}><ThreadDone f={f} skin={GREEN} /></PhoneBody>
          </div>
        </div>
        <div style={dev('lap', 1)}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, transformOrigin: `${CX.lap}px ${DESK}px`, transform: `scale(${1 + 0.03 * lit('lap')})`}}>
            <Laptop cx={CX.lap} deskY={DESK} dim={dimOf('lap')}><ThreadDone f={f} skin={GREEN} edge={24} maxWidth={440} /></Laptop>
          </div>
        </div>
        <div style={dev('mon', 2)}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, transformOrigin: `${CX.mon}px ${DESK}px`, transform: `scale(${1 + 0.03 * lit('mon')})`}}>
            <Monitor cx={CX.mon} deskY={DESK} dim={dimOf('mon')}><ThreadDone f={f} skin={STUDIO} edge={10} maxWidth={420} /></Monitor>
          </div>
        </div>
        <div style={dev('p2', 3)}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 3400, height: 1080, transformOrigin: `${CX.p2}px ${DESK}px`, transform: `scale(${1 + 0.03 * lit('p2')})`}}>
            <PhoneBody x={CX.p2 - 178} y={DESK - 730 + 6} scale={0.83} studio id="s5b" dim={dimOf('p2')}><ThreadDone f={f} skin={STUDIO} /></PhoneBody>
          </div>
        </div>
        <Plate cx={CX.p1} label="WhatsApp" lit={lit('p1')} />
        <Plate cx={CX.lap} label="Laptop" lit={lit('lap')} />
        <Plate cx={CX.mon} label="Browser" lit={lit('mon')} />
        <Plate cx={CX.p2} label="iPhone" lit={lit('p2')} />
      </div>
      <Headline at={4} a="Wherever" b="you are." eyebrow="For you" />
      <Subs id="anywhere" bottom={30} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 6: overnight
const DARK = '#1d2028';
const EDGE = '#323744';
const JOBS = ['Summarise 40 emails', 'Draft the proposal', 'Tidy the client list'];
const DOING: [number, number][] = [[52, 60], [70, 78], [88, 96]];
const DONE: [number, number][] = [[66, 74], [84, 92], [100, 108]];
const CLOCK = ['23:40', '01:15', '03:30', '05:45'];
const CLOCK_AT = [66, 84, 100];
const COLX = [140, 700, 1260];
const SLOT = (i: number) => 330 + i * 140;

const JobCard: React.FC<{f: number; j: number}> = ({f, j}) => {
  const enter = out(prog(f, 12 + j * 8, 12 + j * 8 + 18));
  const d = inOut(prog(f, DOING[j][0], DOING[j][1]));
  const e = inOut(prog(f, DONE[j][0], DONE[j][1]));
  const x = COLX[0] + 20 + (COLX[1] - COLX[0]) * d + (COLX[2] - COLX[1]) * e;
  const y = SLOT(j) + (SLOT(0) - SLOT(j)) * d + (SLOT(j) - SLOT(0)) * e;
  const state = f >= DONE[j][1] ? 'done' : f >= DOING[j][0] ? 'doing' : 'todo';
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - enter) * 40, width: 480, height: 116, borderRadius: 18, background: '#272b36', border: `2px solid ${state === 'doing' ? C.blue : EDGE}`, boxSizing: 'border-box', opacity: enter, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 20}}>
      <span style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 35, color: '#fff', flex: 1, whiteSpace: 'nowrap'}}>{JOBS[j]}</span>
      {state === 'done' && <Check size={38} pop={0.7 + 0.3 * out(prog(f, DONE[j][1], DONE[j][1] + 8))} />}
      {state === 'doing' && (
        <svg width={38} height={38} viewBox="0 0 26 26"><circle cx={13} cy={13} r={10} fill="none" stroke={EDGE} strokeWidth={4} /><path d="M 13 3 A 10 10 0 0 1 23 13" fill="none" stroke="#7d7dff" strokeWidth={4} strokeLinecap="round" transform={`rotate(${(f * 14) % 360} 13 13)`} /></svg>
      )}
      {state === 'todo' && <svg width={38} height={38}><circle cx={19} cy={19} r={14} fill="none" stroke={EDGE} strokeWidth={3.5} /></svg>}
    </div>
  );
};

const Clock: React.FC<{f: number}> = ({f}) => {
  let idx = 0;
  CLOCK_AT.forEach((a, i) => { if (f >= a) idx = i + 1; });
  const p = idx === 0 ? 1 : inOut(prog(f, CLOCK_AT[idx - 1], CLOCK_AT[idx - 1] + 9));
  const row = (t: string, y: number, o: number) => <div style={{position: 'absolute', left: 0, top: y, opacity: o, fontFamily: FONT.display, fontWeight: 800, fontSize: 120, letterSpacing: '-0.02em', color: '#fff', lineHeight: '120px', whiteSpace: 'nowrap'}}>{t}</div>;
  return (
    <div style={{position: 'absolute', left: 1330, top: 56, display: 'flex', alignItems: 'center', gap: 26}}>
      <svg width={74} height={86} viewBox="0 0 74 86"><path d="M 46 6 A 38 38 0 1 0 70 62 A 30 30 0 0 1 46 6 Z" fill="#fff" /></svg>
      <div style={{position: 'relative', width: 400, height: 120, overflow: 'hidden'}}>
        {row(CLOCK[idx], -(p) * 0 + (1 - p) * 120, p)}
        {idx > 0 && row(CLOCK[idx - 1], -p * 120, 1 - p)}
      </div>
    </div>
  );
};

const Night: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: C.dark}}>
    <Clock f={f} />
    <Eyebrow at={2} y={16}><span style={{color: '#8c8cff'}}>At work</span></Eyebrow>
    <div style={{position: 'absolute', left: 110, top: 54}}>
      <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 80, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap', opacity: prog(f, 4, 22), transform: `translateY(${(1 - out(prog(f, 4, 24))) * 30}px)`}}>It works <span style={{color: '#8c8cff'}}>while you sleep.</span></div>
    </div>
    {['To do', 'Doing', 'Done'].map((t, i) => (
      <div key={t} style={{position: 'absolute', left: COLX[i], top: 230, width: 520, height: 640, borderRadius: 22, background: DARK, border: `2px solid ${EDGE}`, boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', left: 28, top: 24, fontFamily: FONT.body, fontWeight: 700, fontSize: 34, color: '#c9ccd8'}}>{t}</div>
      </div>
    ))}
    {JOBS.map((_, j) => <JobCard key={j} f={f} j={j} />)}
  </div>
);

const Day: React.FC<{f: number}> = ({f}) => {
  const buzz = f >= 144 && f < 152 ? (f % 2 === 0 ? 4 : -4) : 0;
  const t0 = 146;
  return (
    <div style={{position: 'absolute', left: 0, top: 1080, width: 1920, height: 1080, background: C.ground}}>
      <Eyebrow at={0} y={16}>At work</Eyebrow>
      <div style={{position: 'absolute', left: 110, top: 54, fontFamily: FONT.display, fontWeight: 800, fontSize: 80, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap'}}>It works <span style={{color: C.blue}}>while you sleep.</span></div>
      <div style={{position: 'absolute', left: 190, top: 868, width: 1540, height: 240, background: C.ground3}} />
      <div style={{position: 'absolute', left: 210, top: 884, width: 1500, height: 100, borderRadius: 10, border: `3px solid ${C.ground2}`, boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: 900, top: 924, width: 120, height: 14, borderRadius: 7, background: C.ground2}} />
      <div style={{position: 'absolute', left: 170, top: 850, width: 1580, height: 18, background: C.white, border: `2px solid ${C.line}`, boxSizing: 'border-box'}} />
      {/* alarm clock */}
      <div style={{position: 'absolute', left: 330, top: 640, width: 330, height: 212}}>
        <div style={{position: 'absolute', left: 36, top: 0, width: 64, height: 40, borderRadius: '32px 32px 0 0', background: C.ground3}} />
        <div style={{position: 'absolute', left: 230, top: 0, width: 64, height: 40, borderRadius: '32px 32px 0 0', background: C.ground3}} />
        <div style={{position: 'absolute', left: 0, top: 24, width: 330, height: 178, borderRadius: 40, background: C.white, border: `3px solid ${C.line}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center'}}>
          <div style={{width: 262, height: 118, borderRadius: 20, background: C.dark, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 84, color: '#fff', letterSpacing: '-0.01em'}}>07:30</div>
        </div>
        <div style={{position: 'absolute', left: 48, top: 196, width: 26, height: 16, background: C.ground3}} />
        <div style={{position: 'absolute', left: 256, top: 196, width: 26, height: 16, background: C.ground3}} />
      </div>
      {/* lamp */}
      <div style={{position: 'absolute', left: 1640, top: 520, width: 200, height: 340}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 200, height: 130, background: C.white, border: `3px solid ${C.line}`, boxSizing: 'border-box', clipPath: 'polygon(14% 0, 86% 0, 100% 100%, 0 100%)'}} />
        <div style={{position: 'absolute', left: 94, top: 130, width: 14, height: 190, background: C.ink2}} />
        <div style={{position: 'absolute', left: 40, top: 316, width: 122, height: 24, borderRadius: '60px 60px 0 0', background: C.ink2}} />
      </div>
      <PhoneBody x={1090} y={132} scale={0.84} id="s6p" buzz={buzz}>
        <Bubble f={f} at={t0} top={22} time="07:30">Good morning. 3 jobs done overnight.</Bubble>
        <Bubble f={f} at={t0 + 12} top={150} time="">
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {JOBS.map((t) => (
              <span key={t} style={{display: 'inline-flex', alignItems: 'center', gap: 10}}><Check size={26} />{t}</span>
            ))}
          </div>
        </Bubble>
      </PhoneBody>
    </div>
  );
};

export const Overnight: React.FC = () => {
  const f = useCurrentFrame();
  const ty = -1080 * inOut(prog(f, 112, 144));
  return (
    <AbsoluteFill style={{background: C.dark, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 2160, transform: `translateY(${ty}px)`}}>
        <Night f={f} />
        <Day f={f} />
      </div>
      <Subs id="overnight" bottom={30} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 7: profiles
const PCX = [350, 960, 1570];
const PNAMES = ['Ada', 'Milo', 'Juno'];
const PJOB = ['Orders', 'Money', 'Writing'];
const ACTIVE: [number, number][] = [[116, 164], [164, 206], [206, 262]];

const PHead: React.FC<{i: number}> = ({i}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22}}>
    <div style={{width: 64, height: 64, borderRadius: 32, background: C.ground, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.blue}}>{PNAMES[i][0]}</div>
    <div>
      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 32, color: C.ink, lineHeight: '36px'}}>{PNAMES[i]}</div>
      <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 24, color: C.blue, lineHeight: '28px'}}>{PJOB[i]}</div>
    </div>
  </div>
);

const Stat: React.FC<{n: string; label: string}> = ({n, label}) => (
  <div style={{display: 'flex', gap: 20, alignItems: 'baseline', padding: '12px 0', borderTop: `2px solid ${C.line}`}}>
    <span style={{width: 84, fontFamily: FONT.display, fontWeight: 800, fontSize: 56, letterSpacing: '-0.02em', color: C.blue, lineHeight: '64px'}}>{n}</span>
    <span style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 32, color: C.ink}}>{label}</span>
  </div>
);

const Row: React.FC<{a: string; b: string}> = ({a, b}) => (
  <div style={{display: 'flex', gap: 18, alignItems: 'baseline', padding: '13px 0', borderTop: `2px solid ${C.line}`, fontFamily: FONT.body, fontSize: 29}}>
    <span style={{width: 84, color: C.muted, fontWeight: 600, fontSize: 26}}>{a}</span><span style={{fontWeight: 600, color: C.ink}}>{b}</span>
  </div>
);

const Bar: React.FC<{label: string; amt: number; w: number}> = ({label, amt, w}) => (
  <div style={{padding: '12px 0', borderTop: `2px solid ${C.line}`}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.body, fontWeight: 600, fontSize: 28, color: C.ink}}><span>{label}</span><span>AED {amt.toLocaleString('en-US')}</span></div>
    <div style={{height: 16, borderRadius: 8, background: C.ground, marginTop: 8}}><div style={{height: 16, borderRadius: 8, background: C.blue, width: `${w}%`}} /></div>
  </div>
);

export const Profiles: React.FC = () => {
  const f = useCurrentFrame();
  const rise = (i: number) => out(prog(f, 4 + i * 8, 4 + i * 8 + 24));
  const act = (i: number) => clamp(prog(f, ACTIVE[i][0] - 4, ACTIVE[i][0] + 4) - prog(f, ACTIVE[i][1] - 4, ACTIVE[i][1] + 4));
  const anyActive = clamp(act(0) + act(1) + act(2));
  const ax = PCX[0] * act(0) + PCX[1] * act(1) + PCX[2] * act(2) + 960 * (1 - anyActive);
  const push = 1 + 0.06 * prog(f, 10, 232, inOut);
  const base = [0.96, 1, 0.96];
  const depth = [150, 90, 190];
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${960 + (ax - 960) * 0.5}px 600px`, transform: `scale(${push})`}}>
        {[0, 1, 2].map((i) => {
          const s = base[i] * (1 + 0.06 * act(i));
          const dim = anyActive > 0 ? 1 - 0.3 * (1 - act(i)) * anyActive : 1;
          return (
            <div key={i} style={{position: 'absolute', left: PCX[i] - 260, top: 0, width: 520, height: 1080, opacity: Math.min(1, rise(i) * 2) * dim, transform: `translateY(${(1 - rise(i)) * depth[i]}px)`}}>
              <div style={{position: 'absolute', left: 0, top: 184, width: 520, textAlign: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.02em', color: act(i) > 0.5 ? C.blue : C.ink, transform: `scale(${1 + 0.06 * act(i)})`}}>{PNAMES[i]}</div>
              <div style={{position: 'absolute', left: 0, top: 300, width: 520, height: 620, transformOrigin: '50% 50%', transform: `scale(${s})`}}>
                <div style={{position: 'absolute', left: 14, top: 16, width: 520, height: 620, borderRadius: 24, background: C.ground3}} />
                <div style={{position: 'absolute', left: 0, top: 0, width: 520, height: 620, borderRadius: 24, background: C.white, border: `2px solid ${act(i) > 0.5 ? C.blue : C.line}`, boxSizing: 'border-box', padding: '30px 34px'}}>
                  <PHead i={i} />
                  {i === 0 && (
                    <>
                      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.ink2, marginBottom: 8}}>Today</div>
                      <Stat n="12" label="orders" /><Stat n="3" label="to ship" /><Stat n="1" label="refund" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.ink2, marginBottom: 8}}>This month, AED 18,400</div>
                      <Bar label="Sales" amt={18400} w={100} /><Bar label="Supplies" amt={6900} w={37.5} /><Bar label="Rent" amt={4500} w={24.5} /><Bar label="Ads" amt={1800} w={9.8} />
                      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 14, borderTop: `2px solid ${C.ink}`, fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.ink}}><span>Left over</span><span style={{color: C.blue}}>AED 5,200</span></div>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.ink, lineHeight: '42px', marginBottom: 14}}>Weekend sale post</div>
                      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 28, lineHeight: '40px', color: C.ink2}}>Our weekend sale starts Friday. Gift boxes are 20% off for two days. Come and say hello.<span style={{display: 'inline-block', width: 3, height: 30, background: C.blue, marginLeft: 3, verticalAlign: -5}} /></div>
                      <div style={{position: 'absolute', left: 34, bottom: 30, fontFamily: FONT.body, fontWeight: 600, fontSize: 24, color: C.muted}}>Draft, 17 words</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Headline at={4} a="A profile for" b="each job." eyebrow="For your business" />
      <Subs id="profiles" bottom={30} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scene 10: close
export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const hop = (() => { const t = clamp((f - 6) / 15); return t > 0 && t < 1 ? -Math.sin(t * Math.PI) * 60 : 0; })();
  const enter = out(prog(f, 0, 14));
  const zoom = 1 - 0.06 * prog(f, 0, 186, inOut);
  const url = prog(f, 100, 118);
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '960px 500px', transform: `scale(${zoom})`}}>
        <div style={{position: 'absolute', left: 0, top: 150, width: 1920, display: 'flex', justifyContent: 'center', opacity: enter, transform: `translateY(${hop + (1 - enter) * 40}px)`}}>
          <Img src={staticFile('headmaster-mark-ink.svg')} style={{height: 210, width: (210 * 898) / 983, display: 'block'}} />
        </div>
        <div style={{position: 'absolute', left: 0, top: 400, width: 1920, display: 'flex', justifyContent: 'center'}}>
          <Wordmark f={f} />
        </div>
        <div style={{position: 'absolute', left: 0, top: 690, width: 1920, display: 'flex', justifyContent: 'center'}}>
          <Tag f={f} />
        </div>
        <div style={{position: 'absolute', left: 0, top: 840, width: 1920, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 40, color: C.ink2, opacity: url, transform: `translateY(${(1 - url) * 10}px)`}}>headmaster.gcaplabs.com</div>
      </div>
      <Subs id="close" bottom={30} />
    </AbsoluteFill>
  );
};

const Wordmark: React.FC<{f: number}> = ({f}) => {
  const e = out(prog(f, 14, 38));
  return (
    <div style={{overflow: 'hidden', paddingBottom: 20, marginBottom: -20}}>
      <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 250, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1.04, transform: `translateY(${(1 - e) * 250}px)`}}>Headmaster.</div>
    </div>
  );
};

const Tag: React.FC<{f: number}> = ({f}) => {
  const words = ['Your', 'own', 'agent,', 'always', 'on.'];
  return (
    <div style={{display: 'flex', gap: 22, fontFamily: FONT.display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.02em', color: C.blue}}>
      {words.map((w, i) => {
        const e = out(prog(f, 44 + i * 5, 44 + i * 5 + 16));
        return <span key={w} style={{opacity: e, transform: `translateY(${(1 - e) * 24}px)`, display: 'inline-block'}}>{w}</span>;
      })}
    </div>
  );
};
