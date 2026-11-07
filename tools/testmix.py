import json,subprocess
T=json.load(open('src/timeline.json'))
cmd=['ffmpeg','-v','error','-y']
fl=[]
for i,sc in enumerate(T['scenes']):
    cmd+=['-i',f"public/vo/{sc['line']}.mp3"]
    ms=int((sc['start']+T['voiceOffset'])/30*1000)
    fl.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
cmd+=['-i','public/bed.wav']
fl.append(''.join(f'[v{i}]' for i in range(10))+"amix=inputs=10:normalize=0,apad=whole_dur=66[voice]")
fl.append("[voice]asplit[va][vb];[va][10:a]amix=inputs=2:normalize=0:duration=first[m]")
cmd+=['-filter_complex',';'.join(fl),'-map','[m]','-t','65.2','out/testmix.wav','-map','[vb]','-t','65.2','out/voiceonly.wav']
subprocess.run(cmd,check=True)
