const $=id=>document.getElementById(id), C=CONFIG, r=(a,b)=>a+Math.random()*(b-a);
$('music');
// ---- size to screen (works for tablets in portrait & landscape) ----
function fit(){const W=Math.max(150,Math.min(innerWidth*.455,(innerHeight-150)*.72));
 const s=document.documentElement.style;s.setProperty('--W',W+'px');s.setProperty('--H',W/.72+'px');s.setProperty('--R',W*.035+'px')}
fit();addEventListener('resize',fit);

// ---- elven garden ----
const g=$('garden');
['🌳','🌲','🌿','🌳','🌲','🍃','🌳'].forEach((t,i,a)=>{const e=document.createElement('div');e.className='tree';e.textContent=t;e.style.left=(i/(a.length-1)*92)+'%';e.style.fontSize=r(80,190)+'px';g.appendChild(e)});
for(let i=0;i<40;i++){const f=document.createElement('div');f.className='fly';f.style.cssText=`left:${r(0,100)}%;top:${r(5,95)}%;animation-delay:${r(0,5)}s;animation-duration:${r(4,8)}s`;g.appendChild(f)}
const wing='<svg viewBox="0 0 34 28"><path d="M17 14C10 0 1 2 3 11c1 6 8 6 14 3zM17 14C24 0 33 2 31 11c-1 6-8 6-14 3zM17 14C9 18 6 27 12 26c4-1 6-6 5-12zM17 14c8 4 11 13 5 12-4-1-6-6-5-12z" fill="#fff" fill-opacity=".92"/><rect x="16" y="8" width="2" height="14" rx="1" fill="#bfeee0"/></svg>';
for(let i=0;i<14;i++){const b=document.createElement('div');b.className='bf';const R=()=>Math.round(r(-160,160))+'px';
 b.style.cssText=`left:${r(2,92)}%;top:${r(5,85)}%;scale:${r(.6,1.3)};--d:${r(14,28)}s;--dl:-${r(0,20)}s;--x1:${R()};--y1:${R()};--x2:${R()};--y2:${R()};--x3:${R()};--y3:${R()}`;b.innerHTML=wing;g.appendChild(b)}

// ---- build the book ----
const paras=t=>t.trim().split(/\n\s*\n/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('');
const E=C.ending, DOOD=['🌷','⭐','🍓','🐰','☁️','🌼','💕','✨','🦋','🌸'];
const doodles=()=>{const P=[[3,2],[84,2],[3,88],[84,88]];return '<div class="doodles">'+P.map((p,i)=>`<span style="left:${p[0]}%;top:${p[1]}%;font-size:calc(var(--W)/${r(14,19).toFixed(1)});transform:rotate(${r(-20,20)}deg);animation-delay:${i*.6}s">${DOOD[Math.floor(r(0,DOOD.length))]}</span>`).join('')+'</div>'};
const face=(cls,html,center)=>`<div class="face ${cls}">${doodles()}<div class="inner">${center?`<div class="mid">${html}</div>`:html}</div></div>`;
const chapL=c=>`<span class="big">${c.emoji}</span><h2>${c.title}</h2><p class="c">〰️ 💕 〰️</p>`;
const L=[
 `<span class="big">🦋</span><h2>${C.herName}</h2><p class="c">our little book of love</p><p class="c">4 years of us 💕</p>`,
 ...C.chapters.map(chapL),
 `<img class="photo" src="${E.image}" alt="us" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><div class="ph">📷 your photo goes here<br><small>images/ending.jpg</small></div><div class="caption">${E.caption||''}</div>`
];
const R=[
 `<h2>For ${C.herName} 💌</h2><div class="c">${paras(C.openingMessage)}</div>`,
 ...C.chapters.map(c=>`<div class="txt">${paras(c.text)}</div>`),
 `<div class="sign">💞<small>${E.closing}</small><b>${E.signature}</b>🌹🦋🌹</div>`
];
const N=R.length-1; // 5 leaves between 6 spreads
let h='<div class="board"></div><div class="edge l"></div><div class="edge r"></div>';
h+=`<div class="base" style="z-index:1">${face('r',R[N],1)}</div>`;
for(let k=0;k<N;k++)h+=`<div class="leaf" data-k="${k}">${face('r',R[k],k===0||k===N)}${face('l',L[k+1],1)}</div>`;
h+=`<div class="leaf" id="cover">
 <div class="face r cov"><div class="stitch"></div><i class="corner tl">✦</i><i class="corner tr">✦</i><i class="corner bl">✦</i><i class="corner br">✦</i>
  <div class="plate"><div class="ctitle">${C.coverTitle}</div><div class="csub">${C.coverSubtitle}</div><div class="cdoodle">🌿🦋🌿</div></div>
  <div class="strap" id="strap"><div class="buckle" id="buckle" role="button" aria-label="Open the diary" tabindex="0"><i></i><b></b></div></div></div>
 ${face('l',L[0],1)}</div>`;
$('book').innerHTML=h;
// leaf 0 right face & last base are centred; the rest scroll from the top
const leaves=[...document.querySelectorAll('.leaf[data-k]')], cover=$('cover');
let cur=0,opened=false,busy=false;
const setZ=()=>{leaves.forEach((l,k)=>l.style.zIndex=l.classList.contains('flipped')?10+k:40-k);cover.style.zIndex=cover.classList.contains('flipped')?5:50};
setZ();
function turn(leaf,fwd,cb){document.body.classList.add('turning');leaf.style.zIndex=100;
 requestAnimationFrame(()=>requestAnimationFrame(()=>leaf.classList.toggle('flipped',fwd)));
 setTimeout(()=>{document.body.classList.remove('turning');setZ();cb&&cb()},1180)}
function ui(){$('num').textContent=`${cur+1} / ${N+1}`;$('prev').disabled=cur===0;$('next').disabled=cur===N}
function go(d){if(!opened||busy)return;const n=cur+d;if(n<0||n>N)return;busy=true;
 turn(leaves[d>0?cur:n],d>0,()=>busy=false);cur=n;ui();
 document.querySelectorAll('.inner').forEach(e=>e.scrollTop=0)}
$('next').onclick=()=>go(1);$('prev').onclick=()=>go(-1);ui();
addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
// swipe + tap the outer edges of the book
let sx=0,sy=0;const bk=$('book');
bk.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
bk.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
 if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)go(dx<0?1:-1)},{passive:true});
bk.addEventListener('click',e=>{if(!opened)return;const b=bk.getBoundingClientRect(),x=(e.clientX-b.left)/b.width;if(x>.92)go(1);else if(x<.08)go(-1)});

// ---- unbuckle, open, music ----
const audio=new Audio(C.music);audio.loop=true;audio.volume=.6;
function openBook(){if(opened)return;opened=true;busy=true;bk.classList.add('unbuckle');
 audio.play().then(()=>{$('music').style.display='block'}).catch(()=>{});
 setTimeout(()=>{bk.classList.add('open');document.body.classList.add('opened');turn(cover,true,()=>busy=false)},1200)}
$('buckle').onclick=openBook;$('strap').onclick=openBook;
$('buckle').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openBook()}};
$('music').onclick=()=>{if(audio.paused){audio.play();$('music').classList.remove('off')}else{audio.pause();$('music').classList.add('off')}};
