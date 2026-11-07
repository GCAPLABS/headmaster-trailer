import sys, subprocess, numpy as np, json
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
for f in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
    a = np.frombuffer(raw, np.float32)
    segs,_ = m.transcribe(a, word_timestamps=True)
    words=[]
    for s in segs:
        for w in s.words: words.append((round(w.start,2), round(w.end,2), w.word.strip()))
    json.dump(words, open(f+'.words.json','w'))
    print(f, len(a)/16000)
    print(' '.join(f"{w[0]}:{w[2]}" for w in words))
