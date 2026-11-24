import pw from '/opt/node-tools/node_modules/playwright/index.js';
const {chromium}=pw;
const times = process.argv.slice(2).map(Number);
const b = await chromium.launch({args:['--force-color-profile=srgb','--disable-lcd-text','--font-render-hinting=none']});
const p = await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://./muki.html');
await p.waitForFunction('window.RENDER!==undefined');
for (const t of times){
  const f = Math.round(t*30);
  await p.evaluate(fr=>window.RENDER(fr), f);
  await p.screenshot({path:`shots/t${String(t).replace('.','_')}.png`});
}
console.log('errores:', errs.length? errs.slice(0,6): 'ninguno');
await b.close();
