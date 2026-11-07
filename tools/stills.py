import json,subprocess,sys
T=json.load(open('src/timeline.json'))
S={s['id']:s for s in T['scenes']}
# usage: stills.py scene f1 f2 ...  -> out/<scene>_<f>.png
sc=sys.argv[1]
for f in sys.argv[2:]:
    g=S[sc]['start']+int(f)
    subprocess.run(['npx','remotion','still','src/index.ts','Film',f'out/{sc}_{f}.png',f'--frame={g}'],check=True,capture_output=True)
    print(f'out/{sc}_{f}.png')
