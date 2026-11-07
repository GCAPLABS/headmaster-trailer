import sys, json, time, urllib.request, urllib.parse
UA={'User-Agent':'HeadmasterTrailer/1.0 (glitchcap)'}
def get(u):
    return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30))
for q in sys.argv[1:]:
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','generator':'search','gsrnamespace':6,'gsrsearch':q,'gsrlimit':8,'prop':'imageinfo','iiprop':'url|extmetadata|size','iiurlwidth':1920})
    d=get(u); time.sleep(1)
    for p in (d.get('query',{}).get('pages',{}) or {}).values():
        ii=p['imageinfo'][0]; m=ii.get('extmetadata',{})
        print(q,'|',p['title'],ii['width'],ii['height'],m.get('LicenseShortName',{}).get('value'),ii.get('thumburl'))
