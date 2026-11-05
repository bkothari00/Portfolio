/* hero node map */
(function(){
  var map=document.getElementById('hmap'),svg=document.getElementById('hmlines'),kidsEl0=document.getElementById('hmkids');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS='http://www.w3.org/2000/svg';

  /* pixel sparkle */
  var PX=[[5,0],[5,1],[5,2],[5,8],[5,9],[5,10],[0,5],[1,5],[2,5],[8,5],[9,5],[10,5]];
  for(var a=4;a<=6;a++)PX.push([a,3],[a,7]);
  for(var b=3;b<=7;b++)PX.push([b,4],[b,5],[b,6]);
  var CORE={'4,5':1,'5,5':1,'6,5':1,'5,4':1,'5,6':1};
  function sparkle(c){var s='<svg class="sv" viewBox="0 0 11 11" shape-rendering="crispEdges" aria-hidden="true">';PX.forEach(function(p){s+='<rect x="'+p[0]+'" y="'+p[1]+'" width="1" height="1" fill="'+(CORE[p[0]+','+p[1]]?'#fff':c)+'"/>'});return s+'</svg>'}
  var RAYS=[[1,0],[.7,.7],[0,1],[-.7,.7],[-1,0],[-.7,-.7],[0,-1],[.7,-.7]];

  /* nodes: x,y are fractions of the map box */
  var N={
    root:{k:'root',x:.5,y:.46,t:2.9},
    design:{k:'star',x:.26,y:.24,c:'#A5D67A',lc:'#2F7500',l:'Design',from:[-.9,-.8],d:.2},
    business:{k:'star',x:.76,y:.22,c:'#BBA3E8',lc:'#6B3FB5',l:'Business',from:[1.1,-.25],d:.7},
    tech:{k:'star',x:.62,y:.80,c:'#9DBDF0',lc:'#1A5FD0',l:'Technology',from:[-.2,1.2],d:1.2},
    zynga:{cs:'zynga',k:'proj',x:.19,y:.08,l:'Zynga Season Pass',t:3.5},
    gi:{cs:'gi',k:'proj',x:.2,y:.64,l:'Google Itinerary',t:3.8},
    privy:{cs:'pv',k:'proj',x:.85,y:.74,l:'Privy',t:4.1}
  };
  var E=[['root','design'],['root','business'],['root','tech'],['design','zynga'],['tech','privy'],['gi','design'],['gi','tech']];
  var DOTS=[[.03,.20],[.30,.05],[.62,.14],[.95,.30],[.70,.46],[.20,.62],[.34,.40],[.62,.66],[.08,.78],[.30,.92],[.66,.95],[.96,.78],[.56,.36],[.40,.64],[.92,.06],[.18,.36]];
  DOTS.forEach(function(d,i){N['dot'+i]={k:'dot',x:d[0],y:d[1],t:3.2+i*.06,c:i%5===0?1:i%5===2?2:i%7===3?3:0}});

  var ids=Object.keys(N);
  ids.forEach(function(id,i){
    var n=N[id],el=document.createElement(n.k==='proj'?'a':n.k==='root'?'button':'div');
    el.className='nd';n.el=el;n.ph=[Math.random()*6.28,Math.random()*6.28];n.amp=n.k==='star'?11:n.k==='dot'?14:n.k==='root'?9:8;n.f=[.35+Math.random()*.25,.3+Math.random()*.25];
    if(n.k==='star'){
      el.classList.add('star');el.innerHTML=sparkle(n.c)+'<div class="tr"></div><div class="bu"></div><span class="lb" style="color:'+n.lc+'">'+n.l+'</span>';
      var bu=el.querySelector('.bu');RAYS.forEach(function(r,j){var q=document.createElement('b');q.style.setProperty('--dx',r[0]);q.style.setProperty('--dy',r[1]);q.style.background=j%2?'#fff':n.c;bu.appendChild(q)});
    }else if(n.k==='proj'){el.classList.add('proj');el.href='#';el.dataset.open='';el.dataset.case=n.cs;el.dataset.label='view project';el.textContent=n.l}
    else if(n.k==='root'){el.classList.add('root');el.type='button';el.setAttribute('aria-expanded','false');el.setAttribute('aria-controls','hmkids');el.innerHTML='<span class="hm-hint"></span>Bhavya<span class="hm-click" aria-hidden="true">click me ↓</span>';}
    else{el.classList.add('dot');if(n.c)el.classList.add('c'+n.c)}
    map.insertBefore(el,kidsEl0);
  });
  var lines=E.map(function(e){var l=document.createElementNS(NS,'line');svg.appendChild(l);return {l:l,a:N[e[0]],b:N[e[1]],on:false}});

  var W=0,H=0,S=56,narrow=false,t0=performance.now(),frozen=null;
  function measure(){var r=map.getBoundingClientRect();W=r.width;H=r.height;narrow=W<520;N.root.y=narrow?.32:.46;S=innerWidth<=960?44:56;buildTrails()}
  function buildTrails(){
    ['design','business','tech'].forEach(function(id){
      var n=N[id],tr=n.el.querySelector('.tr');tr.innerHTML='';
      var sx=n.from[0]*innerWidth,sy=n.from[1]*innerHeight,len=Math.hypot(sx,sy)||1,ux=sx/len,uy=sy/len,gap=S*.2,cnt=16;
      n.sx=sx;n.sy=sy;
      for(var i=1;i<=cnt;i++){
        var sz=Math.max(2,Math.round(S*.2*(1-i/(cnt+2))/2)*2),px=Math.round(ux*i*gap/4)*4,py=Math.round(uy*i*gap/4)*4,d=document.createElement('i');
        d.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(S/2+px-sz/2)+'px;top:'+(S/2+py-sz/2)+'px;background:'+n.c+';opacity:'+(1-i/(cnt+3)).toFixed(2);
        tr.appendChild(d);
      }
    });
  }
  function ease(p){return 1-Math.pow(1-p,3)}
  function place(n,x,y){n.px=x;n.py=y;n.el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-50%)'}

  function frame(now){
    var t=(now-t0)/1000;
    ids.forEach(function(id){
      var n=N[id],bx=n.x*W,by=n.y*H,x=bx,y=by,appear=n.k==='star'?n.d+1.4:n.t;
      if(n.k==='star'){
        if(!reduce){
          var p=Math.min(1,Math.max(0,(t-n.d)/1.4));
          n.el.style.opacity=t<n.d?0:1;
          x=bx+n.sx*(1-ease(p));y=by+n.sy*(1-ease(p));
          if(p>=1&&!n.landed){n.landed=true;n.el.classList.add('landed')}
        }else{n.landed=true}
      }
      if(!reduce&&t>appear&&!(id==='root'&&open)){
        var k=Math.min(1,(t-appear)/2.5);
        x+=Math.sin(t*n.f[0]*2+n.ph[0])*n.amp*k;y+=Math.cos(t*n.f[1]*2+n.ph[1])*n.amp*k;
      }else if(id==='root'&&open&&frozen){x=frozen[0];y=frozen[1]}
      if(id==='root'&&!open)frozen=null;
      place(n,x,y);
      if(!n.shown&&(reduce||t>appear)&&n.k!=='star'){n.shown=true;n.el.classList.add('on')}
    });
    lines.forEach(function(L,i){
      L.l.setAttribute('x1',L.a.px);L.l.setAttribute('y1',L.a.py);L.l.setAttribute('x2',L.b.px);L.l.setAttribute('y2',L.b.py);
      if(!L.on&&(reduce||t>(L.a.k==='root'?3.2:3.6+i*.05))){L.on=true;L.l.classList.add('on')}
    });
    requestAnimationFrame(frame);
  }

  /* Bhavya opens Music, Food, Travel, Sports */
  var root=N.root.el,kidsEl=document.getElementById('hmkids'),kl=document.getElementById('hmklines'),pillsEl=document.getElementById('hmpills'),card=document.getElementById('hmcard');
  var pills=[].slice.call(pillsEl.querySelectorAll('.kp')),panels=[].slice.call(card.querySelectorAll('.kpanel')),ktitle=document.getElementById('hmkt'),open=false,active=null,kLines=[];
  pills.forEach(function(){var l=document.createElementNS(NS,'line');kl.appendChild(l);kLines.push(l)});
  function layout(){
    var rx=N.root.px||W*.5,ry=N.root.py||H*N.root.y;
    pillsEl.style.top=(ry+40)+'px';
    var bottom=0;
    pills.forEach(function(p,i){
      var cx=pillsEl.offsetLeft+p.offsetLeft+p.offsetWidth/2,cy=pillsEl.offsetTop+p.offsetTop;
      bottom=Math.max(bottom,cy+p.offsetHeight);
      kLines[i].setAttribute('x1',rx);kLines[i].setAttribute('y1',ry);kLines[i].setAttribute('x2',cx);kLines[i].setAttribute('y2',cy);
    });
    var top=bottom+14;card.style.top=top+'px';card.style.height=Math.max(190,Math.min(310,H-top-12))+'px';
  }
  function select(k){
    if(active===k){closeCard();return}
    active=k;
    pills.forEach(function(p){var on=p.dataset.k===k;p.classList.toggle('on',on);p.setAttribute('aria-pressed',on);if(on)card.style.setProperty('--kt',p.style.getPropertyValue('--t'))});
    panels.forEach(function(p){p.classList.toggle('on',p.dataset.k===k)});
    ktitle.textContent=k;card.classList.add('show');
    var g=card.querySelector('.kpanel.on .gal');if(g)g.scrollLeft=0;
  }
  function closeCard(){active=null;card.classList.remove('show');pills.forEach(function(p){p.classList.remove('on');p.setAttribute('aria-pressed','false')})}
  function openKids(){if(open)return;open=true;frozen=[N.root.px,N.root.py];layout();void kidsEl.offsetWidth;kidsEl.classList.add('open');root.setAttribute('aria-expanded','true');map.classList.add('dim');root.classList.add('keep','clicked');setTimeout(function(){select('Music')},250)}
  function closeKids(){if(!open)return;open=false;closeCard();kidsEl.classList.remove('open');root.setAttribute('aria-expanded','false');map.classList.remove('dim')}
  pills.forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();select(p.dataset.k)})});
  document.getElementById('hmkx').addEventListener('click',function(e){e.stopPropagation();closeCard()});
  root.addEventListener('click',function(e){e.stopPropagation();open?closeKids():openKids()});
  addEventListener('keydown',function(e){if(e.key==='Escape'){if(active)closeCard();else closeKids()}});
  document.addEventListener('click',function(e){if(open&&!kidsEl.contains(e.target))closeKids()});

  measure();addEventListener('resize',function(){measure();if(open)closeKids()});
  if(window.ResizeObserver)new ResizeObserver(measure).observe(map);
  requestAnimationFrame(function(n){t0=n;frame(n)});
})()
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
