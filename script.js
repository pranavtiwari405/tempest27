const body=document.body, loader=document.getElementById('loader');
window.addEventListener('load',()=>setTimeout(()=>body.classList.add('loaded'),1000));

const trigger=document.getElementById('menuTrigger'), drawer=document.getElementById('navDrawer'), close=document.getElementById('drawerClose');
trigger.onclick=()=>drawer.classList.add('open'); close.onclick=()=>drawer.classList.remove('open');
document.querySelectorAll('.nav-drawer a').forEach(a=>a.onclick=()=>drawer.classList.remove('open'));

const glow=document.querySelector('.cursor-glow');
addEventListener('pointermove',e=>{
  glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
  document.querySelectorAll('.crew-grid article').forEach(card=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)*.12, y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

// Stars
const canvas=document.getElementById('stars'),ctx=canvas.getContext('2d');let pts=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:Math.min(130,Math.floor(innerWidth/10))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.2,v:Math.random()*.12+.02,a:Math.random()*.5+.1}));}
function stars(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of pts){p.y-=p.v;if(p.y<0)p.y=innerHeight;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(224,199,131,${p.a})`;ctx.fill()}requestAnimationFrame(stars)}resize();stars();addEventListener('resize',resize);

// Map drag
const stage=document.getElementById('mapStage'),paper=stage.querySelector('.map-paper');let drag=false,sx=0,sy=0,ox=0,oy=0;
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.map-pin'))return;drag=true;sx=e.clientX;sy=e.clientY;stage.classList.add('dragging')});
addEventListener('pointermove',e=>{if(!drag)return;ox+=(e.clientX-sx)*.45;oy+=(e.clientY-sy)*.45;sx=e.clientX;sy=e.clientY;paper.style.transform=`translate(${ox}px,${oy}px) rotate(-2deg)`});
addEventListener('pointerup',()=>{drag=false;stage.classList.remove('dragging')});

// Map pins
const info=document.getElementById('mapInfo'),title=document.getElementById('infoTitle'),copy=document.getElementById('infoCopy');
document.querySelectorAll('.map-pin').forEach(pin=>pin.onclick=()=>{title.textContent=pin.dataset.title;copy.textContent=pin.dataset.copy;info.classList.add('show')});
document.getElementById('mapInfoClose').onclick=()=>info.classList.remove('show');

// Manifest hold-to-open
const seal=document.getElementById('sealBtn'),chest=document.getElementById('chest'),reveal=document.getElementById('manifestReveal');
let holdTimer=null,start=0;
function beginHold(){if(holdTimer)return;seal.classList.add('holding');start=Date.now();holdTimer=setInterval(()=>{if(Date.now()-start>1800){clearInterval(holdTimer);holdTimer=null;chest.classList.add('open');reveal.classList.add('show');seal.classList.remove('holding')}},30)}
function cancelHold(){if(holdTimer){clearInterval(holdTimer);holdTimer=null;seal.classList.remove('holding')}}
seal.addEventListener('pointerdown',beginHold);['pointerup','pointerleave','pointercancel'].forEach(e=>seal.addEventListener(e,cancelHold));

// HUD changes by scroll
const hud=document.getElementById('hudCoord');
const coords=['22°33\\'N / 88°21\\'E','UNKNOWN / STORM FRONT','CLASSIFIED / CHART 27','LOCKED / CREW ONLY','HORIZON / CLEAR'];
const sections=[...document.querySelectorAll('section.scene')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=sections.indexOf(e.target);hud.textContent=coords[Math.max(0,i)]||coords[0]}}),{threshold:.45});
sections.forEach(s=>io.observe(s));

// Tiny scroll parallax
addEventListener('scroll',()=>{
  const y=scrollY;
  document.querySelector('.moon').style.transform=`translateY(${y*.06}px)`;
  document.querySelector('.ship').style.transform=`translateX(-50%) translateY(${Math.sin(y*.003)*8}px)`;
},{passive:true});
