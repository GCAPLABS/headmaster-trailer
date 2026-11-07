import re, sys, subprocess, urllib.request, json, os
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw
UA={'User-Agent':'Mozilla/5.0'}
out=sys.argv[1]
def page(slug):
    h=urllib.request.urlopen(urllib.request.Request(f'https://mixkit.co/free-stock-video/{slug}/',headers=UA),timeout=30).read().decode('utf8','ignore')
    ids=[]
    for m in re.findall(r'assets\.mixkit\.co/videos/(\d+)/\1-360\.mp4',h):
        if m not in ids: ids.append(m)
    return ids[:12]
def frame(i):
    p=f'{out}/f{i}.jpg'
    if not os.path.exists(p):
        subprocess.run(['ffmpeg','-v','error','-y','-ss','2','-i',f'https://assets.mixkit.co/videos/{i}/{i}-360.mp4','-frames:v','1','-vf','scale=320:180:force_original_aspect_ratio=increase,crop=320:180',p],timeout=60)
    return p
meta={}
for slug in sys.argv[2:]:
    try: ids=page(slug)
    except Exception as e: print('ERR',slug,e); continue
    with ThreadPoolExecutor(6) as ex: fs=list(ex.map(frame,ids))
    S=Image.new('RGB',(320*4,180*3))
    for n,(i,f) in enumerate(zip(ids,fs)):
        if os.path.exists(f): S.paste(Image.open(f),((n%4)*320,(n//4)*180))
        ImageDraw.Draw(S).text(((n%4)*320+4,(n//4)*180+4),f'{n} {i}',fill='yellow')
    S.save(f'{out}/mk-{slug}.jpg'); meta[slug]=ids; print(slug,len(ids))
json.dump(meta,open(f'{out}/mk-meta-{os.getpid()}.json','w'))
