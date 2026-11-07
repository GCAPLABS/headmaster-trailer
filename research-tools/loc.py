import json, sys, urllib.request, urllib.parse, io, time
from PIL import Image, ImageDraw
UA = {'User-Agent': 'HeadmasterTrailerResearch/1.0 (https://headmaster.app)'}
def get(u, t=30): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t).read()
out = sys.argv[1]; meta = {}
for q in sys.argv[2:]:
    try: rs = json.loads(get('https://www.loc.gov/photos/?' + urllib.parse.urlencode({'q': q, 'fo': 'json', 'c': 40, 'fa': 'online-format:image|access-restricted:false'})))['results']
    except Exception as e: print('ERR', q, e); continue
    W, H = 300, 220; sheet = Image.new('RGB', (W * 6, H * 3), 'black'); n = 0
    for r in rs:
        imgs = r.get('image_url') or []
        if not imgs: continue
        try: im = Image.open(io.BytesIO(get(imgs[0].split('#')[0]))).convert('RGB')
        except Exception: continue
        im.thumbnail((W, H)); c = Image.new('RGB', (W, H), 'black'); c.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
        ImageDraw.Draw(c).text((4, 4), f"{n}", fill='yellow')
        sheet.paste(c, ((n % 6) * W, (n // 6) * H)); meta[f'{q}|{n}'] = {'id': r.get('id'), 'imgs': imgs, 'title': r.get('title'), 'rights': r.get('rights')}; n += 1
        if n == 18: break
    sheet.save(f"{out}/{q.replace(' ', '_')}.jpg", quality=80); print(q, n)
json.dump(meta, open(f'{out}/meta-{int(time.time())}.json', 'w'))
