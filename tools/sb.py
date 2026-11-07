import json,sys
# (id, act, start, dur, purpose, beat, vo, onscreen, picture/layout, motion, camera, transitionOut)
SC=[
("ask","hook",0,7.5,"Show the product in frame 1 and say the whole promise: you ask in plain words.","calm, curious",
 "Say you need a hotel. You just ask.","Just ask.",
 "Left column: title. Right: a person on a sofa holds a phone; the phone shows the green chat with Headmaster. The request types in and sends; the reply says it is on it.",
 "Title lines rise 40px out of a mask with blur 10 to 0 over 0.6s, 0.12s stagger. Text types at 28 chars/s, send tap ripples, bubble springs up 24px. Phone floats 5px on a 3.2s sine, hands follow.",
 "Static wide to 4.3s, then a 2.7s ease-in-out push to 2.1x on the thread; the title slides left 1.6x faster (parallax).",
 "The push lands on the phone screen, which becomes the laptop chat window of scene 2 (match cut on the same thread and bubble)."),
("works","showcase",7.5,8,"Prove it does real work on its own computer.","impressed",
 "It has its own private computer. It searches, compares, and finds the booking page.","It works on its own computer.",
 "Real chat window, wide. A task panel on the right lists steps: Searching 14 hotels, Comparing prices, Opening the booking page. Mini browser view shows result cards.",
 "Steps tick in sequence at 1.4s intervals; result cards fan out from a stack (fan/spread) with 90ms stagger; spinner becomes a check with a 0.3s spring.",
 "Guided zoom 1.6x onto the task panel at 10s, cursor hotspot on the active step, callout 'Step 2 of 3'.",
 "Pan right along the thread to the approval card."),
("asks","climax",15.5,9,"Hero moment: it asks before it spends.","reassured",
 "Before it spends a single euro, it asks you. Approve once, always allow, or say no.","It asks before it spends.",
 "Approval card 'Pay 328 euros?' with Approve once, Always allow, Deny; the screen is dimmed 28% outside the card.",
 "Cursor curves in, beacon pulses, click ripple, card flips to Booked with a spring check, border flashes blue for 4 frames.",
 "Supademo zoom 1.35x to the card, ease-heavy 1.1s; holds; zooms out after the click.",
 "Confirmation row slides into Files in the sidebar; camera follows to the Memory page."),
("remembers","showcase",24.5,5.5,"Memory: less to explain each time.","warm",
 "It remembers how you like things. So next time, just say: book the usual.","It remembers you.",
 "Memory page list: Small hotels, Window seat, Under 180 euros. Composer types 'Book the usual.'",
 "List rows enter from the left as a staggered cascade (100ms); matching words in the composer highlight blue as each row is read.",
 "Slow 6 percent drift right to left; no zoom.","Slide-wipe to a row of devices."),
("anywhere","showcase",30,6.5,"Same agent in chat apps, laptop, browser and phone.","at ease",
 "Use it in the chat apps you already use, or on your laptop, browser and phone.","Wherever you are.",
 "Four surfaces on a shared stage in a row: green chat first (phone), laptop app, browser tab, phone app. One thread shown on each.",
 "Parallax layers pan: devices slide at 0.6x/1x/1.4x speeds; each surface lights (white fill vs lavender) as it is named.",
 "Horizontal dolly right 1500px over 5s, ease-in-out.","Camera dips into dark for night (hard cut justified by time passing: clock 23:40)."),
("overnight","showcase",36.5,6.5,"Works while you sleep.","calm, relief",
 "Give it jobs before bed. It works through them overnight, and tells you in the morning.","It works while you sleep.",
 "Dark board (To do, Doing, Done) at night with a clock 23:40, then the bedside phone at 07:30 with a green chat message '3 jobs done overnight'.",
 "Cards carry across columns one at a time (350ms ease-in-out); clock numerals roll; sunrise = background field switches lavender via a 0.5s wipe.",
 "Locked-off board, then a vertical tilt down to the phone on a bedside table.","Wipe up."),
("profiles","showcase",43,6,"Profiles with their own jobs.","capable",
 "Profiles each have a job. Ada does errands, Milo watches money, Juno writes.","A profile for each job.",
 "Three real profile screens side by side: Ada (Errands, itinerary), Milo (Money, a bar list), Juno (Writing, a document). Names large above each.",
 "Orbit-free: screens rise at different depths (Z hierarchy), the named one scales 1.06 and others dim to 70 percent in turn.",
 "Slow push-in 1.1x on the active screen.","Cross-slide to the log."),
("control","showcase",49,4,"Control and transparency.","trust",
 "You set the limit, and see every step.","See every step.",
 "Left: spend limit meter 38 of 50 euros. Right: step log with times and ticks.",
 "Meter fills 0.9s ease-out; log rows type in with 120ms stagger.",
 "Guided zoom to the log, 1.3x.","Rows scroll off to a parcel icon list."),
("skills","showcase",53,2.5,"Weekly new skills without breakage.","reassured",
 "New skills weekly. Nothing breaks.","New skills every week.",
 "Skills list with 'New this week' rows; Memory and profiles rows beside them keep a green tick.",
 "Rows drop in 80ms stagger; ticks pop on old rows.","Static, 1.05x drift.","Rows collapse toward the centre mark."),
("close","close",55.5,4.5,"Brand, tagline, address.","settled",
 "Headmaster. Your AI staff, always on.","Headmaster. Your AI staff, always on.",
 "Blue agent character small above the wordmark on lavender; URL below. Hold 2s.",
 "Agent hops once (spring 0.5s), wordmark rises from a mask, URL fades in last.",
 "Pull back 1.0 to 0.94 over 4s.","End."),
]
D={"title":"Headmaster product demo, 60 s","dur":60,"fps":30,"width":1920,"height":1080}
words=lambda s:len(s.split())
scenes=[];t=0;rows=[]
for i,(id,act,st,du,pu,be,vo,tx,lay,an,cam,tr) in enumerate(SC):
    assert abs(st-t)<1e-6,(id,st,t); t+=du
    w=words(vo); need=w/2.3
    rows.append((id,st,du,w,round(need,1)))
    scenes.append(dict(id=id,act=act,startSec=st,durationSec=du,purpose=pu,emotionalBeat=be,voiceover=vo,onScreenText=tx,layout=lay,elements=lay,animation=an,camera=cam,lighting="Flat, even studio light. Depth only from opaque surfaces on lavender and hairline borders.",transitionOut=tr))
assert abs(t-60)<1e-6,t
out=dict(meta=dict(title=D["title"],durationSec=60,fps=30,width=1920,height=1080,narrativeStructure="problem-solution (small problem: a task you would rather hand off)",
 direction="Product stage: real app screens as the hero on a calm Studio set, Supademo-style guided zooms and cursor, kinetic Archivo line per scene, simple flat human moment in scene 1.",
 fonts=dict(display=dict(family="Archivo",weights=["700","800"]),body=dict(family="Figtree",weights=["400","500","600","700"])),
 colors=dict(background="#e0e0fb",surface="#ffffff",primary="#0c0e1a",muted="#6a7086",accent="#0000da",highlight="#dcf8c6 (chat green only)",field="#f7f8fb",hairline="#e3e5ec",dark="#16181f")),
 voice=dict(enabled=True,gender="neutral",age="middle-aged",tone=["calm","warm","clear"],accent="neutral",pace="moderate",note="No TTS here; owner adds ElevenLabs takes later. Subtitles burned in."),
 scenes=scenes)
json.dump(out,open("storyboard.json","w"),indent=1,ensure_ascii=False)
md=["# Storyboard: Headmaster demo, 60 s, 1920x1080, 30 fps","","Direction: Product stage. Real screens as hero on lavender #e0e0fb, white and #f7f8fb surfaces, ink #0c0e1a, accent #0000da, hairline #e3e5ec, dark #16181f. Archivo display, Figtree UI. Every scene has one kinetic line, subtitles, and works with sound off.","",
"| Time | Frames | Scene | Picture | On-screen text | VO line (words, ~s) | Sound |","|---|---|---|---|---|---|---|"]
for s,r in zip(scenes,rows):
    a=s["startSec"];b=a+s["durationSec"]
    md.append(f"| {a:g}-{b:g} s | {int(a*30)}-{int(b*30)} | {s['id']} | {s['layout']} | {s['onScreenText']} | {s['voiceover']} ({r[3]} w, fits {r[4]} s of {s['durationSec']:g}) | Music bed; soft tick per step; whoosh on camera moves |")
md+=["","## Motion and camera per scene",""]
for s in scenes: md+=[f"**{s['id']}** ({s['act']}). Animation: {s['animation']} Camera: {s['camera']} Out: {s['transitionOut']}",""]
open("storyboard.md","w").write("\n".join(md))
for r in rows: print(r)
