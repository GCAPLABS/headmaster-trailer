import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; fs=sys.argv[2:]
cols=3; S=Image.new('RGB',(1280*cols,570*((len(fs)+cols-1)//cols)),'black')
for i,f in enumerate(fs):
    im=Image.open(f); x=(i%cols)*1280; y=(i//cols)*570; S.paste(im,(x,y+30)); ImageDraw.Draw(S).text((x+10,y+8),f,fill='white')
S.resize((2400,int(S.height*2400/S.width))).save(out,quality=85)
