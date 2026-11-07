import React from 'react';
import {useVideoConfig} from 'remotion';
import {C, FONT} from './theme';
import {sp} from './kit';

export const REQUEST = 'Book a beach weekend for two, under AED 1,200.';

export type Skin = {out: [string, string]; inn: [string, string]};
export const GREEN: Skin = {out: [C.chatOut, C.ink], inn: [C.white, C.ink]};
export const STUDIO: Skin = {out: [C.blue, '#ffffff'], inn: [C.ground, C.ink]};

export const Bubble: React.FC<{f: number; at: number; top: number; out?: boolean; children: React.ReactNode; time?: string; edge?: number; maxWidth?: number; skin?: Skin}> = ({f, at, top, out: o, children, time = '09:41', edge = 18, maxWidth = 352, skin = GREEN}) => {
  const {fps} = useVideoConfig();
  const s = sp(f, at, fps, {damping: 16, stiffness: 190, mass: 0.7});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', top, [o ? 'right' : 'left']: edge, maxWidth, opacity: Math.min(1, s * 2.2), transform: `translateY(${(1 - s) * 26}px) scale(${0.94 + 0.06 * s})`, transformOrigin: o ? '100% 100%' : '0 100%'}}>
      <div style={{background: (o ? skin.out : skin.inn)[0], borderRadius: o ? '22px 22px 6px 22px' : '22px 22px 22px 6px', padding: '13px 16px 12px 18px', fontFamily: FONT.body, fontSize: 27, lineHeight: '34px', color: (o ? skin.out : skin.inn)[1], fontWeight: 500}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 12}}>
          <div>{children}</div>
          {time && <span style={{fontSize: 17, color: o && skin === STUDIO ? '#c8c8ff' : C.muted, fontWeight: 500, whiteSpace: 'nowrap', paddingBottom: 3}}>{time}</span>}
        </div>
      </div>
    </div>
  );
};

export const HeaderGreen: React.FC<{avatar: React.ReactNode; height?: number; padTop?: number; sub?: string}> = ({avatar, height = 112, padTop = 10, sub = 'WhatsApp'}) => (
  <div style={{position: 'absolute', left: 0, top: 0, right: 0, height, background: C.chatHead, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', paddingTop: padTop}}>
    {avatar}
    <div>
      <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 31, color: '#fff', lineHeight: '34px'}}>Headmaster</div>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 21, color: '#d4ecdf', lineHeight: '26px'}}>{sub}</div>
    </div>
  </div>
);

// The first lines of the hotel thread, identical on the phone (scene 1) and in the app window (scene 2).
export const ThreadTop: React.FC<{f: number; at?: number; edge?: number}> = ({f, at = -100, edge = 18}) => (
  <>
    <Bubble f={f} at={at} top={22} time="09:40" edge={edge}>Hi. How can I help?</Bubble>
    <Bubble f={f} at={at} top={116} out edge={edge}>{REQUEST}</Bubble>
    <Bubble f={f} at={at} top={262} edge={edge}>On it. I will ask before I book.</Bubble>
  </>
);

// The finished thread, shown on every surface in the "anywhere" scene.
export const ThreadDone: React.FC<{f: number; at?: number; skin: Skin; edge?: number; maxWidth?: number}> = ({f, at = -100, skin, edge = 18, maxWidth = 352}) => (
  <>
    <Bubble f={f} at={at} top={22} time="09:40" edge={edge} skin={skin} maxWidth={maxWidth}>Hi. How can I help?</Bubble>
    <Bubble f={f} at={at} top={116} out edge={edge} skin={skin} maxWidth={maxWidth}>{REQUEST}</Bubble>
    <Bubble f={f} at={at} top={262} edge={edge} skin={skin} maxWidth={maxWidth} time="09:44">Booked. Palm Bay Resort, 2 nights, AED 1,140.</Bubble>
  </>
);
