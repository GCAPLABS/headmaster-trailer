"""Hook sound: soft piano-like notes on a 120 bpm grid, a low hit on every montage cut, a held chord under "And this?".
numpy only, no samples. Usage: python3 tools/trailer_audio.py public/trailer-hook.wav"""
import sys, wave
import numpy as np
SR = 44100; FPS = 30
OUT = sys.argv[1]
TOTAL = 480 / FPS + 0.5
N = int(TOTAL * SR)
buf = np.zeros(N)
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(sig, t):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < N: buf[i:j] += sig[: j - i]
def piano(m, dur=2.4, v=0.18):
    t = np.arange(int(dur * SR)) / SR; f = mf(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.6 + k * 0.9)) for k, a in [(1, 1), (2, 0.42), (3, 0.18), (4, 0.08)])
    att = np.minimum(1, t / 0.004)
    return s * att * v
def hit(v=0.5):
    t = np.arange(int(0.6 * SR)) / SR
    f = 55 + 60 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * v
def tick(v=0.08):
    n = int(0.03 * SR); rng = np.random.default_rng(1)
    return rng.standard_normal(n) * np.exp(-np.arange(n) / (0.004 * SR)) * v
fr = lambda f: f / FPS
# words appearing (line 1 and 2): one soft note per beat, A minor colour
for k, m in enumerate([69, 72, 76, 74]):
    add(piano(m, v=0.14), fr(8 + k * 15))
add(piano(57, 4, 0.12), fr(40)); add(piano(64, 4, 0.1), fr(40))
for k, m in enumerate([67, 69]):
    add(piano(m, v=0.14), fr(96 + k * 22))
# montage: a hit and a rising note on every cut (8 cuts, 1 s per pair)
seq = [57, 60, 62, 64, 65, 67, 69, 72]
for k in range(8):
    t = fr(150 + k * 30)
    add(hit(0.42 if k % 2 == 0 else 0.25), t)
    add(piano(seq[k], v=0.16), t); add(piano(seq[k] - 12, v=0.1), t)
    add(tick(), t)
# silence beat, then "And this?": held open chord
for m in [53, 60, 64, 69]:
    add(piano(m, 3.2, 0.12), fr(400))
x = buf / (np.max(np.abs(buf)) + 1e-9) * 0.89
st = np.stack([x, x], 1)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print('wrote', OUT, round(TOTAL, 2), 's')
