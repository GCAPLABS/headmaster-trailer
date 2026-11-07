import {Composition} from 'remotion';
import {Opening} from './Opening';
import {Film} from './Film';
import TL from './timeline-long.json';
import {Trailer, T} from './Full';
import {H2, Hook2Film} from './Hook2';
import {Film2, FILM2_TOTAL} from './Film2';
import {Gallery3D} from './Gallery3D';
import {FrameDemo, FrameGallery, FramePivot, FrameReveal, H, HookFilm} from './Trailer';

export const Root = () => (
  <>
    <Composition id="FilmLong" component={Film} durationInFrames={TL.total} fps={30} width={1920} height={1080} />
    <Composition id="Opening" component={Opening} durationInFrames={225} fps={30} width={1920} height={1080} />
    <Composition id="TrailerHook" component={HookFilm} durationInFrames={H.end} fps={30} width={1920} height={1080} />
    <Composition id="FramePivot" component={FramePivot} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="FrameReveal" component={FrameReveal} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="FrameDemo" component={FrameDemo} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="FrameGallery" component={FrameGallery} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Trailer" component={Trailer} durationInFrames={T.total} fps={30} width={1920} height={1080} />
    <Composition id="Hook2" component={Hook2Film} durationInFrames={H2.end} fps={30} width={1920} height={1080} />
    <Composition id="Film2" component={Film2} durationInFrames={FILM2_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="Gallery3D" component={Gallery3D} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
