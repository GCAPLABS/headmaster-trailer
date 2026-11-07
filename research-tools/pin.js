const {chromium} = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1400, height: 1000}, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'});
  const urls = new Set();
  for (const q of process.argv.slice(2)) {
    await p.goto('https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(q), {waitUntil: 'domcontentloaded', timeout: 60000});
    await p.waitForTimeout(4000);
    for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 2500); await p.waitForTimeout(1500); }
    const src = await p.$$eval('img', (is) => is.map((i) => i.src).filter((s) => s.includes('pinimg.com')));
    src.forEach((s) => urls.add(s.replace(/\/(236x|474x|60x60|75x75_RS)\//, '/736x/')));
    console.error(q, src.length);
  }
  await p.screenshot({path: 'pins/page.png'});
  console.log([...urls].join('\n')); await b.close();
})();
