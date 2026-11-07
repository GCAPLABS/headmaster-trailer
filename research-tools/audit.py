import sys, json, numpy as np, wave
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
for f in sys.argv[1:]:
    wv = wave.open(f); sr = wv.getframerate(); a = np.frombuffer(wv.readframes(wv.getnframes()), np.int16).astype(np.float32) / 32768
    segs, _ = m.transcribe(a, word_timestamps=True)
    w = [(x.start, x.end, x.word.strip()) for s in segs for x in s.words]
    json.dump(w, open(f + '.w.json', 'w'))
    dur = len(a) / sr
    speech = np.zeros(int(dur * 10) + 1, bool)
    for s, e, _ in w: speech[int(s * 10):int(e * 10) + 1] = True
    print(f'== {f}: {dur:.1f}s, speech {speech.mean()*100:.0f}% of runtime, {len(w)} words, {len(w)/dur*60:.0f} wpm overall')
    gaps = [(w[i][1], w[i+1][0]) for i in range(len(w)-1) if w[i+1][0] - w[i][1] > 1.2]
    print('gaps >1.2s:', ' '.join(f'{a:.1f}-{b:.1f}({b-a:.1f})' for a, b in gaps))
    # level of speech windows vs gaps (music only)
    def rms(x): return 20*np.log10(np.sqrt((x**2).mean())+1e-9)
    sp = np.concatenate([a[int(s*sr):int(e*sr)] for s, e, _ in w])
    gp = np.concatenate([a[int((s+0.2)*sr):int((e-0.2)*sr)] for s, e in gaps if e-s > 0.6]) if gaps else np.zeros(1)
    print(f'speech windows {rms(sp):.1f} dB, music-only gaps {rms(gp):.1f} dB, diff {rms(sp)-rms(gp):.1f} dB')
