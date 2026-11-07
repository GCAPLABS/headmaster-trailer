import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AgentAvatar} from './Agent';
import {BookingPage, Frame, SIDE, Sidebar} from './AppWin';
import {Bubble, HeaderGreen} from './ThreadUI';
import {Check, Cursor, Headline, Spin, Subs} from './kit';
import {C, FONT, inOut, out, prog} from './theme';
import {Card, Stage, T, cue} from './Scenes3';

const GREEN = C.chatHead;

// Position along a list of [frame, x, y] waypoints, eased between neighbours.
const along = (pts: number[][], f: number): [number, number] => {
  if (f <= pts[0][0]) return [pts[0][1], pts[0][2]];
  for (let i = 0; i < pts.length - 1; i++) {
    if (f <= pts[i + 1][0]) {
      const t = inOut((f - pts[i][0]) / Math.max(1, pts[i + 1][0] - pts[i][0]));
      return [pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t, pts[i][2] + (pts[i + 1][2] - pts[i][2]) * t];
    }
  }
  const l = pts[pts.length - 1];
  return [l[1], l[2]];
};
const pulse = (f: number, at: number) => prog(f, at - 3, at) - prog(f, at + 1, at + 5);

const Monitor44: React.FC = () => (
  <svg width={44} height={44} viewBox="0 0 44 44"><rect x={5} y={7} width={34} height={23} rx={4} fill="none" stroke={C.blue} strokeWidth={3.2} /><path d="M 14 38 H 30 M 22 30 V 38" stroke={C.blue} strokeWidth={3.2} strokeLinecap="round" /></svg>
);

const CursorLabel: React.FC<{x: number; y: number; text: string; bg: string; o: number}> = ({x, y, text, bg, o}) => (
  <div style={{position: 'absolute', left: x + 30, top: y + 38, background: bg, color: '#fff', fontFamily: FONT.body, fontWeight: 600, fontSize: 20, padding: '3px 12px', borderRadius: 8, whiteSpace: 'nowrap', opacity: o}}>{text}</div>
);

// ------------------------------------------------------------ V2: watch it, or take over
export const Takeover: React.FC = () => {
  const f = useCurrentFrame();
  const TAP = 100;
  const W = 1620;
  const H = 740;
  const enter = out(prog(f, 0, 20));
  const control = f >= TAP + 2;
  const scroll = 220 * inOut(prog(f, 122, 172));
  const [ax, ay] = along([[16, 1400, 520], [38, 330, 238], [58, 560, 352], [78, 900, 412], [96, 330, 508]], f);
  const aO = prog(f, 14, 24) * (1 - prog(f, TAP + 2, TAP + 12));
  const [ux, uy] = along([[88, 1560, 700], [TAP - 1, 1442, 46], [TAP + 8, 1442, 46], [TAP + 28, 880, 410], [TAP + 70, 900, 470]], f);
  const uO = prog(f, 86, 94);
  const press = pulse(f, TAP);
  const ring = (f % 36) / 36;
  const drive = control ? 1 : 0;
  const extras = ['Breakfast included', 'Beach towels at the door', 'Late check-out on request'];
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage origin="960px 560px" transform={`scale(${1 + 0.03 * prog(f, 0, 190, inOut)})`}>
        <div style={{position: 'absolute', left: 150, top: 190, width: W, height: H, opacity: Math.min(1, enter * 2), transform: `translateY(${(1 - enter) * 60}px)`}}>
          <div style={{position: 'absolute', left: 14, top: 16, width: W, height: H, borderRadius: 24, background: C.ground3}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, borderRadius: 24, background: C.white, border: `3px solid ${control ? GREEN : C.line}`, boxSizing: 'border-box', overflow: 'hidden'}}>
            {/* title bar */}
            <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 100, background: C.field, borderBottom: `2px solid ${C.line}`}}>
              <div style={{position: 'absolute', left: 28, top: 18}}><AgentAvatar size={64} id="tk1" bg={C.ground} status={control ? 'idle' : 'working'} /></div>
              <div style={{position: 'absolute', left: 112, top: 14, display: 'flex', alignItems: 'center', gap: 12}}>
                <Monitor44 />
                <div>
                  <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 34, color: C.ink, lineHeight: '38px'}}>Its own computer</div>
                  <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 22, color: C.muted, lineHeight: '28px'}}>{control ? 'Paused while you drive' : 'Working on your booking'}</div>
                </div>
              </div>
              <div style={{position: 'absolute', left: 470, top: 28, display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 18px 0 14px', borderRadius: 22, background: C.white, border: `2px solid ${C.line}`, boxSizing: 'border-box'}}>
                <div style={{position: 'relative', width: 16, height: 16}}>
                  <div style={{position: 'absolute', inset: 0, borderRadius: 8, background: GREEN}} />
                  <div style={{position: 'absolute', inset: 0, borderRadius: 8, border: `2px solid ${GREEN}`, boxSizing: 'border-box', opacity: 1 - ring, transform: `scale(${1 + ring * 1.2})`}} />
                </div>
                <span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 22, letterSpacing: '0.06em', color: C.ink}}>LIVE</span>
              </div>
              {control && (() => {
                const e = out(prog(f, TAP + 2, TAP + 14));
                return (
                  <div style={{position: 'absolute', right: 330, top: 24, height: 52, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px 0 14px', borderRadius: 26, background: '#e7f4ec', border: `2px solid ${GREEN}`, boxSizing: 'border-box', opacity: e, transform: `scale(${0.9 + 0.1 * e})`, transformOrigin: '100% 50%'}}>
                    <Check size={28} />
                    <span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: GREEN, whiteSpace: 'nowrap'}}>You're in control</span>
                  </div>
                );
              })()}
              <div style={{position: 'absolute', right: 40, top: 18, width: 250, height: 64, borderRadius: 16, boxSizing: 'border-box', background: drive ? C.white : C.blue, border: `3px solid ${drive ? GREEN : C.blue}`, color: drive ? GREEN : '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 30, display: 'grid', placeItems: 'center', transform: `scale(${1 - 0.06 * press})`}}>{drive ? 'Hand back' : 'Take over'}</div>
            </div>
            {/* browser */}
            <div style={{position: 'absolute', left: 28, top: 124, width: W - 56, height: H - 124 - 28, borderRadius: 16, border: `2px solid ${C.line}`, boxSizing: 'border-box', overflow: 'hidden', background: C.white}}>
              <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 56, background: C.field, borderBottom: `2px solid ${C.line}`}}>
                <svg width={120} height={56} style={{position: 'absolute', left: 14, top: 0}}><path d="M 28 18 L 16 28 L 28 38 M 70 18 L 82 28 L 70 38" fill="none" stroke={C.ink2} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{position: 'absolute', left: 130, top: 8, width: 600, height: 40, borderRadius: 20, background: C.white, border: `2px solid ${C.line}`, fontFamily: FONT.body, fontSize: 24, fontWeight: 500, color: C.ink2, lineHeight: '36px', paddingLeft: 20, boxSizing: 'border-box'}}>beach-stays.com/palm-bay</div>
              </div>
              <div style={{position: 'absolute', left: 0, top: 56, right: 0, bottom: 0, overflow: 'hidden'}}>
                <div style={{position: 'absolute', left: 80, top: 30 - scroll}}>
                  <BookingPage k={1.2} />
                  <div style={{marginTop: 52, width: 1000, borderTop: `2px solid ${C.line}`, paddingTop: 22}}>
                    <T size={36} weight={800} font={FONT.display}>What is included</T>
                    {extras.map((t) => (
                      <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, height: 66, borderTop: `2px solid ${C.line}`, marginTop: 14}}>
                        <Check size={32} /><T size={32} weight={600}>{t}</T>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {aO > 0 && (<div style={{position: 'absolute', inset: 0, opacity: aO, pointerEvents: 'none'}}><Cursor x={ax} y={ay} />
              <CursorLabel x={ax} y={ay} text="Headmaster" bg={C.blue} o={1} /></div>)}
            {uO > 0 && (<div style={{position: 'absolute', inset: 0, opacity: uO, pointerEvents: 'none'}}><Cursor x={ux} y={uy} press={press} fill={GREEN} scale={1.1} />
              <CursorLabel x={ux} y={uy} text="You" bg={GREEN} o={1} /></div>)}
          </div>
        </div>
      </Stage>
      <Headline at={4} a="Watch it, or" b="take over." eyebrow="For you" />
      <Subs id="takeover" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ V3: hand it the busywork
const WEEKS: [string, number][] = [['W1', 8200], ['W2', 9600], ['W3', 6400], ['W4', 9200]];
const TOTAL = WEEKS.reduce((a, w) => a + w[1], 0);
const fmt = (n: number) => n.toLocaleString('en-US');

const FileChip: React.FC = () => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: C.white, border: `2px solid ${C.line}`, borderRadius: 14, padding: '8px 16px 8px 10px', marginBottom: 10}}>
    <svg width={44} height={52} viewBox="0 0 44 52"><rect x={2} y={2} width={40} height={48} rx={8} fill={GREEN} /><path d="M 11 16 H 33 M 11 26 H 33 M 11 36 H 33 M 22 14 V 40" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" /></svg>
    <div>
      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 25, color: C.ink, lineHeight: '30px'}}>Sales-October.xlsx</div>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 20, color: C.muted, lineHeight: '24px'}}>18 KB</div>
    </div>
  </div>
);

const Report: React.FC<{f: number; at: number}> = ({f, at}) => {
  const e = out(prog(f, at, at + 18));
  const bar = (i: number) => out(prog(f, at + 14 + i * 5, at + 34 + i * 5));
  const line = (i: number) => out(prog(f, at + 40 + i * 8, at + 54 + i * 8));
  const CH = 200;
  const bx = (i: number) => 10 + i * 80;
  const lines = ['Sales up 12% on September', 'Best seller: gift boxes', 'Slow week: week 3'];
  return (
    <div style={{position: 'absolute', left: 170, top: 36, width: 540, height: 610, opacity: Math.min(1, e * 2), transform: `translateY(${(1 - e) * 50}px)`}}>
      <div style={{position: 'absolute', left: 14, top: 16, width: 540, height: 610, borderRadius: 14, background: C.ground3}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 610, borderRadius: 14, background: C.white, border: `2px solid ${C.line}`, boxSizing: 'border-box', padding: '38px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <T size={46} weight={800} font={FONT.display} style={{flex: 1, letterSpacing: '-0.02em'}}>October sales</T>
          <div style={{background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 22, padding: '4px 14px', borderRadius: 8, opacity: prog(f, at + 24, at + 32), transform: `scale(${0.8 + 0.2 * out(prog(f, at + 24, at + 34))})`}}>1 page</div>
        </div>
        <T size={28} weight={600} color={C.ink2} style={{marginTop: 8}}>Total AED {fmt(TOTAL)}</T>
        <div style={{position: 'relative', height: 280, marginTop: 14}}>
          <T size={22} weight={600} color={C.muted} style={{position: 'absolute', left: 0, top: 0}}>Weekly sales, AED</T>
          <div style={{position: 'absolute', left: 0, right: 0, top: 266, height: 2, background: C.line}} />
          <div style={{position: 'absolute', left: 340, top: 40, width: 2, height: 226, background: C.line}} />
          {WEEKS.map((w, i) => {
            const h = (w[1] / 10000) * CH * bar(i);
            return (
              <React.Fragment key={w[0]}>
                <div style={{position: 'absolute', left: bx(i), top: 266 - h, width: 62, height: h, borderRadius: '8px 8px 0 0', background: i === 2 ? C.ground3 : C.blue}} />
                <div style={{position: 'absolute', left: bx(i) - 8, width: 78, top: 266 - h - 28, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 20, color: C.ink2, opacity: bar(i)}}>{fmt(w[1])}</div>
                <div style={{position: 'absolute', left: bx(i), width: 62, top: 274, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 20, color: C.muted}}>{w[0]}</div>
              </React.Fragment>
            );
          })}
          {(() => {
            const h = (CH + 12) * bar(4);
            return (
              <>
                <div style={{position: 'absolute', left: 372, top: 266 - h, width: 88, height: h, borderRadius: '8px 8px 0 0', background: C.ink}} />
                <div style={{position: 'absolute', left: 364, width: 104, top: 266 - h - 28, textAlign: 'center', fontFamily: FONT.body, fontWeight: 700, fontSize: 20, color: C.ink, opacity: bar(4)}}>{fmt(TOTAL)}</div>
                <div style={{position: 'absolute', left: 372, width: 88, top: 274, textAlign: 'center', fontFamily: FONT.body, fontWeight: 700, fontSize: 20, color: C.ink}}>Total</div>
              </>
            );
          })()}
        </div>
        <div style={{marginTop: 22}}>
          {lines.map((t, i) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 44, opacity: line(i), transform: `translateY(${(1 - line(i)) * 12}px)`}}>
              <div style={{width: 10, height: 10, borderRadius: 5, background: C.blue}} />
              <T size={28} weight={600}>{t}</T>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Work: React.FC = () => {
  const f = useCurrentFrame();
  const sendAt = 84;
  const readAt = 100;
  const writeAt = 122;
  const doneAt = 152;
  const reportAt = 134;
  const status = f >= doneAt ? 'complete' : f >= readAt ? 'working' : 'idle';
  const btnE = out(prog(f, reportAt + 54, reportAt + 70));
  const z = 1 + 0.04 * prog(f, 0, 220, inOut);
  const spin = (label: string, at: number) => (
    <Bubble f={f} at={at} top={290} time="" edge={24} maxWidth={440}>
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 12}}><Spin size={26} f={f} />{label}</span>
    </Bubble>
  );
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage origin="960px 540px" transform={`scale(${z})`}>
        <Frame>
          <Sidebar idx={0} avatarId="wk-s" />
          <div style={{position: 'absolute', left: SIDE, top: 0, width: 560, height: 780, background: C.chatPaper}}>
            <HeaderGreen sub="your agent" avatar={<AgentAvatar size={64} id="wk-h" status={status} />} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 112, bottom: 108}}>
              <Bubble f={f} at={-100} top={22} time="09:40" edge={24} maxWidth={440}>Hi. How can I help?</Bubble>
              <Bubble f={f} at={sendAt} top={104} out time="09:41" edge={24} maxWidth={470}>
                <FileChip />
                <div>Turn this into a one-page report.</div>
              </Bubble>
              {f >= readAt && f < writeAt && spin('Reading the spreadsheet', readAt)}
              {f >= writeAt && f < doneAt && spin('Writing the report', writeAt)}
              {f >= doneAt && <Bubble f={f} at={doneAt} top={290} time="09:43" edge={24} maxWidth={440}>Done. One page, ready to share.</Bubble>}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.field, borderTop: `2px solid ${C.line}`}}>
              <div style={{position: 'absolute', left: 16, top: 20, width: 430, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`}}><span style={{position: 'absolute', left: 22, top: 17, fontFamily: FONT.body, fontSize: 27, color: C.muted}}>Message</span></div>
              <div style={{position: 'absolute', right: 16, top: 20, width: 68, height: 68, borderRadius: 34, background: GREEN}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: SIDE + 560, top: 0, right: 0, bottom: 0, background: C.field, borderLeft: `2px solid ${C.line}`}}>
            <div style={{position: 'absolute', left: 170, top: 36, width: 540, height: 610, borderRadius: 14, border: `3px dashed ${C.ground3}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', opacity: 1 - prog(f, reportAt, reportAt + 10)}}>
              <T size={30} weight={600} color={C.muted}>Your report will appear here</T>
            </div>
            {f >= reportAt && <Report f={f} at={reportAt} />}
            <div style={{position: 'absolute', left: 170, top: 674, display: 'flex', gap: 20, opacity: btnE, transform: `translateY(${(1 - btnE) * 14}px)`}}>
              <div style={{width: 260, height: 64, borderRadius: 16, background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 30, display: 'grid', placeItems: 'center', boxSizing: 'border-box'}}>Share</div>
              <div style={{width: 260, height: 64, borderRadius: 16, background: C.white, border: `3px solid ${C.line}`, color: C.ink, fontFamily: FONT.body, fontWeight: 700, fontSize: 30, display: 'grid', placeItems: 'center', boxSizing: 'border-box'}}>Download</div>
            </div>
          </div>
        </Frame>
      </Stage>
      <Headline at={4} a="Hand it the" b="busywork." eyebrow="At work" />
      <Subs id="work" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ V5: the Extensions store
const EXT: [string, string, string][] = [
  ['Its own computer', 'Use apps and websites for you', ''],
  ['Spotify', 'Play music', 'S'],
  ['Home Assistant', 'Run your home', 'H'],
  ['Meeting notes', 'Notes from your calls', 'M'],
];
const APPS: [string, string][] = [['Notion', C.ink], ['Todoist', '#a23a5e'], ['Airtable', '#2f6fb3'], ['Figma', '#5a45c8'], ['Canva', '#0f7a8a'], ['Dropbox', C.blue], ['Calendly', '#4a4aff'], ['Stripe', '#2a3350']];

const Tile: React.FC<{letter: string; bg: string; size: number; glyph?: boolean}> = ({letter, bg, size, glyph}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: bg, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: size * 0.5, color: '#fff'}}>
    {glyph ? (
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 44 44"><rect x={5} y={7} width={34} height={23} rx={4} fill="none" stroke="#fff" strokeWidth={3.4} /><path d="M 14 38 H 30 M 22 30 V 38" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" /></svg>
    ) : letter}
  </div>
);

export const Store: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'V5';
  const tap = 100;
  const conn = cue(id, 'It connects');
  const z = 1 + 0.04 * prog(f, 0, 250, inOut);
  const left = out(prog(f, 8, 28));
  const right = out(prog(f, conn - 18, conn + 4));
  const [cx, cy] = along([[tap - 40, 1160, 800], [tap - 4, 990, 482]], f);
  const cO = prog(f, tap - 40, tap - 30) * (1 - prog(f, tap + 24, tap + 34));
  const press = pulse(f, tap);
  const added = f >= tap + 2;
  const tint = [C.blue, GREEN, '#0f7a8a', '#a23a5e'];
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage origin="960px 540px" transform={`scale(${z})`}>
        <Card x={110} y={180} w={1010} h={700} o={left} ty={(1 - left) * 50} pad="34px 40px">
          <T size={46} weight={800} font={FONT.display} style={{letterSpacing: '-0.02em'}}>Extensions</T>
          {EXT.map((x, i) => {
            const e = out(prog(f, 16 + i * 6, 32 + i * 6));
            const isTap = i === 1;
            return (
              <div key={x[0]} style={{position: 'absolute', left: 40, right: 40, top: 112 + i * 142, height: 124, borderRadius: 18, border: `2px solid ${isTap && added ? GREEN : C.line}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px', opacity: e, transform: `translateX(${(1 - e) * -50}px)`}}>
                <Tile letter={x[2]} bg={tint[i]} size={84} glyph={i === 0} />
                <div style={{flex: 1}}>
                  <T size={36} weight={700}>{x[0]}</T>
                  <T size={26} weight={500} color={C.ink2} style={{marginTop: 4}}>{x[1]}</T>
                </div>
                <div style={{width: 150, height: 64, borderRadius: 14, boxSizing: 'border-box', background: isTap && added ? '#e7f4ec' : C.white, border: `3px solid ${isTap && added ? GREEN : C.blue}`, color: isTap && added ? GREEN : C.blue, fontFamily: FONT.body, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transform: `scale(${isTap ? 1 - 0.06 * press : 1})`}}>
                  {isTap && added ? (<><Check size={26} pop={0.7 + 0.3 * out(prog(f, tap + 2, tap + 10))} />Added</>) : 'Add'}
                </div>
              </div>
            );
          })}
        </Card>
        <Card x={1160} y={180} w={650} h={700} o={right} tx={(1 - right) * 90} pad="34px 36px">
          <T size={46} weight={800} font={FONT.display} style={{letterSpacing: '-0.02em'}}>Connected apps</T>
          {APPS.map((a, i) => {
            const at = conn + 4 + i * 9;
            const on = f >= at;
            const col = i % 4;
            const row = Math.floor(i / 4);
            const e = out(prog(f, conn - 10 + i * 3, conn + 6 + i * 3));
            return (
              <div key={a[0]} style={{position: 'absolute', left: 36 + col * 146, top: 124 + row * 270, width: 138, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: e, transform: `translateY(${(1 - e) * 24}px)`}}>
                <Tile letter={a[0][0]} bg={a[1]} size={96} />
                <T size={26} weight={700} style={{marginTop: 12}}>{a[0]}</T>
                <div style={{marginTop: 14, height: 44, width: 138, borderRadius: 22, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: on ? '#e7f4ec' : C.white, border: `2px solid ${on ? GREEN : C.line}`, fontFamily: FONT.body, fontWeight: 700, fontSize: 18, color: on ? GREEN : C.muted}}>
                  {on ? (<><Check size={20} pop={0.7 + 0.3 * out(prog(f, at, at + 8))} />Connected</>) : 'Connect'}
                </div>
              </div>
            );
          })}
        </Card>
        {cO > 0 && <div style={{opacity: cO}}><Cursor x={cx} y={cy} press={press} scale={1.15} /></div>}
      </Stage>
      <Headline at={4} a="Add new" b="abilities." />
      <Subs id="store" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ V6: bring your own plan
export const Plan: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'V6';
  const p1 = cue(id, 'ChatGPT');
  const p2 = cue(id, 'Claude');
  const tapAt = 112;
  const okAt = 134;
  const cardE = out(prog(f, 6, 26));
  const [cx, cy] = along([[tapAt - 34, 1560, 840], [tapAt, 1000, 732]], f);
  const cO = prog(f, tapAt - 34, tapAt - 24) * (1 - prog(f, tapAt + 14, tapAt + 22));
  const press = pulse(f, tapAt);
  const picked = f >= tapAt + 2;
  const ok = f >= okAt;
  const hot = (i: number) => (!picked && f >= (i === 0 ? p1 : p2) && f < (i === 0 ? p2 : p2 + 26) ? 1 : 0);
  const btn = (label: string, i: number) => {
    const sel = picked && i === 1;
    return (
      <div style={{position: 'absolute', left: 40, right: 40, top: 350 + i * 116, height: 92, borderRadius: 18, boxSizing: 'border-box', background: sel ? C.blue : C.white, border: `3px solid ${sel || hot(i) ? C.blue : C.line}`, color: sel ? '#fff' : C.ink, fontFamily: FONT.body, fontWeight: 700, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, transform: `scale(${1 + 0.03 * hot(i) - (sel ? 0.04 * press : 0)})`, outline: hot(i) ? `4px solid ${C.blue}` : 'none', outlineOffset: 4, opacity: picked && !sel ? 0.4 : 1}}>
        {sel && !ok && <Spin size={34} f={f} />}{label}
      </div>
    );
  };
  const okE = out(prog(f, okAt, okAt + 16));
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage origin="960px 560px" transform={`scale(${1 + 0.04 * prog(f, 0, 170, inOut)})`}>
        <Card x={560} y={210} w={800} h={600} o={Math.min(1, cardE * 2)} ty={(1 - cardE) * 50} border={ok ? GREEN : C.line} pad="0">
          <div style={{position: 'absolute', left: 40, top: 38}}><AgentAvatar size={100} id="pl1" bg={C.ground} status={ok ? 'complete' : 'idle'} /></div>
          <div style={{position: 'absolute', left: 40, top: 156, right: 40}}>
            <T size={50} weight={800} font={FONT.display} style={{letterSpacing: '-0.02em', lineHeight: 1.08}}>Use the plan you already have</T>
            <T size={28} weight={500} color={C.ink2} style={{marginTop: 12}}>Sign in with the account you pay for.</T>
          </div>
          {!ok && (<div style={{opacity: 1 - okE}}>{btn('Continue with ChatGPT', 0)}{btn('Continue with Claude', 1)}</div>)}
          {ok && (
            <div style={{position: 'absolute', left: 40, right: 40, top: 350, height: 200, borderRadius: 20, background: '#e7f4ec', border: `2px solid ${GREEN}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 26, padding: '0 36px', opacity: okE, transform: `scale(${0.94 + 0.06 * okE})`}}>
              <Check size={96} pop={0.7 + 0.3 * out(prog(f, okAt + 4, okAt + 18))} />
              <div>
                <T size={46} weight={800} font={FONT.display} color={GREEN} style={{letterSpacing: '-0.02em'}}>Connected.</T>
                <T size={32} weight={600} style={{marginTop: 6}}>Your plan works here.</T>
              </div>
            </div>
          )}
        </Card>
        {cO > 0 && <div style={{opacity: cO}}><Cursor x={cx} y={cy} press={press} scale={1.15} /></div>}
      </Stage>
      <Headline at={4} a="Bring your" b="own plan." />
      <Subs id="plan" bottom={30} />
    </AbsoluteFill>
  );
};
