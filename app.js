/* Bhavya Kothari portfolio scripts. Blocks run in order. */

/* --- script 1 --- */
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.pp').forEach((p,i)=>p.classList.toggle('on',i===+b.dataset.p));const bd=document.querySelector('.binder');bd.style.setProperty('--f',b.dataset.f);bd.style.setProperty('--t',b.dataset.t)}));

document.getElementById('zhero').src=document.querySelector('[data-case="zynga"] .hero-shot').src;
const lb=document.getElementById('lb');
document.querySelectorAll('.fig img').forEach(i=>i.addEventListener('click',()=>{lb.firstChild.src=i.src;lb.classList.add('on')}));
lb.addEventListener('click',e=>{if(e.target.tagName==='IMG'&&!lb.classList.contains('full')){lb.classList.add('full');return}lb.classList.remove('on','full')});
const toc=document.getElementById('toc');let rows=[];
function tocActive(){if(toc.hidden)return;let k=0;rows.forEach((r,i)=>{if(r.getBoundingClientRect().top<180)k=i});toc.querySelectorAll('a').forEach((a,i)=>a.classList.toggle('on',i===k))}
function buildToc(v){toc.hidden=!(v==='zynga'||v==='water'||v==='duo'||v==='cy'||v==='gi'||v==='pv'||v==='ov'||v==='case');if(toc.hidden)return;toc.style.setProperty('--tocc',v==='water'?'#3F8F9E':v==='duo'?'#3A8F00':v==='cy'?'#C93C23':v==='gi'?'#1A5FD0':v==='pv'?'#5E7D4E':v==='ov'?'#7C4DE0':v==='zynga'?'#6B3FB5':'#B4533A');
 rows=[...document.querySelectorAll('#v-'+v+' .row:not(.tsub)')];
 toc.innerHTML='<b>On this page</b>'+rows.map((r,i)=>`<a href="#" data-i="${i}">${r.dataset.toc||r.querySelector('h3').textContent}</a>`).join('');
 toc.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();rows[+a.dataset.i].scrollIntoView({behavior:'smooth',block:'start'})}));tocActive()}
addEventListener('scroll',tocActive,{passive:true});
document.fonts.load('64px Ink','Bhavya').then(r=>{if(r.length&&r[0].status==='loaded')document.documentElement.classList.add('realink')}).catch(()=>{});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 const hook=(el,sel)=>{if(!el)return;el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.querySelectorAll(sel).forEach(n=>{const d=+n.dataset.d;n.style.translate=`${px*d}px ${py*d}px`})});el.addEventListener('mouseleave',()=>el.querySelectorAll(sel).forEach(n=>n.style.translate='0 0'))};
 hook(document.getElementById('cluster'),'.stk');hook(document.querySelector('.more'),'.skill')}
const views=['work','play','about','case','zynga','water','duo','cy','gi','pv','ov'];
function show(v){views.forEach(x=>document.getElementById('v-'+x).hidden=x!==v);
 document.querySelectorAll('nav .pill').forEach(p=>p.classList.toggle('on',p.dataset.view===(v==='case'?'work':v)));scrollTo(0,0);buildToc(v)}
document.querySelectorAll('[data-view]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.view)}));
document.querySelectorAll('.back').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show('work')}));
document.querySelectorAll('[data-open]').forEach(c=>c.addEventListener('click',e=>{e.preventDefault();
 cur.classList.remove('show');if(c.dataset.case)return show(c.dataset.case);document.getElementById('c-title').textContent=c.dataset.name;show('case')}));
document.querySelectorAll('a.pill[href="#"]:not([data-view])').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

const cur=document.getElementById('cur');let tx=0,ty=0,cx=0,cy=0;
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
 (function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(loop)})();
 document.querySelectorAll('[data-open]').forEach(c=>{
  c.addEventListener('mouseenter',()=>{cur.textContent=c.dataset.label||'view project';cur.classList.add('show');cur.style.transform='translate(-50%,-50%) scale(1)'});
  c.addEventListener('mouseleave',()=>{cur.classList.remove('show');cur.style.transform='translate(-50%,-50%) scale(.6)'});
  c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
   c.querySelectorAll('.sk2').forEach(ch=>{const d=+ch.dataset.d;ch.style.translate=`${px*d*2}px ${py*d*2}px`})});
  c.addEventListener('mouseleave',()=>c.querySelectorAll('.sk2').forEach(ch=>ch.style.translate='0 0'));
 });
}

/* --- script 2 --- */
(function(){var sw=document.querySelector('.hh h1 .sw');if(!sw)return;
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var b=sw.querySelector('b'),e=b.querySelector('em'),W=['platforms','users','industries','goals'],i=0,tm;
function wd(txt){var m=document.createElement('span');m.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:inherit';m.textContent=txt;sw.appendChild(m);var w=m.getBoundingClientRect().width;sw.removeChild(m);return Math.ceil(w)+2;}
function setw(txt){sw.style.width=wd(txt)+'px';}
function go(){i=(i+1)%W.length;e.className='out';setTimeout(function(){e.textContent=W[i];setw(W[i]);e.className='in';},190);}
function loop(){clearInterval(tm);if(!rm)tm=setInterval(go,2200);}
setw(W[0]);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){setw(W[i]);});
sw.addEventListener('click',function(){go();loop();});
loop();
addEventListener('resize',function(){setw(W[i]);});})();

/* --- script 3 --- */
try{localStorage.removeItem('dm')}catch(e){}

/* --- script 4 --- */
(function(){var star=document.getElementById('goldstar'),ft=document.querySelector('footer');if(!star||!ft||!('IntersectionObserver' in window))return;
var CASES=['case','zynga','water','duo','cy','gi','pv','ov'],seen={};
function cur(){for(var i=0;i<CASES.length;i++){var el=document.getElementById('v-'+CASES[i]);if(el&&!el.hidden&&el.offsetParent!==null)return CASES[i];}return null;}
new IntersectionObserver(function(en){en.forEach(function(x){if(!x.isIntersecting)return;var v=cur();if(!v||seen[v]||window.scrollY<400)return;seen[v]=1;star.classList.remove('go');void star.offsetWidth;star.classList.add('go');});},{threshold:.6}).observe(ft);})();

/* --- script 5 --- */
(function(){var w=document.querySelector('.hcollage .cwrap');if(!w)return;var an=[].slice.call(w.querySelectorAll('.an')),busy=true,t0=setTimeout(function(){busy=false},4800);
function replay(){if(busy)return;busy=true;an.forEach(function(e,i){e.style.animation='none';e.style.setProperty('--d',(i*0.32)+'s')});void w.offsetWidth;an.forEach(function(e){e.style.animation=''});setTimeout(function(){busy=false},an.length*320+1300)}
w.addEventListener('mouseenter',replay);})();

/* --- script 6 --- */
(function(){var e=document.querySelector('#v-about .how');if(!e||!('IntersectionObserver' in window)){if(e)e.classList.add('in');return}
var io=new IntersectionObserver(function(a){a.forEach(function(x){if(x.isIntersecting){e.classList.add('in')}else{e.classList.remove('in')}})},{threshold:.6});io.observe(e)})();

/* --- script 7 --- */
(function(){var f=document.getElementById('annfig');if(!f)return;function play(){f.classList.remove('on');void f.offsetWidth;f.classList.add('on')}if('IntersectionObserver' in window){new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){play()}else{f.classList.remove('on')}})},{threshold:.55}).observe(f)}else{f.classList.add('on')}f.addEventListener('mouseenter',play)})();

/* --- script 8 --- */
(function(){var wp=document.querySelector('nav .pill[data-view="work"]'),hs=document.querySelector('.hsec'),nav=document.querySelector('nav');if(!wp||!hs)return;
var hp=document.querySelector('nav .pill[data-home]');function upd(){var vw=document.getElementById('v-work');if(vw.hidden){if(hp)hp.classList.remove('on');return}var on=hs.getBoundingClientRect().top<=innerHeight*.5;wp.classList.toggle('on',on);if(hp)hp.classList.toggle('on',!on)}
var o=show;show=function(v){o(v);upd()};
function go(){var t=hs.getBoundingClientRect().top+pageYOffset-72;scrollTo({top:t,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
nav.addEventListener('click',function(e){var a=e.target.closest('.pill[data-view="work"]');if(!a)return;e.preventDefault();e.stopPropagation();
 if(document.getElementById('v-work').hidden){show('work');upd();requestAnimationFrame(function(){go()})}else go()},true);
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()})();

/* --- script 9 --- */
(function(){var star=document.getElementById('goldstar'),toc=document.getElementById('toc');if(!star||!toc)return;
var CASES=['case','zynga','water','duo','cy','gi','pv','ov'],done={};
function cur(){for(var i=0;i<CASES.length;i++){var el=document.getElementById('v-'+CASES[i]);if(el&&!el.hidden&&el.offsetParent!==null)return CASES[i]}return null}
function add(){if(toc.hidden||toc.querySelector('.tstar'))return;var d=document.createElement('div');d.className='tstar';d.innerHTML='<img alt="" src="'+star.querySelector('img').src+'"><span>Thanks for<br>viewing</span>';toc.appendChild(d)}
star.addEventListener('animationend',function(e){if(e.target!==star)return;var v=cur();if(v){done[v]=1;add()}});
var ob=buildToc;buildToc=function(v){ob(v);if(done[v])add()}})();

/* --- script 10 (abJs) --- */
(function(){
var cl=document.getElementById('cluster');if(cl){cl.querySelectorAll('.stk').forEach(function(el){var sx,sy,on=0;
el.addEventListener('pointerdown',function(e){on=1;sx=e.clientX;sy=e.clientY;el.setPointerCapture(e.pointerId);el.classList.add('dg');e.preventDefault()});
el.addEventListener('pointermove',function(e){if(on)el.style.transform='translate('+(e.clientX-sx)+'px,'+(e.clientY-sy)+'px)'});
function end(){if(!on)return;on=0;el.classList.remove('dg');el.style.transform=''}
el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('dragstart',function(e){e.preventDefault()})})}
})();

/* --- script 11 (nosJs) --- */
(function(){var o=show;show=function(v){o(v);document.body.classList.toggle("on-about",v==="about")}})();

/* --- script 12 (route) --- */
(function(){var M={work:'work',play:'play',about:'about',zynga:'season-pass',water:'waterway',duo:'duoconvo-cafe',cy:'cyrtan-energy',gi:'google-itinerary',pv:'privy',ov:'oviact'},R={home:'work'},k;for(k in M)R[M[k]]=k;
var o=show,mute=0,hs=document.querySelector('.hsec'),base=location.pathname+location.search;
function onWork(){return hs.getBoundingClientRect().top<=innerHeight*.5}
function want(v){if(v==='work')return onWork()?'#work':'';return M[v]?'#'+M[v]:''}
function put(v,push){if(mute)return;try{var h=want(v);if((location.hash||'')===h)return;history[push?'pushState':'replaceState'](null,'',h?h:base)}catch(e){}}
show=function(v){o(v);put(v,true)};
function curV(){for(k in M)if(!document.getElementById('v-'+k).hidden)return k;return 'work'}
addEventListener('scroll',function(){if(curV()==='work')put('work',false)},{passive:true});
function fromHash(){var h=(location.hash||'').replace('#',''),v=R[h]||'work';mute=1;try{show(v);if(v==='work'){if(h==='work'){requestAnimationFrame(function(){scrollTo(0,hs.getBoundingClientRect().top+pageYOffset-72)})}}}finally{setTimeout(function(){mute=0},60)}}
addEventListener('popstate',fromHash);addEventListener('hashchange',fromHash);
var hp=document.querySelector('nav .pill[data-home]');if(hp)hp.addEventListener('click',function(e){e.preventDefault();if(document.getElementById('v-work').hidden){show('work')}else{scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}});
if(location.hash&&R[location.hash.replace('#','')])fromHash();})();


/* --- "What I bring": pixel stars shoot in and land when scrolled into view --- */
(function(){
  var hw=document.querySelector('#v-work .hw');if(!hw)return;
  var PX=[[5,0],[5,1],[5,2],[5,8],[5,9],[5,10],[0,5],[1,5],[2,5],[8,5],[9,5],[10,5]];
  for(var x=4;x<=6;x++)PX.push([x,3],[x,7]);for(var y=3;y<=7;y++)PX.push([y,4],[y,5],[y,6]);
  var CORE={'4,5':1,'5,5':1,'6,5':1,'5,4':1,'5,6':1},RAYS=[[1,0],[.7,.7],[0,1],[-.7,.7],[-1,0],[-.7,-.7],[0,-1],[.7,-.7]];
  var cards=[].slice.call(hw.querySelectorAll('.hw-c'));
  cards.forEach(function(c,ci){
    var s=c.querySelector('.hw-s');if(!s)return;
    var fill=getComputedStyle(c).getPropertyValue('--c').trim()||'#BFE59C',core=getComputedStyle(c).getPropertyValue('--t').trim()||'#2F7500';
    var sx=-Math.min(innerWidth*.5,520),sy=-Math.min(innerHeight*.4,330),len=Math.hypot(sx,sy),ux=sx/len,uy=sy/len,S=innerWidth<=720?56:72,N=16,gap=S*.2;
    var f=document.createElement('span');f.className='hs-f';f.style.cssText='--sx:'+Math.round(sx)+'px;--sy:'+Math.round(sy)+'px;--hd:'+(ci*.3).toFixed(2)+'s;display:block';
    var g='<svg viewBox="0 0 11 11" shape-rendering="crispEdges" aria-hidden="true">';
    PX.forEach(function(p){g+='<rect x="'+p[0]+'" y="'+p[1]+'" width="1" height="1" fill="'+(CORE[p[0]+','+p[1]]?'#fff':fill)+'"/>'});
    f.innerHTML=g+'</svg>';
    for(var i=1;i<=N;i++){var sz=Math.max(4,Math.round(S*.2*(1-i/(N+2))/2)*2),px=Math.round(ux*i*gap/4)*4,py=Math.round(uy*i*gap/4)*4,d=document.createElement('i');d.className='hs-d';d.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(S/2+px-sz/2)+'px;top:'+(S/2+py-sz/2)+'px;opacity:'+(1-i/(N+3)).toFixed(2);f.appendChild(d)}
    var b=document.createElement('span');b.className='hs-b';RAYS.forEach(function(r){var e=document.createElement('b');e.style.setProperty('--dx',r[0]);e.style.setProperty('--dy',r[1]);b.appendChild(e)});f.appendChild(b);
    s.innerHTML='';s.appendChild(f);
  });
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){hw.classList.add('hs-go');return}
  new IntersectionObserver(function(en,ob){en.forEach(function(x){if(x.isIntersecting){hw.classList.add('hs-go');ob.disconnect()}})},{threshold:.45}).observe(hw);
})();
