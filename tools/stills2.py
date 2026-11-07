import json,subprocess,sys
from concurrent.futures import ThreadPoolExecutor
T=json.load(open('src/timeline-long.json'));S={s['id']:s for s in T['scenes']}
jobs=[(a.split(':')[0],int(a.split(':')[1])) for a in sys.argv[1:]]
def r(j):
    sc,f=j
    subprocess.run(['npx','remotion','still','src/index.ts','FilmLong',f'review/L_{sc}_{f}.png',f'--frame={S[sc]["start"]+f}'],check=True,capture_output=True)
    return j
with ThreadPoolExecutor(4) as ex:
    for j in ex.map(r,jobs):print(j)
