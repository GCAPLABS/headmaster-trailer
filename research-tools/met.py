import json, sys, urllib.request, urllib.parse, io, time
from PIL import Image, ImageDraw
UA = {'User-Agent': 'HeadmasterTrailerResearch/1.0 (https://headmaster.app)'}
def get(u, t=25): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t).read()
out = sys.argv[1]; meta = {}
for q in sys.argv[2:]:
    term, _, extra = q.partition('|')
    ids = json.loads(get('https://collectionapi.metmuseum.org/public/collection/v1.1/search?' + urllib.parse.urlencode({'hasImages': 'true', 'isPublicDomain': 'true', 'limit': 60, 'q': term, **dict(x.split('=') for x in extra.split('&') if x)})))['objectIDs'] or []
    W, H = 300, 240; sheet = Image.new('RGB', (W * 6, H * 3), 'black'); n = 0
    for oid in ids[:60]:
        try: o = json.loads(get(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}'))
        except Exception: continue
        if not o.get('isPublicDomain') or not o.get('primaryImageSmall'): continue
        try: im = Image.open(io.BytesIO(get(o['primaryImageSmall']))).convert('RGB')
        except Exception: continue
        im.thumbnail((W, H)); c = Image.new('RGB', (W, H), 'black'); c.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
        ImageDraw.Draw(c).text((4, 4), f"{n} {oid} {o.get('classification','')[:14]}", fill='yellow')
        sheet.paste(c, ((n % 6) * W, (n // 6) * H)); meta[f'{term}|{n}'] = {'id': oid, 'img': o['primaryImage'], 'title': o['title'], 'artist': o.get('artistDisplayName'), 'date': o.get('objectDate')}; n += 1
        if n == 18: break
    sheet.save(f"{out}/{term.replace(' ', '_')}.jpg", quality=80); print(term, n)
json.dump(meta, open(f'{out}/meta-{int(time.time())}.json', 'w'))
