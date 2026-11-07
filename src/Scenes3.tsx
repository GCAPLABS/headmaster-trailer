import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AgentAvatar} from './Agent';
import {PhoneBody} from './Devices';
import {Check, Cursor, Headline, Spin, Subs, typedWords} from './kit';
import lines from './lines.json';
import {C, FONT, inOut, out, prog} from './theme';
import {Bubble, GREEN} from './ThreadUI';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Frame at which a phrase of a voice line is spoken, estimated from its character position in the real duration.
export const cue = (id: string, frag: string, from = 0) => {
  const L = (lines as Record<string, {dur: number; text: string}>)[id];
  const i = L.text.indexOf(frag, from);
  return Math.round(12 + L.dur * 30 * (i / L.text.length));
};

export const Card: React.FC<{x: number; y: number; w: number; h: number; o?: number; tx?: number; ty?: number; rot?: number; border?: string; bg?: string; pad?: string; children?: React.ReactNode}> = ({x, y, w, h, o = 1, tx = 0, ty = 0, rot = 0, border = C.line, bg = C.white, pad = '0', children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: o, transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, borderRadius: 24, background: bg, border: `2px solid ${border}`, boxSizing: 'border-box', boxShadow: `14px 16px 0 ${C.ground3}`, padding: pad}}>{children}</div>
);
export const T: React.FC<{size: number; weight?: number; color?: string; font?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, weight = 600, color = C.ink, font = FONT.body, children, style}) => (
  <div style={{fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: 1.15, ...style}}>{children}</div>
);
const Envelope: React.FC<{c?: string; s?: number}> = ({c = C.blue, s = 48}) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><rect x={5} y={10} width={38} height={28} rx={5} fill="none" stroke={c} strokeWidth={3.4} /><path d="M 7 14 L 24 28 L 41 14" fill="none" stroke={c} strokeWidth={3.4} strokeLinejoin="round" /></svg>
);
export const CalIcon: React.FC<{c?: string; s?: number}> = ({c = C.blue, s = 48}) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><rect x={6} y={9} width={36} height={32} rx={5} fill="none" stroke={c} strokeWidth={3.4} /><path d="M 6 19 H 42 M 15 5 V 13 M 33 5 V 13" stroke={c} strokeWidth={3.4} strokeLinecap="round" /></svg>
);
export const Chip: React.FC<{label: string; at: number; f: number}> = ({label, at, f}) => {
  const e = out(prog(f, at, at + 12));
  return <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, opacity: e, transform: `scale(${0.85 + 0.15 * e})`, border: `2px solid ${C.chatHead}`, borderRadius: 14, padding: '6px 16px 6px 10px', fontFamily: FONT.body, fontWeight: 700, fontSize: 26, color: C.chatHead, background: C.white}}><Check size={26} />{label}</div>;
};
export const Stage: React.FC<{children: React.ReactNode; origin?: string; transform?: string}> = ({children, origin = '960px 540px', transform}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: origin, transform}}>{children}</div>
);

// ------------------------------------------------------------ N11: most AI apps only talk
export const Versus: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N11';
  const yours = cue(id, 'Yours');
  const job = cue(id, 'the job');
  const lIn = out(prog(f, 8, 32));
  const rIn = out(prog(f, yours - 8, yours + 16));
  const lWords = [22, 26, 30, 34, 38, 42];
  const rWords = lWords.map((w) => w + yours - 4);
  const lDim = 1 - 0.28 * prog(f, yours, yours + 14);
  const step = (i: number) => f >= job - 14 + i * 20;
  const bookedAt = job + 40;
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Card x={110} y={190} w={820} h={720} o={lIn * lDim} tx={(1 - lIn) * -120} pad="34px 44px">
        <T size={34} weight={700} color={C.muted}>Most AI apps</T>
        <div style={{position: 'absolute', right: 44, top: 138, maxWidth: 560, background: C.white, border: `2px solid ${C.line}`, borderRadius: '22px 22px 6px 22px', padding: '14px 22px'}}>
          <T size={30} weight={500} color={C.muted}>{typedWords('Book a beach weekend for two', lWords, f) || ' '}</T>
        </div>
        {f >= 52 && (
          <div style={{position: 'absolute', left: 44, top: 250, width: 640, background: C.white, border: `2px solid ${C.line}`, borderRadius: '22px 22px 22px 6px', padding: '16px 24px', opacity: out(prog(f, 52, 66)), transform: `translateY(${(1 - out(prog(f, 52, 66))) * 20}px)`}}>
            <T size={30} weight={600} color={C.muted}>Here are some tips:</T>
            {['Look at hotel sites', 'Compare the prices', 'Book it yourself'].map((t, i) => <T key={t} size={30} weight={500} color={C.muted} style={{marginTop: 10}}>{i + 1}. {t}</T>)}
          </div>
        )}
        <div style={{position: 'absolute', left: 44, bottom: 40, display: 'flex', alignItems: 'center', gap: 14, opacity: prog(f, 84, 98)}}>
          <svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={20} r={18} fill="none" stroke={C.muted} strokeWidth={3.4} /><path d="M 12 12 L 28 28 M 28 12 L 12 28" stroke={C.muted} strokeWidth={3.4} strokeLinecap="round" /></svg>
          <T size={32} weight={700} color={C.muted}>Nothing booked. You still do it.</T>
        </div>
      </Card>
      <Card x={990} y={190} w={820} h={720} o={rIn} tx={(1 - rIn) * 140} border={C.blue} pad="34px 44px">
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><AgentAvatar size={52} id="vs1" bg={C.ground} status={f >= bookedAt ? 'complete' : f >= job - 14 ? 'working' : 'idle'} /><T size={34} weight={700} color={C.blue}>Your agent</T></div>
        <div style={{position: 'absolute', right: 44, top: 138, maxWidth: 560, background: C.chatOut, borderRadius: '22px 22px 6px 22px', padding: '14px 22px'}}>
          <T size={30} weight={500}>{typedWords('Book a beach weekend for two', rWords, f) || ' '}</T>
        </div>
        <div style={{position: 'absolute', left: 44, top: 250}}>
          {['Searched 3 beach stays', 'Asked you to approve AED 1,140', 'Booked Palm Bay Resort'].map((t, i) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, height: 74, opacity: step(i) ? 1 : 0, transform: `translateY(${(1 - out(prog(f, job - 14 + i * 20, job + 2 + i * 20))) * 18}px)`}}>
              <Check size={38} pop={0.7 + 0.3 * out(prog(f, job - 14 + i * 20, job - 6 + i * 20))} />
              <T size={34} weight={600}>{t}</T>
            </div>
          ))}
        </div>
        {f >= bookedAt && (
          <div style={{position: 'absolute', left: 44, right: 44, bottom: 44, borderRadius: 20, background: C.chatHead, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 22, opacity: out(prog(f, bookedAt, bookedAt + 12)), transform: `scale(${0.94 + 0.06 * out(prog(f, bookedAt, bookedAt + 14))})`}}>
            <Check size={64} color={C.chatHead} bg="#fff" />
            <div><T size={58} weight={800} font={FONT.display} color="#fff" style={{letterSpacing: '-0.02em'}}>Booked.</T><T size={28} weight={500} color="#d4ecdf">Palm Bay Resort, 2 nights, AED 1,140</T></div>
          </div>
        )}
      </Card>
      <Headline at={4} a="It does the" b="whole job." eyebrow="For you" />
      <Subs id="vs" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N2: email and calendar
export const Mail: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N2';
  const spots = cue(id, 'It spots');
  const adds = cue(id, 'adds');
  const z = 1.28 - 0.28 * inOut(prog(f, 0, 56, (t) => t));
  const rows: [string, string][] = [['Bank', 'Your statement is ready'], ['Palm Bay Resort', 'Your booking is confirmed'], ['Mum', 'Sunday lunch?'], ['Dentist', 'Reminder for Friday'], ['Flight', 'Your boarding pass']];
  const found = prog(f, spots, spots + 10);
  const fly = inOut(prog(f, adds, adds + 30, (t) => t));
  const bar = out(prog(f, adds + 30, adds + 46));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // hotel row centre (inbox) and Friday row centre (calendar)
  const sx = 520, sy = 200 + 150 + 1 * 100 + 50, ex = 1400, ey = 200 + 140 + 4 * 76 + 38;
  const fx = sx + (ex - sx) * fly, fy = sy + (ey - sy) * fly - Math.sin(fly * Math.PI) * 120;
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage origin="520px 430px" transform={`scale(${z})`}>
        <Card x={110} y={200} w={820} h={690} pad="34px 40px">
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Envelope /><T size={44} weight={800} font={FONT.display}>Inbox</T><div style={{flex: 1}} /><Chip label="Connected" at={18} f={f} /></div>
          <div style={{marginTop: 26}}>
            {rows.map((r, i) => {
              const hot = i === 1;
              const e = out(prog(f, 8 + i * 4, 8 + i * 4 + 14));
              return (
                <div key={r[0]} style={{height: 100, borderTop: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 18, opacity: e, transform: `translateX(${(1 - e) * -50}px)`, outline: hot && found > 0 ? `4px solid ${C.blue}` : 'none', outlineOffset: -4, borderRadius: hot ? 14 : 0, background: hot && found > 0 ? '#f0f0ff' : 'transparent', padding: '0 14px'}}>
                  <div style={{width: 12, height: 12, borderRadius: 6, background: i === 1 ? C.blue : 'transparent'}} />
                  <div style={{flex: 1}}><T size={32} weight={700}>{r[0]}</T><T size={27} weight={500} color={C.ink2} style={{marginTop: 4}}>{r[1]}</T></div>
                  {hot && found > 0 && <div style={{background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 24, padding: '4px 14px', borderRadius: 8, opacity: found}}>Found a booking</div>}
                </div>
              );
            })}
          </div>
        </Card>
        <Card x={990} y={200} w={820} h={690} pad="34px 40px">
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><CalIcon /><T size={44} weight={800} font={FONT.display}>Calendar</T><div style={{flex: 1}} /><Chip label="Connected" at={30} f={f} /></div>
          <div style={{marginTop: 22}}>
            {days.map((d, i) => (
              <div key={d} style={{height: 76, borderTop: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 24, position: 'relative'}}>
                <T size={28} weight={700} color={C.ink2} style={{width: 80}}>{d}</T>
                {(i === 4 || i === 5) && bar > 0 && (
                  <div style={{position: 'absolute', left: 104, right: 0, top: 8, height: 60, borderRadius: i === 4 ? '14px 14px 0 0' : '0 0 14px 14px', background: C.blue, opacity: bar, transform: `scaleX(${0.6 + 0.4 * bar})`, transformOrigin: '0 50%', display: 'flex', alignItems: 'center', padding: '0 20px'}}>
                    {i === 4 && <T size={28} weight={700} color="#fff">Palm Bay Resort, 2 nights</T>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
        {f >= adds && f < adds + 32 && (
          <div style={{position: 'absolute', left: fx - 220, top: fy - 38, width: 440, height: 76, borderRadius: 16, background: C.white, border: `3px solid ${C.blue}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxShadow: `8px 9px 0 ${C.ground3}`, transform: `scale(${1 - 0.15 * fly})`}}>
            <Envelope s={34} /><T size={26} weight={700}>Palm Bay Resort, 2 nights</T>
          </div>
        )}
      </Stage>
      <Headline at={30} a="It reads your" b="email for you." eyebrow="For you" />
      <Subs id="mail" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N3: receipts
const Receipt: React.FC<{w: number}> = ({w}) => {
  const zig = Array.from({length: 13}, (_, i) => `${(i / 12) * w},${i % 2 === 0 ? 560 : 590}`).join(' ');
  return (
    <svg width={w} height={600} viewBox={`0 0 ${w} 600`} style={{display: 'block'}}>
      <polygon points={`0,0 ${w},0 ${w},560 ${zig.split(' ').reverse().join(' ')}`} fill="#fbfaf6" stroke={C.line} strokeWidth={2} />
      <text x={w / 2} y={60} textAnchor="middle" fontFamily={FONT.display} fontWeight={800} fontSize={34} fill={C.ink}>CORNER CAFE</text>
      {[['Coffee', '18.00'], ['Croissant', '14.00'], ['Sandwich', '28.00']].map((r, i) => (
        <g key={r[0]}><text x={34} y={150 + i * 56} fontFamily={FONT.body} fontWeight={500} fontSize={28} fill={C.ink2}>{r[0]}</text><text x={w - 34} y={150 + i * 56} textAnchor="end" fontFamily={FONT.body} fontWeight={500} fontSize={28} fill={C.ink2}>{r[1]}</text></g>
      ))}
      <path d={`M 34 360 H ${w - 34}`} stroke={C.ink2} strokeWidth={2} strokeDasharray="8 8" />
      <text x={34} y={418} fontFamily={FONT.body} fontWeight={800} fontSize={34} fill={C.ink}>TOTAL</text>
      <text x={w - 34} y={418} textAnchor="end" fontFamily={FONT.body} fontWeight={800} fontSize={34} fill={C.ink}>60.00</text>
    </svg>
  );
};

export const Receipts: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N3';
  const files = cue(id, 'It files');
  const total = cue(id, 'keeps');
  const snap = 50;
  const cam = prog(f, 54, 150, inOut);
  const brk = 1 - 0.1 * prog(f, 40, snap);
  const sentAt = snap + 8;
  const rowE = out(prog(f, files + 4, files + 18));
  const cnt = prog(f, total, total + 14);
  const sum = 336.5 + 60 * cnt;
  const old: [string, string][] = [['Taxi', '38.00'], ['Office supplies', '112.50'], ['Lunch with client', '186.00']];
  const overlay = f < sentAt ? (
    <div style={{position: 'absolute', inset: 0, background: C.dark}}>
      <div style={{position: 'absolute', left: 52, top: 130, transform: `rotate(2.5deg) scale(${brk})`, transformOrigin: '50% 50%'}}><Receipt w={294} /></div>
      {[[28, 100, 1, 1], [370, 100, -1, 1], [28, 760, 1, -1], [370, 760, -1, -1]].map(([x, y, dx, dy], i) => (
        <path key={i} d={`M ${x} ${y + dy * 46} V ${y} H ${x + dx * 46}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" transform={`translate(${(1 - brk) * -dx * 60 * -1} ${(1 - brk) * dy * 60 * -1})`} />
      ))}
      <div style={{position: 'absolute', left: 164, top: 764, width: 70, height: 70, borderRadius: 35, border: '6px solid #fff', boxSizing: 'border-box', display: 'grid', placeItems: 'center'}}><div style={{width: 46, height: 46, borderRadius: 23, background: '#fff', transform: `scale(${1 - 0.18 * (f >= snap && f < snap + 5 ? 1 : 0)})`}} /></div>
    </div>
  ) : null;
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage transform={`translateY(${40 - 40 * cam}px)`}>
        <PhoneBody x={350} y={190} scale={0.8} id="rc1" overlay={overlay}>
          <Bubble f={f} at={sentAt} top={22} out time="09:50"><div style={{width: 230, height: 150, background: '#fbfaf6', borderRadius: 10, border: `2px solid ${C.line}`, overflow: 'hidden', position: 'relative'}}><div style={{transform: 'scale(0.38)', transformOrigin: '0 0', position: 'absolute', left: 20, top: 8}}><Receipt w={400} /></div></div></Bubble>
          <Bubble f={f} at={files - 4} top={218} time="09:50">Filed. Total so far AED 396.50.</Bubble>
        </PhoneBody>
        <Card x={860} y={190} w={950} h={700} pad="36px 48px">
          <div style={{display: 'flex', alignItems: 'baseline'}}><T size={46} weight={800} font={FONT.display}>Receipts</T><div style={{flex: 1}} /><T size={30} weight={600} color={C.ink2}>Total</T><T size={60} weight={800} font={FONT.display} style={{marginLeft: 18, letterSpacing: '-0.02em'}}>AED {sum.toFixed(2)}</T></div>
          <div style={{marginTop: 24, position: 'relative'}}>
            {f >= files && (
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 110, borderTop: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 20, opacity: rowE, transform: `translateX(${(1 - rowE) * -200}px)`, background: '#f0f0ff', borderRadius: 14, padding: '0 16px', boxSizing: 'border-box'}}>
                <div style={{width: 50, height: 66, background: '#fbfaf6', border: `2px solid ${C.line}`, borderRadius: 6}} />
                <T size={36} weight={700} style={{flex: 1}}>Corner Cafe</T><T size={26} weight={700} color={C.blue}>New</T><T size={36} weight={700} style={{width: 150, textAlign: 'right'}}>60.00</T>
              </div>
            )}
            {old.map((r, i) => (
              <div key={r[0]} style={{height: 110, borderTop: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 16px', transform: `translateY(${110 * out(prog(f, files - 8, files + 8))}px)`, opacity: out(prog(f, 8 + i * 5, 22 + i * 5))}}>
                <div style={{width: 50, height: 66, background: '#fbfaf6', border: `2px solid ${C.line}`, borderRadius: 6}} />
                <T size={36} weight={600} style={{flex: 1}}>{r[0]}</T><T size={36} weight={600} style={{width: 150, textAlign: 'right'}}>{r[1]}</T>
              </div>
            ))}
          </div>
        </Card>
      </Stage>
      <Headline at={4} a="Snap a" b="receipt." eyebrow="At work" />
      <Subs id="receipt" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N1: voice call
export const Call: React.FC = () => {
  const f = useCurrentFrame();
  const connected = f >= 28;
  const secs = Math.max(0, Math.floor((f - 28) / 30));
  const speaking = f >= 40 && f < 92 ? 'you' : f >= 98 && f < 146 ? 'agent' : 'none';
  const push = 1 + 0.06 * prog(f, 0, 156, inOut);
  const youWords = [42, 48, 54, 60, 66, 72, 78];
  const reply = out(prog(f, 98, 114));
  const overlay = (
    <div style={{position: 'absolute', inset: 0, background: C.ground}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}><AgentAvatar size={210} id="call1" bg={C.ground} status={f >= 146 ? 'complete' : f >= 98 ? 'working' : 'thinking'} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 390, textAlign: 'center'}}><T size={46} weight={800} font={FONT.display}>Headmaster</T><T size={30} weight={600} color={C.ink2} style={{marginTop: 8}}>{connected ? `00:0${secs}` : 'Calling...'}</T></div>
      <svg width={398} height={160} style={{position: 'absolute', left: 0, top: 500}}>
        {Array.from({length: 19}, (_, i) => {
          const amp = speaking === 'none' ? 0.08 : 0.25 + 0.75 * Math.abs(Math.sin(f * 0.37 + i * 1.3) * Math.cos(f * 0.21 + i * 0.7));
          const h = 14 + amp * 120;
          return <rect key={i} x={30 + i * 18} y={80 - h / 2} width={10} height={h} rx={5} fill={speaking === 'agent' ? C.ink : C.blue} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', gap: 40}}>
        {['mic', 'speaker', 'end'].map((k) => (
          <div key={k} style={{width: 84, height: 84, borderRadius: 42, background: k === 'end' ? C.ink : C.white, border: `2px solid ${k === 'end' ? C.ink : C.line}`, display: 'grid', placeItems: 'center'}}>
            <svg width={38} height={38} viewBox="0 0 38 38">
              {k === 'mic' && <g fill="none" stroke={C.ink} strokeWidth={3.4} strokeLinecap="round"><rect x={14} y={4} width={10} height={18} rx={5} /><path d="M 8 18 A 11 11 0 0 0 30 18 M 19 29 V 34" /></g>}
              {k === 'speaker' && <g fill="none" stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M 5 14 H 11 L 19 7 V 31 L 11 24 H 5 Z M 25 12 Q 30 19 25 26" /></g>}
              {k === 'end' && <path d="M 5 22 Q 19 10 33 22" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage transform={`scale(${push})`} origin="960px 540px">
        <PhoneBody x={960 - 204} y={118} scale={0.95} id="call0" overlay={overlay} />
        <Card x={110} y={330} w={560} h={190} o={out(prog(f, 40, 54))} tx={(1 - out(prog(f, 40, 54))) * -60} pad="22px 30px">
          <T size={26} weight={700} color={C.ink2}>You say</T>
          <T size={38} weight={600} style={{marginTop: 10}}>{typedWords('Book me a table for two on Friday.', [...youWords, 84], f) || ' '}</T>
        </Card>
        <Card x={1250} y={470} w={560} h={190} o={reply} tx={(1 - reply) * 60} border={C.blue} pad="22px 30px">
          <T size={26} weight={700} color={C.blue}>Headmaster says</T>
          <T size={38} weight={600} style={{marginTop: 10}}>Done. Friday at 19:00, table for two.</T>
        </Card>
      </Stage>
      <Headline at={4} a="Just" b="call it." eyebrow="For you" />
      <Subs id="call" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N8: every Monday
export const Weekly: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N8';
  const startW = cue(id, 'every Monday');
  const words = 'Every Monday at nine, send me my plan.'.split(' ');
  const at = words.map((w, i) => cue(id, 'every Monday') + Math.round(i * (cue(id, 'It just') - cue(id, 'every Monday') - 8) / words.length));
  const sendAt = at[at.length - 1] + 10;
  const typed = typedWords('Every Monday at nine, send me my plan.', at, f);
  const happens = cue(id, 'It just');
  const pan = inOut(prog(f, happens + 6, 220, (t) => t));
  const dates = ['Mon 2 Nov', 'Mon 9 Nov', 'Mon 16 Nov', 'Mon 23 Nov'];
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage transform={`translateX(${-pan * 760}px)`}>
        <Card x={110} y={200} w={620} h={700} bg={C.chatPaper}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 96, background: C.chatHead, borderRadius: '22px 22px 0 0', display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px'}}><AgentAvatar size={56} id="wk1" /><T size={30} weight={700} color="#fff">Headmaster</T></div>
          {f >= sendAt && <Bubble f={f} at={sendAt} top={130} out edge={24} maxWidth={440}>Every Monday at nine, send me my plan.</Bubble>}
          {f >= sendAt + 14 && <Bubble f={f} at={sendAt + 14} top={290} edge={24} maxWidth={440}>Done. Every Monday at 09:00.</Bubble>}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, background: C.field, borderTop: `2px solid ${C.line}`, borderRadius: '0 0 22px 22px'}}>
            <div style={{position: 'absolute', left: 16, top: 16, right: 100, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`, overflow: 'hidden'}}>
              <span style={{position: 'absolute', right: 20, top: 16, fontFamily: FONT.body, fontWeight: 500, fontSize: 28, color: f >= sendAt ? C.muted : C.ink, whiteSpace: 'nowrap'}}>{f >= sendAt ? 'Message' : typed}</span>
            </div>
            <div style={{position: 'absolute', right: 16, top: 16, width: 68, height: 68, borderRadius: 34, background: C.chatHead}} />
          </div>
        </Card>
        {dates.map((d, i) => {
          const a = i === 0 ? sendAt + 18 : happens + i * 12;
          const e = out(prog(f, a, a + 16));
          return (
            <Card key={d} x={800 + i * 500} y={240} w={470} h={620} o={e} ty={(1 - e) * 60} pad="28px 34px">
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}><CalIcon s={44} /><T size={40} weight={800} font={FONT.display}>{d}</T></div>
              <T size={30} weight={600} color={C.blue} style={{marginTop: 8}}>09:00</T>
              <div style={{marginTop: 28, background: C.chatOut, borderRadius: '22px 22px 6px 22px', padding: '16px 22px'}}>
                <T size={30} weight={700}>Your plan for this week</T>
                {['Client call, Tue 10:00', 'Sales report, Wed', 'Team lunch, Thu'].map((t) => <T key={t} size={27} weight={500} color={C.ink2} style={{marginTop: 8}}>{t}</T>)}
              </div>
              <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 12}}><Check size={36} pop={0.7 + 0.3 * out(prog(f, a + 10, a + 20))} /><T size={30} weight={700} color={C.chatHead}>Sent</T></div>
            </Card>
          );
        })}
      </Stage>
      <Headline at={4} a="Every Monday," b="on its own." eyebrow="At work" />
      <Subs id="weekly" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N4: split a big job
export const Split: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N4';
  const splits = cue(id, 'splits');
  const back = cue(id, 'brings');
  const z = 1.1 - 0.1 * inOut(prog(f, 0, 70, (t) => t));
  const words = [14, 19, 24, 29, 34, 39];
  const people = [['Ada', 'Check the stock'], ['Milo', 'Set the prices'], ['Juno', 'Write the post']];
  const cx = [380, 960, 1540];
  const sp = (i: number) => inOut(prog(f, splits + i * 5, splits + i * 5 + 24, (t) => t));
  const mg = inOut(prog(f, back, back + 26, (t) => t));
  const planE = out(prog(f, back + 20, back + 38));
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage origin="960px 300px" transform={`scale(${z})`}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {cx.map((x, i) => <path key={i} d={`M 960 270 C 960 310 ${x} 290 ${x} 345`} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="600" strokeDashoffset={600 * (1 - sp(i))} opacity={1 - 0.8 * mg} />)}
          {cx.map((x, i) => <path key={'b' + i} d={`M ${x} 625 C ${x} 665 960 650 960 705`} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="600" strokeDashoffset={600 * (1 - mg)} />)}
        </svg>
        <Card x={480} y={160} w={960} h={110} o={out(prog(f, 4, 18))} pad="0 40px"><div style={{height: '100%', display: 'flex', alignItems: 'center', gap: 20}}><T size={28} weight={700} color={C.blue}>Your ask</T><T size={42} weight={700}>{typedWords('Get ready for the weekend sale', words, f)}</T></div></Card>
        {people.map((p, i) => {
          const e = sp(i);
          const doneAt = splits + 40 + i * 14;
          return (
            <Card key={p[0]} x={cx[i] - 250} y={345} w={500} h={280} o={Math.min(1, e * 3)} ty={(1 - e) * -170} pad="26px 32px">
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div style={{width: 60, height: 60, borderRadius: 30, background: C.ground, display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: C.blue}}>{p[0][0]}</div>
                <T size={44} weight={800} font={FONT.display}>{p[0]}</T>
              </div>
              <T size={34} weight={600} color={C.ink2} style={{marginTop: 24}}>{p[1]}</T>
              <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 14}}>
                {f >= doneAt ? <Check size={40} pop={0.7 + 0.3 * out(prog(f, doneAt, doneAt + 8))} /> : <Spin size={40} f={f} />}
                <T size={30} weight={700} color={f >= doneAt ? C.chatHead : C.ink2}>{f >= doneAt ? 'Done' : 'Working'}</T>
              </div>
            </Card>
          );
        })}
        <Card x={430} y={705} w={1060} h={190} o={planE} ty={(1 - planE) * 40} border={C.blue} pad="24px 40px">
          <T size={44} weight={800} font={FONT.display}>Weekend sale ready</T>
          <div style={{display: 'flex', gap: 40, marginTop: 20}}>
            {['Stock checked', 'Prices set', 'Post ready'].map((t, i) => (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12}}><Check size={36} pop={0.7 + 0.3 * out(prog(f, back + 40 + i * 8, back + 50 + i * 8))} /><T size={32} weight={600}>{t}</T></div>
            ))}
          </div>
        </Card>
      </Stage>
      <Headline at={4} a="One big job," b="shared out." eyebrow="For your business" />
      <Subs id="split" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N5: team
export const Team: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N5';
  const agents = cue(id, 'Everyone');
  const admin = cue(id, 'you stay');
  const pan = 30 - 60 * prog(f, 0, 198, inOut);
  const people: [string, string][] = [['Sam', 'You, Owner'], ['Priya', 'Designer'], ['Leo', 'Sales'], ['Maya', 'Finance']];
  const tint = [C.ground, C.ground2, C.ground3, C.ground2];
  const aE = out(prog(f, admin - 14, admin + 12));
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <Stage transform={`translateX(${pan}px)`}>
        <Card x={110} y={190} w={1090} h={720} pad="30px 44px">
          <T size={44} weight={800} font={FONT.display}>Your team</T>
          <div style={{marginTop: 18}}>
            {people.map((p, i) => {
              const e = out(prog(f, 12 + i * 7, 12 + i * 7 + 16));
              const ae = out(prog(f, agents + i * 9, agents + i * 9 + 14));
              return (
                <div key={p[0]} style={{height: 140, borderTop: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 22, opacity: e, transform: `translateX(${(1 - e) * -60}px)`}}>
                  <div style={{width: 84, height: 84, borderRadius: 42, background: tint[i], display: 'grid', placeItems: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: C.ink}}>{p[0][0]}</div>
                  <div style={{width: 200}}><T size={40} weight={700}>{p[0]}</T><T size={26} weight={500} color={C.ink2}>{p[1]}</T></div>
                  <svg width={120} height={20} style={{opacity: ae}}><path d="M 0 10 H 100 M 86 2 L 100 10 L 86 18" fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: ae, transform: `scale(${0.8 + 0.2 * ae})`, transformOrigin: '0 50%', border: `2px solid ${C.blue}`, borderRadius: 18, padding: '8px 22px 8px 10px', background: C.white}}>
                    <AgentAvatar size={60} id={`tm${i}`} bg={C.ground} /><T size={30} weight={700} color={C.blue}>{p[0]}'s agent</T>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card x={1250} y={190} w={560} h={720} o={aE} tx={(1 - aE) * 120} border={C.blue} pad="30px 40px">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}><T size={44} weight={800} font={FONT.display}>Admin</T><div style={{background: C.blue, color: '#fff', fontFamily: FONT.body, fontWeight: 700, fontSize: 24, padding: '4px 14px', borderRadius: 8}}>You</div></div>
          {[['Invite people', ''], ['One shared wallet', 'On'], ['Approvals', 'On']].map((r, i) => {
            const on = prog(f, admin + 10 + i * 10, admin + 22 + i * 10);
            if (i === 0) {
              return <div key={r[0]} style={{marginTop: 34, display: 'inline-flex', alignItems: 'center', gap: 12, height: 72, padding: '0 30px', borderRadius: 16, background: C.blue, opacity: on, transform: `scale(${0.9 + 0.1 * on})`, transformOrigin: '0 50%'}}><svg width={28} height={28} viewBox="0 0 28 28"><path d="M 14 4 V 24 M 4 14 H 24" stroke="#fff" strokeWidth={4} strokeLinecap="round" /></svg><T size={32} weight={700} color="#fff">Invite people</T></div>;
            }
            return (
              <div key={r[0]} style={{marginTop: 34}}>
                <T size={28} weight={600} color={C.ink2}>{r[0]}</T>
                <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 10}}>
                  <div style={{width: 84, height: 46, borderRadius: 23, background: on > 0.5 ? C.blue : C.white, border: `2px solid ${on > 0.5 ? C.blue : C.line}`, position: 'relative', boxSizing: 'border-box'}}><div style={{position: 'absolute', top: 4, left: 4 + 38 * on, width: 34, height: 34, borderRadius: 17, background: on > 0.5 ? '#fff' : C.muted}} /></div>
                  <T size={34} weight={700}>{r[1]}</T>
                </div>
              </div>
            );
          })}
        </Card>
      </Stage>
      <Headline at={4} a="Bring your" b="team." eyebrow="For your business" />
      <Subs id="team" bottom={30} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ N12: one agent instead of ten apps
const GLYPH: Record<string, React.ReactNode> = {
  Mail: <g fill="none" stroke="#fff" strokeWidth={3}><rect x={6} y={10} width={28} height={20} rx={3} /><path d="M 7 12 L 20 22 L 33 12" /></g>,
  Maps: <g fill="none" stroke="#fff" strokeWidth={3}><path d="M 20 34 C 8 22 10 8 20 8 C 30 8 32 22 20 34 Z" /><circle cx={20} cy={18} r={4} /></g>,
  Notes: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round"><rect x={9} y={6} width={22} height={28} rx={3} /><path d="M 14 14 H 26 M 14 20 H 26 M 14 26 H 21" /></g>,
  Bank: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"><path d="M 6 14 L 20 6 L 34 14 Z M 10 17 V 28 M 20 17 V 28 M 30 17 V 28 M 6 32 H 34" /></g>,
  Taxi: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"><path d="M 6 26 V 18 L 11 11 H 29 L 34 18 V 26 Z" /><circle cx={13} cy={27} r={3} fill="#fff" /><circle cx={27} cy={27} r={3} fill="#fff" /></g>,
  Hotels: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"><path d="M 5 30 V 10 M 5 24 H 35 V 30 M 5 18 H 20 V 24" /></g>,
  Food: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round"><path d="M 12 6 V 16 A 4 4 0 0 0 20 16 V 6 M 16 16 V 34 M 28 6 C 24 10 24 18 28 20 V 34" /></g>,
  Flights: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"><path d="M 5 21 L 35 8 L 28 32 L 21 23 Z" /></g>,
  Photos: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"><rect x={6} y={9} width={28} height={22} rx={3} /><circle cx={15} cy={17} r={3} /><path d="M 8 29 L 18 21 L 24 26 L 28 22 L 33 28" /></g>,
  Tickets: <g fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round"><path d="M 5 12 H 35 V 18 A 3 3 0 0 0 35 24 V 30 H 5 V 24 A 3 3 0 0 0 5 18 Z" /></g>,
};
const APPS = Object.keys(GLYPH);
const TILE = [C.blue, '#4a4aff', C.ink, C.chatHead, '#2f6fb3', '#7a4a2b', '#a23a5e', '#0f7a8a', '#5a45c8', '#2a3350'];

export const OneApp: React.FC = () => {
  const f = useCurrentFrame();
  const id = 'N12';
  const one = cue(id, 'One agent');
  const done = cue(id, 'gets it');
  const overlay = (
    <div style={{position: 'absolute', inset: 0, background: C.ground, opacity: 1 - prog(f, one + 18, one + 30)}}>
      {APPS.map((a, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const x = 33 + col * 118, y = 130 + row * 150;
        const c = inOut(prog(f, one + i * 2, one + i * 2 + 22, (t) => t));
        const e = out(prog(f, 6 + i * 3, 6 + i * 3 + 14));
        return (
          <div key={a} style={{position: 'absolute', left: x + (199 - 48 - x) * c, top: y + (424 - 48 - y) * c, width: 96, opacity: e * (1 - 0.0 * c), transform: `scale(${(0.7 + 0.3 * e) * (1 - 0.85 * c)})`}}>
            <div style={{width: 96, height: 96, borderRadius: 24, background: TILE[i], display: 'grid', placeItems: 'center'}}><svg width={56} height={56} viewBox="0 0 40 40">{GLYPH[a]}</svg></div>
            <div style={{textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: C.ink, marginTop: 6}}>{a}</div>
          </div>
        );
      })}
    </div>
  );
  const apps = 1 - prog(f, one, one + 16);
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <PhoneBody x={960 - 190} y={170} scale={0.88} id="oa1" overlay={overlay}>
        <Bubble f={f} at={one + 24} top={22} time="09:00">Hi. What do you need?</Bubble>
        {['Weekend booked', 'Report sent', 'Sale post ready'].map((t, i) => (
          <Bubble key={t} f={f} at={done + i * 12} top={130 + i * 78} out time="">
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 10}}><Check size={28} />{t}</span>
          </Bubble>
        ))}
      </PhoneBody>
      <div style={{position: 'absolute', left: 110, top: 400, opacity: out(prog(f, 14, 30)) * (0.35 + 0.65 * apps), transform: `translateX(${(1 - out(prog(f, 14, 30))) * -60}px)`}}>
        <T size={170} weight={800} font={FONT.display} color={C.ink} style={{letterSpacing: '-0.03em'}}>10</T><T size={52} weight={700} color={C.ink2}>different apps</T>
      </div>
      <div style={{position: 'absolute', right: 110, top: 400, textAlign: 'right', opacity: out(prog(f, one + 10, one + 30)), transform: `translateX(${(1 - out(prog(f, one + 10, one + 30))) * 60}px)`}}>
        <T size={170} weight={800} font={FONT.display} color={C.blue} style={{letterSpacing: '-0.03em'}}>1</T><T size={52} weight={700} color={C.blue}>agent</T>
      </div>
      <Headline at={4} a="One agent," b="not ten apps." />
      <Subs id="oneapp" bottom={30} />
    </AbsoluteFill>
  );
};
