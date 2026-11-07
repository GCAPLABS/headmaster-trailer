import sys
from PIL import Image
out=sys.argv[1]; files=sys.argv[2:]
cols=2; rows=(len(files)+1)//2
W,H=960,540
im=Image.new('RGB',(W*cols,H*rows),'white')
for i,f in enumerate(files):
    im.paste(Image.open(f).convert('RGB').resize((W,H),Image.LANCZOS),((i%cols)*W,(i//cols)*H))
im.save(out)
