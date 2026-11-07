import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AgentAvatar} from './Agent';
import {MemoryWindow, WorkWindow} from './AppWin';
import {Cursor, Headline, Subs} from './kit';
import lines from './lines.json';
import {C, FONT, inOut, out, prog} from './theme';

// Scene 1 ends at camera scale 2.15 centred on the phone thread; the same bubbles open scene 2 (match cut).
const S1_SCALE = 2.15;
const TX0 = 960 + (1121 - 1320) * S1_SCALE - 406 * S1_SCALE; // thread column x: phone screen left 1121 -> window column 406
const TY0 = 540 + (192 - 450) * S1_SCALE - 272 * S1_SCALE;

export const Works: React.FC = () => {
  const f = useCurrentFrame();
  const e = inOut(prog(f, 0, 36, (t) => t));
  const s = S1_SCALE + (1 - S1_SCALE) * e;
  const push = 1 + 0.05 * prog(f, 100, 205, inOut);
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '1300px 560px', transform: `scale(${push})`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${TX0 * (1 - e)}px, ${TY0 * (1 - e)}px) scale(${s})`}}>
          <WorkWindow f={f} />
        </div>
      </div>
      <Headline at={28} a="It works on its own" b="computer." eyebrow="For you" />
      <Subs id="works" bottom={36} />
    </AbsoluteFill>
  );
};

// Frame at which a phrase of the voice line is spoken, from its character position over the real duration.
const cueV1 = (frag: string) => {
  const L = (lines as Record<string, {dur: number; text: string}>).V1;
  return Math.round(12 + L.dur * 30 * (L.text.indexOf(frag) / L.text.length));
};
export const ASK = {cardIn: 18, named: [cueV1('Approve once'), cueV1('always allow'), cueV1('say no'), 232], cursorIn: 204, press: 238, flip: 240};

const Btn: React.FC<{label: string; w: number; kind: 'primary' | 'plain'; hot: number; press?: number}> = ({label, w, kind, hot, press = 0}) => (
  <div style={{width: w, height: 80, borderRadius: 16, boxSizing: 'border-box', background: kind === 'primary' ? C.blue : C.white, border: `3px solid ${kind === 'primary' ? C.blue : hot > 0 ? C.blue : C.line}`, color: kind === 'primary' ? '#fff' : C.ink, fontFamily: FONT.body, fontWeight: 700, fontSize: 30, display: 'grid', placeItems: 'center', transform: `scale(${1 + 0.05 * hot - 0.04 * press})`, outline: hot > 0 ? `4px solid ${C.blue}` : 'none', outlineOffset: 4, opacity: 1}}>{label}</div>
);

export const Asks: React.FC = () => {
  const f = useCurrentFrame();
  const cardE = out(prog(f, ASK.cardIn, ASK.cardIn + 24));
  const dim = 0.28 * prog(f, 6, 24);
  const hot = (i: number) => (f >= ASK.named[i] && f < ASK.named[i + 1] ? 1 : 0);
  const flip = prog(f, ASK.flip, ASK.flip + 16, inOut);
  const face = flip < 0.5 ? 0 : 1;
  const rot = flip < 0.5 ? flip * 180 : -(1 - flip) * 180;
  const cur = prog(f, ASK.cursorIn, ASK.press, inOut);
  // curved approach to "Approve once"
  const cx = 1500 + (700 - 1500) * cur;
  const cy = 900 + (770 - 900) * cur - Math.sin(cur * Math.PI) * 90;
  const press = prog(f, ASK.press - 2, ASK.press) - prog(f, ASK.press + 1, ASK.press + 5);
  const camS = 1 + 0.07 * prog(f, 20, 140, inOut) - 0.07 * prog(f, 240, 262, inOut);
  const hold = f >= ASK.press ? 1 : 0;
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '960px 580px', transform: `scale(${camS})`}}>
        <WorkWindow f={999} dim={dim} />
        <div style={{position: 'absolute', left: 520, top: 232, width: 880, height: 660, opacity: Math.min(1, cardE * 2), transform: `translateY(${(1 - cardE) * 50}px) perspective(1600px) rotateY(${rot}deg)`}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: C.white, border: `2px solid ${C.line}`, boxSizing: 'border-box', boxShadow: `14px 16px 0 ${C.ground3}`, padding: '40px 50px'}}>
            {face === 0 ? (
              <>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <AgentAvatar size={64} id="a1" bg={C.ground} status="needs-input" />
                  <span style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: C.ink2}}>Headmaster asks</span>
                </div>
                <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 92, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.02, marginTop: 26}}>Book Palm Bay<br />Resort?</div>
                <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 36, color: C.ink, marginTop: 24}}>2 nights, AED 1,140</div>
                <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 30, color: C.muted, marginTop: 6}}>Inside your AED 1,200 budget</div>
                <div style={{position: 'absolute', left: 50, bottom: 44, display: 'flex', gap: 20}}>
                  <Btn label="Approve once" w={290} kind="primary" hot={hot(0)} press={press} />
                  <Btn label="Always allow" w={270} kind="plain" hot={hot(1)} />
                  <Btn label="Deny" w={160} kind="plain" hot={hot(2)} />
                </div>
              </>
            ) : (
              <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18}}>
                <div style={{transform: `scale(${0.7 + 0.3 * out(prog(f, ASK.flip + 8, ASK.flip + 22))})`}}><AgentAvatar size={170} id="a2" bg={C.ground} status="complete" /></div>
                <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 112, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1}}>Booked</div>
                <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 34, color: C.ink2}}>Palm Bay Resort, 2 nights, AED 1,140</div>
              </div>
            )}
          </div>
        </div>
        {cur > 0 && <div style={{opacity: 1 - prog(f, ASK.press + 6, ASK.press + 16)}}><Cursor x={cx} y={cy} press={press} scale={1.15} /></div>}
      </div>
      <Headline at={6} a="It asks before" b="it books." eyebrow="For you" />
      <Subs id="asks" bottom={36} />
    </AbsoluteFill>
  );
};

export const Remembers: React.FC = () => {
  const f = useCurrentFrame();
  const drift = 50 - 100 * prog(f, 0, 189, inOut);
  return (
    <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '960px 560px', transform: `translateX(${drift}px) scale(1.04)`}}>
        <MemoryWindow f={f} />
      </div>
      <Headline at={4} a="It remembers" b="you." eyebrow="For you" />
      <Subs id="remembers" bottom={36} />
    </AbsoluteFill>
  );
};
