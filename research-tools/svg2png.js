const {chromium} = require('playwright'); const fs = require('fs');
(async () => {
  const svg = fs.readFileSync(process.argv[2], 'utf8');
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1024, height: 1024}});
  await p.setContent(`<html><body style="margin:0;background:transparent"><div style="width:1024px;height:1024px;display:flex;align-items:center;justify-content:center;filter:${process.argv[4]||'none'}"><img style="width:800px;height:800px;object-fit:contain" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></div></body></html>`);
  await p.screenshot({path: process.argv[3], omitBackground: true}); await b.close();
})();
