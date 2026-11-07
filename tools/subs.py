"""Split each voice line into subtitle chunks, timed by characters over the real audio duration.
Writes src/subs.json (scene-local frames) and subtitles.srt (global time)."""
import json, re, sys, os
FPS = 30
TL = sys.argv[1] if len(sys.argv) > 1 else 'src/timeline.json'
SRT = sys.argv[2] if len(sys.argv) > 2 else 'subtitles.srt'
T = json.load(open(TL))
L = json.load(open('src/lines.json'))
VO = T['voiceOffset']

def split_long(s, limit=48):
    if len(s) <= limit:
        return [s]
    commas = [m.start() + 1 for m in re.finditer(',', s)]
    if not commas:
        return [s]
    p = min(commas, key=lambda c: abs(c - len(s) / 2))
    return split_long(s[:p].strip(), limit) + split_long(s[p:].strip(), limit)

def chunks(text):
    out = []
    for sent in re.findall(r'[^.?!:]+[.?!:]?', text):
        sent = sent.strip()
        if sent:
            out += split_long(sent)
    return out

def stamp(sec):
    ms = int(round(sec * 1000))
    return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)

subs, srt, n = (json.load(open('src/subs.json')) if os.path.exists('src/subs.json') else {}), [], 1
for sc in T['scenes']:
    ln = L[sc['line']]
    parts = chunks(ln['text'])
    total = sum(len(p) for p in parts)
    dur = ln['dur'] * FPS
    t = VO
    rows = []
    for p in parts:
        w = dur * len(p) / total
        a, b = round(t), round(t + w)
        rows.append({'text': p, 'a': a, 'b': b})
        t += w
    rows[-1]['b'] += 5  # linger briefly after the last word
    subs[sc['id']] = rows
    for r in rows:
        ga, gb = (sc['start'] + r['a']) / FPS, (sc['start'] + r['b']) / FPS
        srt.append('%d\n%s --> %s\n%s\n' % (n, stamp(ga), stamp(gb), r['text']))
        n += 1
json.dump(subs, open('src/subs.json', 'w'), indent=1)
open(SRT, 'w').write('\n'.join(srt))
print(open(SRT).read()[:900])
