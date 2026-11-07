import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {ContactShadows, Environment, PerspectiveCamera, RoundedBox, useGLTF, useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {inOut} from './theme';

// The museum ending, built for real in 3D: a long white room, plinths, and real objects that tell the same story as the
// opening (light, money, computers, music, games, the phone, the old paper to-do list), ending on our icon.
// Models and the lighting environment: Poly Haven (CC0). Rendered with @remotion/three (React Three Fiber).
const EXHIBITS = ['vintage_oil_lamp', 'CashRegister_01', 'Television_01', 'classic_laptop', 'portable_cassette_player', 'vintage_telephone_wall_clock', 'binder_notebook'];
// Flat objects stand up a little so they read from the camera.
const TILT: Record<string, number> = {binder_notebook: -1.1, portable_cassette_player: -0.5};
const GAP = 2.4;
export const ICON_X = EXHIBITS.length * GAP;
const PLINTH_H = 1.0;

const Model: React.FC<{name: string; size?: number; tilt?: number}> = ({name, size = 0.75, tilt = 0}) => {
  const {scene} = useGLTF(staticFile(`models/${name}/${name}.gltf`));
  const obj = useMemo(() => {
    const o = scene.clone(true);
    o.rotation.x = tilt; o.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(o);
    const s = new THREE.Vector3(); box.getSize(s);
    const k = size / Math.max(s.x, s.y, s.z);
    o.scale.setScalar(k);
    const b2 = new THREE.Box3().setFromObject(o); const c = new THREE.Vector3(); b2.getCenter(c);
    o.position.set(-c.x, -b2.min.y, -c.z);
    o.traverse((m) => { if ((m as THREE.Mesh).isMesh) { (m as THREE.Mesh).castShadow = true; } });
    return o;
  }, [scene, size, tilt]);
  return <primitive object={obj} />;
};

const Plinth: React.FC<{x: number; children?: React.ReactNode; glow?: number}> = ({x, children, glow = 0}) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <group position={[x, 0, 0]}>
      <RoundedBox args={[0.9, PLINTH_H, 0.9]} radius={0.02} position={[0, PLINTH_H / 2, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#f4f3f0" roughness={0.85} />
      </RoundedBox>
      <group position={[0, PLINTH_H, 0]} rotation={[0, -0.35, 0]}>{children}</group>
      <primitive object={target} position={[0, PLINTH_H, 0]} />
      <spotLight position={[0, 3.6, 0.7]} angle={0.42} penumbra={0.8} intensity={14 + 40 * glow} distance={6} decay={1.5} color="#fff8ee" castShadow target={target} />
    </group>
  );
};

// Our icon as a lit tile: a rounded slab with the real icon on its face.
const IconTile: React.FC<{glow: number}> = ({glow}) => {
  const tex = useTexture(staticFile('icon-1024.png'));
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <group position={[0, 0.34, 0]}>
      <RoundedBox args={[0.66, 0.66, 0.12]} radius={0.13} smoothness={6} castShadow>
        <meshStandardMaterial color="#14141c" roughness={0.35} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0605]}>
        <planeGeometry args={[0.66, 0.66]} />
        <meshStandardMaterial map={tex} transparent roughness={0.4} emissive="#c9c9f5" emissiveIntensity={0.06 + 0.25 * glow} emissiveMap={tex} />
      </mesh>
    </group>
  );
};

const Camera: React.FC<{f: number}> = ({f}) => {
  // Dolly past the exhibits during "Everything we make finds its next form", ease onto the notebook for
  // "Your to-do list waited fifty years", then push in on our icon for "Its next form starts today".
  const x = interpolate(f, [0, 110, 200, 255, 300], [-0.6, (EXHIBITS.length - 1) * GAP, (EXHIBITS.length - 1) * GAP + 0.25, ICON_X, ICON_X], {extrapolateRight: 'clamp', easing: inOut});
  const z = interpolate(f, [0, 120, 200, 300], [3.4, 2.7, 2.6, 2.2], {extrapolateRight: 'clamp', easing: inOut});
  const y = interpolate(f, [0, 300], [1.6, 1.42], {extrapolateRight: 'clamp'});
  const lookAhead = interpolate(f, [0, 110, 200, 260], [1.2, 0.15, 0.15, 0], {extrapolateRight: 'clamp'});
  return <PerspectiveCamera makeDefault position={[x - 0.8 * lookAhead, y, z]} fov={38} onUpdate={(c) => c.lookAt(x + lookAhead, 1.25, 0)} />;
};

const Room: React.FC<{f: number}> = ({f}) => {
  const glow = interpolate(f, [235, 265], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Camera f={f} />
      <color attach="background" args={['#f3f2ef']} />
      <fog attach="fog" args={['#f3f2ef', 10, 24]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 8, 6]} intensity={0.6} />
      <Environment files={staticFile('models/studio.hdr')} environmentIntensity={0.9} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ICON_X / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#dcdad5" roughness={0.45} />
      </mesh>
      <mesh position={[ICON_X / 2, 4, -2.2]}>
        <planeGeometry args={[60, 8]} />
        <meshStandardMaterial color="#fbfaf8" roughness={1} />
      </mesh>
      {EXHIBITS.map((n, i) => (
        <Plinth key={n} x={i * GAP}><Model name={n} size={0.85} tilt={TILT[n] ?? 0} /></Plinth>
      ))}
      <Plinth x={ICON_X} glow={glow}><IconTile glow={glow} /></Plinth>
      <ContactShadows position={[ICON_X / 2, 0.002, 0]} width={60} height={8} opacity={0.35} blur={2.4} far={2} frames={1} />
    </>
  );
};

export const Gallery3D: React.FC<{f?: number}> = ({f}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping}}>
      <Room f={f ?? frame} />
    </ThreeCanvas>
  );
};
