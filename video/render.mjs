import pw from '/opt/node-tools/node_modules/playwright/index.js';
import {spawn} from 'child_process';
const {chromium}=pw;
const OUT = process.argv[2] || 'mukicloud.mp4';
const b = await chromium.launch({args:['--force-color-profile=srgb','--font-render-hinting=none','--disable-lcd-text']});
const p = await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://./muki.html');
await p.waitForFunction('window.RENDER!==undefined');
const TOTAL = await p.evaluate('window.TOTAL'), FPS = await p.evaluate('window.FPS');
console.log('cuadros:',TOTAL,'fps:',FPS);
const ff = spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(FPS),'-i','-',
  '-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',OUT],
  {stdio:['pipe','ignore','pipe']});
let ffErr=''; ff.stderr.on('data',d=>{ffErr+=d.toString(); if(ffErr.length>4000)ffErr=ffErr.slice(-2000)});
const done = new Promise((res,rej)=>{ff.on('close',c=>c===0?res():rej(new Error('ffmpeg '+c+'\n'+ffErr.slice(-1200))))});
const t0=Date.now();
for(let i=0;i<TOTAL;i++){
  await p.evaluate(fr=>window.RENDER(fr), i);
  const buf = await p.screenshot({type:'png'});
  if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
  if(i%300===0) console.log('  '+i+'/'+TOTAL+'  '+((Date.now()-t0)/1000).toFixed(0)+'s');
}
ff.stdin.end(); await b.close(); await done;
console.log('errores de página:', errs.length?errs.slice(0,4):'ninguno');
console.log('listo en',((Date.now()-t0)/1000).toFixed(0)+'s');
