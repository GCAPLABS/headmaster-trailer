# Voice over music per act, measured the same way on any film: Whisper finds the words,
# "speech" is the word windows, "music" is the gaps longer than 0.8 s between words (trimmed 0.15 s each side).
# usage: python3 research-tools/audit_acts.py <audio or video> <act edges in seconds, e.g. 0 18.2 57.6 88.5 104>
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
R = 16000
f, edges = sys.argv[1], [float(x) for x in sys.argv[2:]]
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(R), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).copy()
m = WhisperModel('small.en', device='cpu', compute_type='int8')
segs, _ = m.transcribe(a, word_timestamps=True, language='en')
w = [(x.start, x.end) for s in segs for x in s.words]
def rms(x): return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9) if len(x) else float('nan')
for lo, hi in zip(edges[:-1], edges[1:]):
    ws = [(s, e) for s, e in w if lo <= s < hi]
    gaps = [(ws[i][1] + 0.15, ws[i + 1][0] - 0.15) for i in range(len(ws) - 1) if ws[i + 1][0] - ws[i][1] > 0.8]
    sp = np.concatenate([a[int(s * R):int(e * R)] for s, e in ws]) if ws else np.zeros(0)
    gp = np.concatenate([a[int(s * R):int(e * R)] for s, e in gaps]) if gaps else np.zeros(0)
    print(f'{lo:6.1f}-{hi:6.1f}s  words {len(ws):3d}  voice {rms(sp):6.1f}  music between lines {rms(gp):6.1f}  voice over music {rms(sp) - rms(gp):5.1f} dB')
