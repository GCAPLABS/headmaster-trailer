"""Synthesised music bed plus soft ticks and whooshes (numpy only, no samples), written to public/bed.wav.
The bed is ducked under the real voice lines so the voice stays clearly on top."""
import json, subprocess, sys, wave
import numpy as np
SR = 44100
TL = sys.argv[1] if len(sys.argv) > 1 else 'src/timeline.json'
OUT = sys.argv[2] if len(sys.argv) > 2 else OUT
T = json.load(open(TL))
def movavg(x, k):
    c = np.concatenate([[0], np.cumsum(x)])
    h = k // 2
    idx = np.arange(len(x))
    lo = np.clip(idx - h, 0, len(x)); hi = np.clip(idx - h + k, 0, len(x))
    return (c[hi] - c[lo]) / k
FPS = T['fps']
total = T['total'] / FPS + 1.0
N = int(total * SR)
rng = np.random.default_rng(7)

def tone(freq, dur, kind='sine'):
    t = np.arange(int(dur * SR)) / SR
    if kind == 'tri':
        return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * freq * t))
    return np.sin(2 * np.pi * freq * t)

def add(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if i < len(buf):
        buf[i:j] += sig[: j - i]

# ---- music: slow pads on Am - F - C - G, soft bass, sparse plucks. 92 bpm.
bpm = 92
beat = 60 / bpm
bar = 4 * beat
CH = [([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41), ([48, 52, 55, 59], 36), ([55, 59, 62, 66], 43)]
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
music = np.zeros(N)
nbars = int(total / bar) + 2
for b in range(nbars):
    notes, bass = CH[b % 4]
    t0 = b * bar
    dur = bar + 0.8
    env = np.minimum(1, np.arange(int(dur * SR)) / (0.9 * SR)) * np.minimum(1, (dur * SR - np.arange(int(dur * SR))) / (0.9 * SR))
    for k, n in enumerate(notes):
        f0 = mf(n)
        sig = (tone(f0 * 0.997, dur) + tone(f0 * 1.003, dur) + 0.35 * tone(f0 * 2, dur, 'tri')) * env * 0.05
        add(music, sig, t0)
    add(music, tone(mf(bass), dur) * env * 0.16, t0)
    for s in range(8):  # eighth-note plucks, sparse pattern
        if (s in (0, 3, 5) and b % 2 == 0) or (s in (2, 6) and b % 2 == 1):
            n = notes[(s * 3 + b) % 4] + 12
            d = 1.2
            e = np.exp(-np.arange(int(d * SR)) / SR * 4.5)
            add(music, (tone(mf(n), d) + 0.3 * tone(mf(n) * 2, d)) * e * 0.05, t0 + s * beat / 2)
music = music / np.max(np.abs(music)) * 0.075
# fade in and out
fi, fo = int(1.2 * SR), int(2.6 * SR)
end = int(T['total'] / FPS * SR)
music[:fi] *= np.linspace(0, 1, fi)
music[end - fo:end] *= np.linspace(1, 0, fo)
music[end:] = 0

# ---- duck under the voice
def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)
voice_env = np.zeros(N)
for sc in T['scenes']:
    v = decode(f"public/vo/{sc['line']}.mp3")
    i = int((sc['start'] + T['voiceOffset']) / FPS * SR)
    win = int(0.05 * SR)
    r = np.sqrt(movavg(v.astype(float) ** 2, win))
    r = (r > 0.012).astype(float)
    j = min(N, i + len(r))
    voice_env[i:j] = np.maximum(voice_env[i:j], r[: j - i])
k = int(0.25 * SR)
smooth = movavg(voice_env, k)
gain = 1 - 0.55 * np.clip(smooth * 1.5, 0, 1)
music *= gain

# ---- sfx
sfx = np.zeros(N)
def tick(at, pitch=1.0, amp=0.11):
    d = 0.09
    t = np.arange(int(d * SR)) / SR
    e = np.exp(-t * 60)
    sig = (np.sin(2 * np.pi * 1900 * pitch * t) + 0.5 * np.sin(2 * np.pi * 2850 * pitch * t)) * e * amp
    add(sfx, sig, at)
def whoosh(at, d=0.6, amp=0.09):
    n = int(d * SR)
    noise = rng.standard_normal(n)
    env = np.sin(np.pi * np.arange(n) / n) ** 2
    out = np.zeros(n); y = 0.0
    for i in range(n):  # one-pole low-pass with a rising cutoff
        a = 0.02 + 0.5 * (i / n) ** 1.5
        y += a * (noise[i] - y)
        out[i] = y
    add(sfx, out / (np.max(np.abs(out)) + 1e-9) * env * amp, at)
pitches = [1.0, 1.12, 1.26, 1.12]
for sc in T['scenes']:
    s0 = sc['start'] / FPS
    ev = T['sfx'][sc['id']]
    for i, fr in enumerate(ev['ticks']):
        tick(s0 + fr / FPS, pitches[i % 4])
    for fr in ev['whooshes']:
        whoosh(s0 + fr / FPS)
mix = music + sfx
assert np.max(np.abs(mix)) < 0.95
pcm = (np.stack([mix, mix], axis=1) * 32767).astype('<i2')
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(OUT, total, 's, peak', np.max(np.abs(mix)))
