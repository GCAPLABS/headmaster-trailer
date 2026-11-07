import re, sys, urllib.request, io
from PIL import Image, ImageDraw
from concurrent.futures import ThreadPoolExecutor
UA={'User-Agent':'Mozilla/5.0'}
def get(u): return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read()
name=sys.argv[1]; urls=[]
for page in sys.argv[2:]:
    h=get(page).decode('utf8','ignore')
    for u in re.findall(r'https://[^"\' ]+?\.(?:jpg|jpeg|png|webp)(?:\.large_2x\.jpg)?',h):
        if re.search(r'icon|logo|favicon|avatar|author|nav-bar',u,re.I): continue
        base=re.sub(r'\.(?:height|width|max)-[^.]+(\.format-webp)?\.(webp|png|jpg)$','',u)
        if base not in [b for b,_ in urls]: urls.append((base,u))
urls=urls[:30]
def thumb(bu):
    try:
        im=Image.open(io.BytesIO(get(bu[1]))).convert('RGB'); return im
    except Exception: return None
with ThreadPoolExecutor(8) as ex: ims=list(ex.map(thumb,urls))
W,H=320,180; S=Image.new('RGB',(W*6,H*5))
k=0
with open(f'press/{name}.txt','w') as f:
    for (b,u),im in zip(urls,ims):
        if im is None: continue
        f.write(f'{k} {im.size} {u}\n'); im.thumbnail((W,H)); c=Image.new('RGB',(W,H)); c.paste(im,((W-im.width)//2,(H-im.height)//2))
        ImageDraw.Draw(c).text((4,4),str(k),fill='yellow'); S.paste(c,((k%6)*W,(k//6)*H)); k+=1
        if k==30: break
S.save(f'press/{name}.jpg'); print(name,k)
