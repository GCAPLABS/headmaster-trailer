"""Full trailer sound, synthesised (numpy only). Retro half: sparse minor piano, hits on cuts, old-OS dings and clicks.
After the CRT switches off: a warm major chord, a soft 120 bpm pulse and brighter piano. Mastered, limited to -1 dBFS.
Usage: python3 tools/trailer_audio_full.py public/trailer-full.wav"""
import sys, wave, json
import numpy as np
TL = json.load(open("src/trailer-timeline.json")); A = TL["acts"]; L = TL["local"]
SR = 44100; FPS = TL["fps"]; TOTAL_F = TL["total"]
N = int((TOTAL_F / FPS + 1.0) * SR)
buf = np.zeros(N)
rng = np.random.default_rng(3)
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
fr = lambda f: f / FPS
def add(sig, t, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if 0 <= i < N: buf[i:j] += sig[: j - i] * g
def piano(m, dur=2.4, v=0.16):
    t = np.arange(int(dur * SR)) / SR; f = mf(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.5 + k * 0.9)) for k, a in [(1, 1), (2, 0.42), (3, 0.18), (4, 0.08)])
    return s * np.minimum(1, t / 0.004) * v
def pad(ms, dur, v=0.05):
    t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
    return sum(np.sin(2 * np.pi * mf(m) * 0.998 * t) + np.sin(2 * np.pi * mf(m) * 1.002 * t) for m in ms) * env * v
def hit(v=0.45):
    t = np.arange(int(0.6 * SR)) / SR; f = 55 + 60 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * v
def click(v=0.12):
    n = int(0.025 * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / (0.003 * SR)) * v
def key(v=0.07):
    n = int(0.04 * SR); t = np.arange(n) / SR
    return (rng.standard_normal(n) * 0.6 + np.sin(2 * np.pi * 1800 * t)) * np.exp(-t * 160) * v
def ding(v=0.12):
    a = piano(88, 0.8, v) ; b = piano(84, 0.9, v); out = np.zeros(len(a) + int(0.12 * SR)); out[:len(a)] += a; out[int(0.12 * SR):int(0.12 * SR) + len(b)] += b[: len(out) - int(0.12 * SR)]
    return out
def whoosh_down(dur=0.45, v=0.3):
    t = np.arange(int(dur * SR)) / SR; f = 900 * np.exp(-t * 7) + 60
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4) * v + rng.standard_normal(len(t)) * np.exp(-t * 9) * v * 0.3
def chime(v=0.14):
    s = np.zeros(int(1.6 * SR))
    for k, m in enumerate([72, 76, 79, 84]):
        p = piano(m, 1.4, v); i = int(k * 0.07 * SR); s[i:i + len(p)] += p[: len(s) - i]
    return s

# ---- Act 1 hook (same as the opening render)
for k, m in enumerate([69, 72, 76, 74]): add(piano(m, v=0.14), fr(8 + k * 15))
add(piano(57, 4, 0.12), fr(40)); add(piano(64, 4, 0.1), fr(40))
for k, m in enumerate([67, 69]): add(piano(m, v=0.14), fr(96 + k * 22))
seq = [57, 60, 62, 64, 65, 67, 69, 72]
for k in range(8):
    t = fr(150 + k * 30); add(hit(0.42 if k % 2 == 0 else 0.25), t); add(piano(seq[k], v=0.16), t); add(piano(seq[k] - 12, v=0.1), t); add(click(0.08), t)
for m in [53, 60, 64, 69]: add(piano(m, 3.2, 0.12), fr(400))

# ---- Act 2: windows pop, reminders ding, minor pulse
add(pad([45, 52, 57, 60], fr(480), 0.035), fr(480))
e0 = A['evolved'][0]; ev = L['evolved']
for f0 in ev['wins'] + [ev['reminder'], ev['sync'], ev['assistant']]: add(click(0.14), fr(e0 + f0)); add(hit(0.14), fr(e0 + f0))
mel = [(480, 69), (510, 72), (540, 71), (600, 69), (630, 67), (660, 64), (720, 57), (780, 60), (840, 64), (870, 62), (900, 60)]
for f0, m in mel: add(piano(m, v=0.12), fr(f0)); add(piano(m - 24, v=0.07), fr(f0))
for f0 in range(480, 960, 30): add(hit(0.12), fr(f0))
add(ding(0.1), fr(e0 + ev['reminder']))
for f0 in L['remind']['dialogs']: add(ding(0.1), fr(A['remind'][0] + f0))
add(hit(0.4), fr(720)); add(hit(0.4), fr(840))

# ---- Act 3: typing, CRT off, silence, warm landing
u0 = A['until'][0]; U = L['until']
for k in range(2): add(key(0.1), fr(u0 + U['type'] + k * 10))
add(whoosh_down(), fr(u0 + U['offA'])); add(hit(0.35), fr(u0 + U['offB']))
LAND = u0 + U['land']
for m in [48, 55, 60, 64, 67, 72]: add(piano(m, 5.0, 0.13), fr(LAND))
add(pad([48, 55, 60, 64], fr(1220), 0.04), fr(LAND))
# the beat drops on the landing: kick on every beat, hats on off-beats, until the gallery
def kick(v=0.35):
    t = np.arange(int(0.35 * SR)) / SR; f = 45 + 90 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * v
def hat(v=0.04):
    n = int(0.05 * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / (0.008 * SR)) * v
for f0 in range(LAND, A['gallery'][0], 15):
    add(kick(0.3 if (f0 - LAND) % 30 == 0 else 0.16), fr(f0)); add(hat(), fr(f0 + 7.5))

# ---- Act 4: product. Soft 120 bpm pulse, C G Am F arpeggios, real UI sounds.
prog_ = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]
for b, f0 in enumerate(range(A['ask'][0], A['gallery'][0], 60)):
    ch = prog_[b % 4]
    add(piano(ch[0] - 24, 2.2, 0.12), fr(f0))
    for k in range(4): add(piano(ch[k] + 12, 1.2, 0.06), fr(f0 + k * 15))
    add(hit(0.1), fr(f0)); add(hit(0.06), fr(f0 + 30))
add(pad([48, 55, 60, 64], fr(A['gallery'][0] - A['ask'][0]), 0.03), fr(A['ask'][0]))
a0 = A['ask'][0]; K = L['ask']
for i in range(15): add(key(0.06), fr(a0 + K['typeAt'] + i * K['per']))
add(whoosh_down(0.25, 0.12), fr(a0 + K['sent'])); add(ding(0.06), fr(a0 + K['reply']))
s0 = A['screen'][0]; S = L['screen']
for f0 in [s0 + S['click'], s0 + S['page2'] + S['click']]: add(click(0.18), fr(f0)); add(piano(84, 0.6, 0.06), fr(f0 + 4))
l0 = A['list'][0]; Li = L['list']
for f0 in Li['ticks']: add(piano(79, 0.8, 0.08), fr(l0 + f0)); add(click(0.1), fr(l0 + f0))
add(click(0.22), fr(l0 + Li['tap'])); add(chime(0.12), fr(l0 + Li['tap'] + 4))

# ---- Act 5: gallery and end card
add(pad([53, 60, 64, 69], fr(A['end'][1] - A['gallery'][0]), 0.04), fr(A['gallery'][0]))
g0 = A['gallery'][0]
for k, m in enumerate([72, 71, 69, 67, 69]): add(piano(m, 2.5, 0.11), fr(g0 + k * 30))
for m in [41, 53, 60, 64, 69, 72]: add(piano(m, 6.0, 0.12), fr(g0 + L['gallery']['line2']))
for m in [48, 55, 60, 64, 67, 72, 76]: add(piano(m, 7.0, 0.12), fr(A['end'][0]))
add(hit(0.3), fr(A['end'][0]))

# ---- master: soft compression, limit -1 dBFS, fade tail
x = buf.copy()
env = np.sqrt(np.convolve(x ** 2, np.ones(2048) / 2048, mode='same')) + 1e-6
thr = 0.25; gain = np.where(env > thr, (thr + (env - thr) / 3) / env, 1.0)
x = x * gain
x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
tail = int(1.5 * SR); x[-tail:] *= np.linspace(1, 0, tail)
st = np.stack([x, x], 1)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
hs = int(SR / 2); rms = [20 * np.log10(np.sqrt(np.mean(x[i:i + hs] ** 2)) + 1e-9) for i in range(0, len(x) - hs, hs)]
print('loudness per 0.5 s (dBFS):', ' '.join(f'{v:.0f}' for v in rms))
