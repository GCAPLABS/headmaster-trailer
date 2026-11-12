# Sound for Film2: music take A in segments, the narration placed line by line, music ducked under the voice,
# then a compressor and a limiter at -1 dBFS. Reads src/film2.json, the same timeline the picture reads.
import json, subprocess, sys, numpy as np
R = 48000
root = sys.argv[1]
TL = json.load(open(f'{root}/src/film2.json'))
W = json.load(open(f'{root}/src/vo-words.json'))
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(R), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
vo = load(f'{root}/public/vo-a.mp3')
_cache = {}
def src(name):
    if name not in _cache: _cache[name] = load(f'{root}/public/{name}')
    return _cache[name]
N = int(TL['total'] / TL['fps'] * R)
mus = np.zeros((N, 2), np.float32); voice = np.zeros((N, 2), np.float32); mask = np.zeros(N, np.float32)
def ramp(n, a, b):
    return np.linspace(a, b, max(n, 1), dtype=np.float32)[:, None]
for m in TL['music']:
    s, d, t = int(m['src'] * R), int(m['dur'] * R), int(m['film'] * R)
    seg = src(m.get('src_file', 'music-a.mp3'))[s:s + d].copy() * (10 ** (m.get('gain', 0) / 20))
    fi, fo = int(m.get('fadeIn', 0.01) * R), int(m.get('fadeOut', 0.01) * R)
    seg[:fi] *= ramp(fi, 0, 1)[:len(seg[:fi])]; seg[-fo:] *= ramp(fo, 1, 0)[-len(seg[-fo:]):]
    e = min(N, t + len(seg)); mus[t:e] += seg[:e - t]
for a, b, at, _ in TL['vo']:
    nxt = W[b + 1][0] if b + 1 < len(W) else W[b][1] + 0.4
    s0, s1 = int(max(0, W[a][0] - 0.06) * R), int(min(W[b][1] + 0.3, nxt - 0.04) * R)
    seg = vo[s0:s1].copy(); f = int(0.012 * R); seg[:f] *= ramp(f, 0, 1); seg[-f * 3:] *= ramp(f * 3, 1, 0)
    t = int(at * R); e = min(N, t + len(seg)); voice[t:e] += seg[:e - t]
    if at >= TL['duck']['from']: mask[t:e] = 1
for x in TL.get('extra', []):
    seg = src(x['file'])[int(x['src'] * R):int(x['end'] * R)].copy(); f = int(0.012 * R); seg[:f] *= ramp(f, 0, 1); seg[-f * 3:] *= ramp(f * 3, 1, 0)
    t = int(x['film'] * R); e = min(N, t + len(seg)); voice[t:e] += seg[:e - t]; mask[t:e] = 1
sfx = np.zeros((N, 2), np.float32)
for x in TL.get('sfx', []):
    seg = src(x['file']) * (10 ** (x['db'] / 20)); t = int(x['film'] * R); e = min(N, t + len(seg)); sfx[t:e] += seg[:e - t]
# Hold the duck across short gaps between lines, so the bed sits steady instead of pumping up and down.
hold = int(TL['duck'].get('hold', 0) * R)
if hold:
    on_i = np.flatnonzero(mask > 0.5)
    if len(on_i):
        br = np.flatnonzero(np.diff(on_i) > 1)
        for k in br:
            a0, b0 = on_i[k], on_i[k + 1]
            if b0 - a0 < hold: mask[a0:b0] = 1
# Smooth duck envelope: 0.15 s attack, 0.5 s release.
env = np.zeros(N, np.float32); g = 0.0; att, rel = 1 / (0.15 * R), 1 / (0.5 * R)
step = 64
for i in range(0, N, step):
    tgt = mask[i]; g = min(tgt, g + att * step) if tgt > g else max(tgt, g - rel * step); env[i:i + step] = g
duck = 10 ** (TL['duck']['db'] * env / 20)
G = TL.get('gains', {}); mb = mus * duck[:, None] * G.get('music', 0.8); vb = voice * G.get('voice', 1.25)
mix = mb + vb + sfx
on = mask > 0.5
def db(x): return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)
print(f'under the voice: voice {db(vb[on]):.1f} dB, music {db(mb[on]):.1f} dB, voice over music {db(vb[on]) - db(mb[on]):.1f} dB; music alone {db(mb[~on]):.1f} dB')
# Gentle compressor (4:1 over -18 dBFS, 10 ms / 150 ms), then a brick-wall limiter at -1 dBFS.
lvl = np.abs(mix).max(axis=1); env2 = np.zeros(N, np.float32); g = 0.0
a1, r1 = np.exp(-1 / (0.01 * R)), np.exp(-1 / (0.15 * R))
for i in range(0, N, step):
    x = lvl[i:i + step].max(); g = a1 * g + (1 - a1) * x if x > g else r1 * g + (1 - r1) * x; env2[i:i + step] = g
th = 10 ** (-18 / 20)
gain = np.where(env2 > th, (th * (env2 / th) ** 0.25) / np.maximum(env2, 1e-9), 1.0)
mix = mix * gain[:, None] * 10 ** (8.5 / 20)
ceil = 10 ** (-1 / 20); peak = np.abs(mix).max()
mix = np.tanh(mix / ceil) * ceil if peak > ceil else mix
mix = np.clip(mix, -ceil, ceil)
import wave
with wave.open(f'{root}/public/film2-mix.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(R); w.writeframes((mix * 32767).astype('<i2').tobytes())
h = R // 2
rms = [20 * np.log10(np.sqrt((mix[i:i + h] ** 2).mean()) + 1e-9) for i in range(0, N, h)]
print('peak dBFS', round(20 * np.log10(np.abs(mix).max()), 2))
print(' '.join(f'{i/2:.1f}:{r:.0f}' for i, r in enumerate(rms)))
