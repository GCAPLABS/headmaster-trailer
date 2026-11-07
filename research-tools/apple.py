import re, sys, urllib.request, io
from PIL import Image, ImageDraw
from concurrent.futures import ThreadPoolExecutor
UA={'User-Agent':'Mozilla/5.0'}
def get(u): return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read()
name,page=sys.argv[1],sys.argv[2]
h=get(page).decode('utf8','ignore')
us=[]
for u in re.findall(r'/v/[^"\' ]+?_large\.(?:jpg|png)',h):
    if re.search(r'icon|logo|badge|glyph',u,re.I): continue
    if u not in us: us.append(u)
def th(u):
    try: return Image.open(io.BytesIO(get('https://www.apple.com'+u))).convert('RGB')
    except Exception: return None
with ThreadPoolExecutor(8) as ex: ims=list(ex.map(th,us[:48]))
W,H=300,200; S=Image.new('RGB',(W*8,H*6),(40,40,40)); k=0
with open(f'press/{name}.txt','w') as f:
    for u,im in zip(us,ims):
        if im is None or im.width<500: continue
        f.write(f'{k} {im.size} {u}\n'); im.thumbnail((W,H)); S.paste(im,((k%8)*W+(W-im.width)//2,(k//8)*H+(H-im.height)//2)); ImageDraw.Draw(S).text(((k%8)*W+4,(k//8)*H+4),str(k),fill='red'); k+=1
        if k==48: break
S.save(f'press/{name}.jpg'); print(name,k)
