import React from 'react';
import {AgentAvatar} from './Agent';
import {NavIcon, NavName} from './kit';
import {C, FONT} from './theme';
import {HeaderGreen} from './ThreadUI';

// Phone body 430x880, screen 398x848 inside: the same geometry as scene 1, scaled and placed anywhere.
export const PhoneBody: React.FC<{x: number; y: number; scale: number; studio?: boolean; id: string; children?: React.ReactNode; dim?: number; buzz?: number; overlay?: React.ReactNode}> = ({x, y, scale, studio, id, children, dim = 0, buzz = 0, overlay}) => (
  <div style={{position: 'absolute', left: x + buzz, top: y, width: 430, height: 880, transformOrigin: '0 0', transform: `scale(${scale})`}}>
    <div style={{position: 'absolute', left: 16, top: 22, width: 430, height: 880, borderRadius: 66, background: C.ground3}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 430, height: 880, borderRadius: 66, background: C.dark}} />
    <div style={{position: 'absolute', left: 16, top: 16, width: 398, height: 848, borderRadius: 50, overflow: 'hidden', background: studio ? C.white : C.chatPaper}}>
      {studio ? (
        <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 112, background: C.white, borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', paddingTop: 10, boxSizing: 'border-box'}}>
          <AgentAvatar size={60} id={id} bg={C.ground} />
          <div>
            <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 31, color: C.ink, lineHeight: '34px'}}>Headmaster</div>
            <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 21, color: C.muted, lineHeight: '26px'}}>your agent</div>
          </div>
        </div>
      ) : <HeaderGreen avatar={<AgentAvatar size={64} id={id} />} />}
      <div style={{position: 'absolute', left: 0, top: 112, right: 0, bottom: 108}}>{children}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.field, borderTop: `2px solid ${C.line}`}}>
        <div style={{position: 'absolute', left: 16, top: 20, width: 272, height: 68, borderRadius: 34, background: C.white, border: `2px solid ${C.line}`}}><span style={{position: 'absolute', left: 22, top: 17, fontFamily: FONT.body, fontSize: 27, color: C.muted}}>Message</span></div>
        <div style={{position: 'absolute', right: 16, top: 20, width: 68, height: 68, borderRadius: 34, background: studio ? C.blue : C.chatHead}} />
      </div>
      {overlay && <div style={{position: 'absolute', inset: 0}}>{overlay}</div>}
      {dim > 0 && <div style={{position: 'absolute', inset: 0, background: C.ground, opacity: dim}} />}
    </div>
    <div style={{position: 'absolute', left: 430 / 2 - 46, top: 26, width: 92, height: 26, borderRadius: 13, background: C.dark}} />
  </div>
);

const NAVS: {name: NavName; label: string}[] = [{name: 'chat', label: 'Chat'}, {name: 'files', label: 'Files'}, {name: 'memory', label: 'Memory'}, {name: 'profiles', label: 'Profiles'}, {name: 'skills', label: 'Extensions'}];

// Laptop with the desktop app: sidebar plus the green thread pane. Screen 880x540.
export const Laptop: React.FC<{cx: number; deskY: number; children: React.ReactNode; dim?: number}> = ({cx, deskY, children, dim = 0}) => {
  const top = deskY - 22 - 572;
  return (
    <>
      <div style={{position: 'absolute', left: cx - 456 + 14, top: top + 16, width: 912, height: 572, borderRadius: 26, background: C.ground3}} />
      <div style={{position: 'absolute', left: cx - 456, top, width: 912, height: 572, borderRadius: 26, background: C.dark}} />
      <div style={{position: 'absolute', left: cx - 440, top: top + 16, width: 880, height: 540, borderRadius: 10, overflow: 'hidden', background: C.white}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 190, height: 540, background: C.field, borderRight: `2px solid ${C.line}`}}>
          <div style={{position: 'absolute', left: 14, top: 18, display: 'flex', alignItems: 'center', gap: 10}}><AgentAvatar size={38} id="lp1" bg={C.ground} /><span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 21, color: C.ink}}>Headmaster</span></div>
          <div style={{position: 'absolute', left: 10, top: 84, width: 170, height: 46, borderRadius: 10, background: C.ground}} />
          {NAVS.map((n, i) => (
            <div key={n.name} style={{position: 'absolute', left: 22, top: 84 + i * 50, height: 46, display: 'flex', alignItems: 'center', gap: 12}}>
              <NavIcon name={n.name} color={i === 0 ? C.blue : C.ink2} size={26} />
              <span style={{fontFamily: FONT.body, fontWeight: i === 0 ? 700 : 500, fontSize: 22, color: i === 0 ? C.ink : C.ink2}}>{n.label}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 190, top: 0, right: 0, bottom: 0, background: C.chatPaper}}>
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 66, background: C.chatHead, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px'}}>
            <AgentAvatar size={44} id="lp2" />
            <span style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 24, color: '#fff'}}>Headmaster</span>
          </div>
          <div style={{position: 'absolute', left: 0, top: 66, width: 690 / 0.78, height: 474 / 0.78, transformOrigin: '0 0', transform: 'scale(0.78)'}}>{children}</div>
        </div>
        {dim > 0 && <div style={{position: 'absolute', inset: 0, background: C.ground, opacity: dim}} />}
      </div>
      <div style={{position: 'absolute', left: cx - 540, top: deskY - 22, width: 1080, height: 22, borderRadius: '0 0 18px 18px', background: C.ground3}} />
      <div style={{position: 'absolute', left: cx - 90, top: deskY - 22, width: 180, height: 8, borderRadius: '0 0 8px 8px', background: C.ground2}} />
    </>
  );
};

// Desktop monitor showing the web app in a browser tab. Screen 884x526.
export const Monitor: React.FC<{cx: number; deskY: number; children: React.ReactNode; dim?: number}> = ({cx, deskY, children, dim = 0}) => {
  const top = deskY - 96 - 562;
  return (
    <>
      <div style={{position: 'absolute', left: cx - 230, top: deskY - 96, width: 460, height: 96}}>
        <div style={{position: 'absolute', left: 190, top: 0, width: 80, height: 76, background: C.ground3}} />
        <div style={{position: 'absolute', left: 60, top: 76, width: 340, height: 20, borderRadius: 10, background: C.ground3}} />
      </div>
      <div style={{position: 'absolute', left: cx - 460 + 14, top: top + 16, width: 920, height: 562, borderRadius: 22, background: C.ground3}} />
      <div style={{position: 'absolute', left: cx - 460, top, width: 920, height: 562, borderRadius: 22, background: C.dark}} />
      <div style={{position: 'absolute', left: cx - 442, top: top + 18, width: 884, height: 526, borderRadius: 8, overflow: 'hidden', background: C.white}}>
        <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 48, background: C.ground}}>
          <div style={{position: 'absolute', left: 16, top: 10, width: 230, height: 38, borderRadius: '12px 12px 0 0', background: C.white, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxSizing: 'border-box'}}>
            <AgentAvatar size={24} id="mn1" bg={C.ground} />
            <span style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 19, color: C.ink}}>Headmaster</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 48, right: 0, height: 50, background: C.white, borderBottom: `2px solid ${C.line}`}}>
          <div style={{position: 'absolute', left: 90, top: 7, width: 560, height: 36, borderRadius: 18, background: C.field, border: `2px solid ${C.line}`, boxSizing: 'border-box', fontFamily: FONT.body, fontWeight: 500, fontSize: 20, color: C.ink2, lineHeight: '32px', paddingLeft: 18}}>headmaster.gcaplabs.com</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 98, right: 0, bottom: 0, background: C.white}}>
          <div style={{position: 'absolute', left: (884 - 520 * 0.9) / 2, top: 8, width: 520, height: 520, transformOrigin: '0 0', transform: 'scale(0.9)'}}>{children}</div>
        </div>
        {dim > 0 && <div style={{position: 'absolute', inset: 0, background: C.ground, opacity: dim}} />}
      </div>
    </>
  );
};
