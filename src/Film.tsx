import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Ask} from './Opening';
import {Asks, Remembers, Works} from './Scenes1';
import {Anywhere, Close, Overnight, Profiles} from './Scenes2';
import {useFonts} from './kit';
import {C} from './theme';
import {Call, Mail, OneApp, Receipts, Split, Team, Versus, Weekly} from './Scenes3';
import {Plan, Store, Takeover, Work} from './Scenes4';
import TL from './timeline-long.json';

const SCENES: Record<string, React.FC> = {
  ask: Ask, works: Works, takeover: Takeover, asks: Asks, vs: Versus, remembers: Remembers, mail: Mail, anywhere: Anywhere, call: Call,
  work: Work, receipt: Receipts, weekly: Weekly, overnight: Overnight, profiles: Profiles, split: Split, team: Team,
  store: Store, plan: Plan, oneapp: OneApp, close: Close,
};

export const Film: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: C.ground}}>
      <Audio src={staticFile('bed-long.wav')} volume={0.8} />
      {TL.scenes.map((s) => {
        const Scene = SCENES[s.id];
        return (
          <Sequence key={s.id} from={s.start} durationInFrames={s.dur} layout="none">
            <AbsoluteFill><Scene /></AbsoluteFill>
            <Sequence from={TL.voiceOffset} layout="none"><Audio src={staticFile(`vo/${s.line}.mp3`)} volume={1} /></Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
