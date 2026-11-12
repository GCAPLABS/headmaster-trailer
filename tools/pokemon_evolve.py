# Builds public/pokemon-evolve.mp4 from the owner's clip (makeagif ofs1dX, FireRed: Charmeleon evolves into Charizard).
# The frame map was matched against reference/ref.mp4 11.20 to 13.27 s by image correlation (a forward-only match): the reference
# plays the source at 15 fps, about 3x through the flashing, about 5x through the white-out and reveal, then holds the final frame.
# Pixels: crop to the GBA screen, box-scale to its native 240x160, keep 240x135 (the sky band at the top is cut, as in the
# reference), then nearest-neighbour x8 to 1920x1080. The stray mouse cursor at the left edge is patched out.
# usage: python3 tools/pokemon_evolve.py <workdir>
import os, subprocess, sys, urllib.request
import numpy as np
from PIL import Image

SRC = 'https://i.makeagif.com/media/3-02-2016/ofs1dX.mp4'
MAP = [106, 108, 108, 109, 111, 112, 113, 113, 115, 117, 119, 124, 126, 128, 131, 133, 134, 137, 139, 141] + [149] * 11  # source frames (8 fps), one per 1/15 s
work = sys.argv[1]
os.makedirs(f'{work}/raw', exist_ok=True); os.makedirs(f'{work}/seq', exist_ok=True)
src = f'{work}/src.mp4'
if not os.path.exists(src):
    open(src, 'wb').write(urllib.request.urlopen(urllib.request.Request(SRC, headers={'User-Agent': 'Mozilla/5.0'})).read())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', 'crop=604:404:58:0', f'{work}/raw/%03d.png'], check=True)
cache = {}
def frame(p):
    if p not in cache:
        a = np.asarray(Image.open(f'{work}/raw/{p + 1:03d}.png').convert('RGB').resize((240, 160), Image.BOX)).copy()
        a[62:84, 0:8] = a[62:84, 8:16]
        cache[p] = Image.fromarray(a).crop((0, 25, 240, 160)).resize((1920, 1080), Image.NEAREST)
    return cache[p]
k = 0
for p in MAP:
    for _ in range(2):
        frame(p).save(f'{work}/seq/{k:03d}.png'); k += 1
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', f'{work}/seq/%03d.png', '-c:v', 'libx264', '-crf', '12', '-preset', 'slow',
                '-pix_fmt', 'yuv420p', '-tune', 'animation', 'public/pokemon-evolve.mp4'], check=True)
print('public/pokemon-evolve.mp4', k, 'frames')
