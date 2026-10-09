import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.cwd(),'package.json'));
const {build}=require('esbuild');const {Window}=require('happy-dom');
const season=process.cwd().endsWith('autumn')?'autumn':'winter';
const window=new Window({url:'http://localhost/'});
for(const key of ['window','document','HTMLElement','HTMLDialogElement','Node','Event','MouseEvent','KeyboardEvent','PointerEvent'])Object.defineProperty(globalThis,key,{value:key==='window'?window:window[key],configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
const React=require('react'),{createRoot}=require('react-dom/client');
const result=await build({stdin:{contents:`export {Album} from './src/Album'; export {${season}Album as album} from './src/album-data';`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react-dom'],preserveSymlinks:true});
const bundle=path.join(process.cwd(),`.${season}-qa-test.cjs`);fs.writeFileSync(bundle,result.outputFiles[0].text);
const {Album,album}=require(bundle);let root,container;
const nativeSet=globalThis.setTimeout,nativeClear=globalThis.clearTimeout;
let now=0,id=0,pending=new Map();
globalThis.setTimeout=(fn,delay=0)=>{const key=++id;pending.set(key,{at:now+delay,fn});return key};
globalThis.clearTimeout=key=>pending.delete(key);
const counts=[];
function count(){const value=document.querySelectorAll('.keepsake-receipt').length;counts.push(value);assert.ok(value<=1,'Duplicate receipt: '+value)}
async function advance(ms){const until=now+ms;while(true){const next=[...pending].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;pending.delete(next[0]);await React.act(()=>next[1].fn());count()}now=until}
async function click(selector){const el=document.querySelector(selector);assert.ok(el,'Missing '+selector);await React.act(()=>el.click());count()}
async function mount(){container=document.createElement('div');document.body.append(container);root=createRoot(container);await React.act(()=>root.render(React.createElement(React.StrictMode,null,React.createElement(Album,{album}))));}
async function unmount(){await React.act(()=>root.unmount());container.remove();assert.equal(pending.size,0,'Unmount must cancel component timers')}
function active(n){assert.equal(document.querySelector('.chapter-index')?.textContent,String(n+2).padStart(2,'0'));assert.equal(document.querySelectorAll('.right-page>.composition').length,1);assert.equal(document.querySelectorAll('.turning-leaf').length,0);assert.ok(document.querySelector('.right-page img'))}
async function next(){await click('[aria-label="Next chapter"]');await advance(930)}
// Deliver input after a timer's state updates, before React commits the new handlers.
async function settleWithInput(ms,selector){
 const until=now+ms;
 while(true){const nextTimer=[...pending].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!nextTimer)break;
  now=nextTimer[1].at;pending.delete(nextTimer[0]);
  await React.act(()=>{nextTimer[1].fn();if(selector)document.querySelector(selector)?.click();else window.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))});count();
 }
 now=until;
}
// Verify cover depth using the actual CSS declarations, independently of a browser renderer.
function checkCoverGeometry(){
 const css=require('postcss').parse(fs.readFileSync('src/styles.css','utf8'));
 const declarations=selector=>{const values={};css.walkRules(rule=>{if(rule.parent.type==='root'&&rule.selector===selector)rule.walkDecls(d=>values[d.prop]=d.value)});return values};
 const cover=declarations('.hardcover');
 const face=declarations('.cover-face');
 const hover=declarations(Object.keys(face).length?'.hardcover:hover .cover-face':'.hardcover:hover');
 const rotation=Number(hover.transform.match(/rotateY\(([-.\d]+)deg\)/)?.[1]??0);
 const depth=Number(hover.transform.match(/translateZ\(([-.\d]+)px\)/)?.[1]??0);
 const width=Number(cover.width.replace('px',''));
 const origin=(face['transform-origin']??cover['transform-origin']??'center').startsWith('left')?0:width/2;
 const z=[0,width].map(x=>depth-Math.sin(rotation*Math.PI/180)*(x-origin));
 console.log(season+': closed-cover hover depth range '+JSON.stringify(z));
 assert.ok(Math.min(...z)>=1,'Hover face intersects the page-stack plane instead of staying in front');
 assert.ok(document.querySelector('.hardcover>.cover-face'),'Hover surface must be separate from the stable activation button');
 assert.ok(!/rotateY/.test(declarations('.hardcover:hover').transform??''),'The activation hit area must not rotate on hover');
}
const observations=[];
try{
 assert.equal(album.chapters.length+1,10);assert.equal(album.photographs.length,10);
 const hashes=new Set();for(const photo of album.photographs){const bytes=fs.readFileSync(path.join(process.cwd(),'public',photo.src));assert.equal(bytes.readUInt16BE(0),0xffd8);hashes.add(require('node:crypto').createHash('sha256').update(bytes).digest('hex'))}assert.equal(hashes.size,10);
 // The previous tests awaited every commit; these checks also cover the completion boundary.
 for(let run=0;run<5;run++){
  await mount();if(run===0)checkCoverGeometry();await click('.hardcover');await click('.hardcover');
  await settleWithInput(900);active(0);await advance(30);
  await click('[aria-label="Next chapter"]');await settleWithInput(900);active(1);await advance(30);
  await next();active(2);
  await click('[aria-label="Previous chapter"]');await advance(930);active(1);
  await click('[aria-label="Previous chapter"]');await advance(930);active(0);
  await click('[aria-label="Return to cover"]');await advance(930);assert.ok(document.querySelector('.hardcover'));assert.equal(document.querySelector('.spread'),null);
  await click('.hardcover');await advance(930);active(0);await unmount();
 }
 // Unmount mid-opening and mid-page-turn. Obsolete timers must not survive into a fresh mount.
 await mount();await click('.hardcover');await advance(450);await unmount();await advance(1000);
 await mount();await click('.hardcover');await advance(930);active(0);await click('[aria-label="Next chapter"]');await advance(450);await unmount();await advance(1000);
 for(let run=0;run<5;run++){
  await mount();assert.ok(document.querySelector('.hardcover'));
  await click('.hardcover');await click('.open-action');await advance(930);active(0);
  for(let cycle=0;cycle<5;cycle++){
   await click('[aria-label="Next chapter"]');await click('[aria-label="Next chapter"]');await advance(930);active(1);
   await click('[aria-label="Previous chapter"]');
   const clone=document.querySelector('.turning-front img')?.getAttribute('src'),target=document.querySelector('.right-page img')?.getAttribute('src');
   if(run===0&&cycle===0)observations.push({issue:'backward-turn-image',clone,target});
   if(process.argv.includes('--repaired'))assert.equal(clone,target,'Backward turn must uncover the destination page, not the outgoing page');
   await advance(930);active(0);
  }
  for(let i=0;i<3;i++){await click('.polaroid');assert.equal(document.querySelectorAll('.lifted-memory').length,1);await click('.dialog-close');assert.equal(document.querySelector('dialog').open,false)}
  await next();active(1);await next();active(2);await next();active(3);
  for(let i=0;i<3;i++){await click('.envelope');assert.equal(document.querySelectorAll('.letter-paper').length,1);assert.equal(document.querySelector('.letter-body').textContent,album.letter.body);await click('.letter-paper .text-action');assert.equal(document.querySelector('dialog').open,false)}
  for(let i=4;i<9;i++){await next();active(i)}
  assert.equal(document.querySelector('.receipt-photo img').getAttribute('src'),album.photographs.find(p=>p.id===album.specialPhoto).src);
  for(let i=0;i<3;i++){
   await click('.final-action');await click('.final-action');await settleWithInput(820,'.page-corner');await advance(30);assert.equal(document.querySelectorAll('.keepsake-receipt').length,1);assert.ok(document.querySelector('.receipt-total').textContent.includes('∞'));assert.ok(document.querySelector('.paid').textContent.includes('BOTH OF US'));
   if(i<2){await click('[aria-label="Previous chapter"]');await settleWithInput(900,'.page-corner');active(7);await advance(30);await next();active(8);assert.equal(document.querySelectorAll('.keepsake-receipt').length,0)}
  }
  await click('.receipt-close');await click('.receipt-close');await advance(4350);assert.ok(document.querySelector('.has-ended .hardcover'));assert.ok(document.querySelector('.closing-message.visible'));assert.ok(document.querySelector('.closing-message').textContent.includes('CHERMO'));
  await click('.replay');await advance(930);active(0);
  await React.act(()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));await advance(930);active(1);
  await React.act(()=>{const page=document.querySelector('.right-page');page.dispatchEvent(new window.PointerEvent('pointerdown',{bubbles:true,clientX:300,clientY:200}));page.dispatchEvent(new window.PointerEvent('pointerup',{bubbles:true,clientX:130,clientY:202}))});await advance(930);active(2);
  await unmount();assert.equal(pending.size,0);
 }
 console.log(JSON.stringify({season,status:'PASS',runs:5,completionBoundaryRuns:5,unmountDuringTransitions:2,firstSecondCycles:25,receiptVisits:15,maxMountedReceipts:Math.max(...counts),observations,scope:'StrictMode Happy DOM; normal-motion timers controlled; CSS layout/paint NOT VERIFIED'},null,2));
}finally{if(root&&container?.isConnected)await unmount();globalThis.setTimeout=nativeSet;globalThis.clearTimeout=nativeClear;window.happyDOM.abort();fs.unlinkSync(bundle)}
