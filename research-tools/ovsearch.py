import time
import json, sys, urllib.request, urllib.parse, io, os
from PIL import Image, ImageDraw
out = sys.argv[1]; qs = sys.argv[2:]
UA = {'User-Agent': 'HeadmasterTrailerResearch/1.0 (https://headmaster.app) python-urllib'}
def get(u, t=25):
    return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t).read()
meta = {}
for q in qs:
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm,by', 'page_size': 20, 'extension': 'jpg', 'mature': 'false', 'source': os.environ.get('SRC', 'wikimedia')})
    try: rs = json.loads(get(url))['results']
    except Exception as e: print('ERR', q, e); continue
    W, H = 320, 180; sheet = Image.new('RGB', (W * 4, H * 3), 'black'); n = 0
    rs = [r for r in rs if (r.get('width') or 0) >= 1900 and (r.get('width') or 0) >= 1.25 * (r.get('height') or 1)]
    print(q, len(rs))
    for r in rs:
        u = r['thumbnail']
        if 'upload.wikimedia.org/wikipedia/commons/' in u:
            a, b = u.split('/commons/'); fn = b.split('/')[-1]; u = f'{a}/commons/thumb/{b}/500px-{fn}'
        time.sleep(0.3)
        try: im = Image.open(io.BytesIO(get(u, 20))).convert('RGB')
        except Exception as e: print('thumb fail', e); continue
        k = max(W / im.width, H / im.height); im = im.resize((int(im.width * k) + 1, int(im.height * k) + 1))
        im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
        ImageDraw.Draw(im).text((5, 5), f"{n} {r['license']} {r['width']}x{r['height']}", fill='yellow')
        sheet.paste(im, ((n % 4) * W, (n // 4) * H)); meta[f"{q}|{n}"] = r; n += 1
        if n == 8: break
    sheet.save(f"{out}/{q.replace(' ', '_')}.jpg", quality=80)
json.dump(meta, open(f'{out}/meta-{abs(hash(tuple(qs)))}.json', 'w'))
print('ok')
