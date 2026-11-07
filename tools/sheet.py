import json, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
T = json.load(open('src/timeline.json'))
KEY = {'ask': 90, 'works': 140, 'asks': 185, 'remembers': 175, 'anywhere': 100, 'overnight': 90, 'profiles': 150, 'control': 90, 'skills': 100, 'close': 140}
if len(sys.argv) > 1 and sys.argv[1] == 'render':
    for s in T['scenes']:
        subprocess.run(['npx', 'remotion', 'still', 'src/index.ts', 'Film', f"review/key_{s['id']}.png", f"--frame={s['start'] + KEY[s['id']]}"], check=True, capture_output=True)
        print(s['id'])
W, H = 960, 540
cols = 2
rows = 5
im = Image.new('RGB', (W * cols, H * rows + 0), 'white')
for i, s in enumerate(T['scenes']):
    t = Image.open(f"review/key_{s['id']}.png").convert('RGB').resize((W, H), Image.LANCZOS)
    im.paste(t, ((i % cols) * W, (i // cols) * H))
im.save('review/contact-sheet-v3.png')
