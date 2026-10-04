const body = document.body;
const menuBtn = document.getElementById('menuBtn');
const menuPanel = document.getElementById('menuPanel');
const menuClose = document.getElementById('menuClose');
const logoStage = document.getElementById('logoStage');

window.addEventListener('load', () => {
  setTimeout(() => body.classList.add('ready'), 850);
});

menuBtn.addEventListener('click', () => menuPanel.classList.add('open'));
menuClose.addEventListener('click', () => menuPanel.classList.remove('open'));
document.querySelectorAll('.menu-panel a').forEach(a => {
  a.addEventListener('click', () => menuPanel.classList.remove('open'));
});

if (window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5);
    const y = (e.clientY / innerHeight - .5);
    logoStage.style.transform = `perspective(1100px) rotateY(${x*7}deg) rotateX(${y*-5}deg)`;
  });
  document.addEventListener('pointerleave', () => logoStage.style.transform = '');
}

// Particle field — lightweight and intentionally subtle.
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  particles = Array.from({length: Math.min(90, Math.floor(innerWidth/14))}, () => ({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    r: Math.random()*1.4+.2, v: Math.random()*.18+.03,
    a: Math.random()*.5+.1
  }));
}
function draw() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for (const p of particles) {
    p.y -= p.v;
    if (p.y < -5) { p.y = innerHeight+5; p.x = Math.random()*innerWidth; }
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(224,199,131,${p.a})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize(); draw();
addEventListener('resize', resize);

// Reveal animation.
const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.animate(
      [{opacity:0, transform:'translateY(35px)'},{opacity:1, transform:'translateY(0)'}],
      {duration:900,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'}
    );
    reveal.unobserve(entry.target);
  });
},{threshold:.12});
document.querySelectorAll('.section-top,.voyage-grid,.map-shell,.crew-intro,.crew-grid,.signal-card').forEach(el => {
  el.style.opacity = 0; reveal.observe(el);
});

// Interactive layer — cinematic but lightweight.
const cursorGlow = document.getElementById('cursorGlow');
const progress = document.querySelector('#progress span');
if (matchMedia('(pointer:fine)').matches) {
  document.body.classList.add('cursor-on');
  addEventListener('pointermove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2), y = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${x*.12}px,${y*.12}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${Math.min(100, Math.max(0, scrollY / max * 100))}%`;
}, {passive:true});

// Coordinate discovery.
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('click', () => {
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
    pin.classList.add('active');
    const toast = document.getElementById('mapToast');
    toast.textContent = pin.dataset.message;
    toast.classList.remove('flash');
    void toast.offsetWidth;
    toast.classList.add('flash');
  });
});

// Signal interception.
const signalBtn = document.getElementById('signalBtn');
const signalReveal = document.getElementById('signalReveal');
signalBtn?.addEventListener('click', () => {
  signalReveal.classList.toggle('show');
  signalBtn.textContent = signalReveal.classList.contains('show') ? 'SIGNAL DECODED' : 'INTERCEPT SIGNAL';
});

// Gentle section parallax.
if (matchMedia('(pointer:fine)').matches) {
  addEventListener('scroll', () => {
    document.querySelectorAll('.hero .logo-stage,.hero .moon').forEach((el,i) => {
      const y = scrollY * (i ? .025 : -.035);
      el.style.translate = `0 ${y}px`;
    });
  }, {passive:true});
}

// Cinematic dropdown navigation
const dropButtons = document.querySelectorAll('.nav-drop-btn');
dropButtons.forEach(btn => btn.addEventListener('click', () => {
  const parent = btn.closest('.nav-drop');
  document.querySelectorAll('.nav-drop.open').forEach(item => { if(item !== parent) item.classList.remove('open'); });
  parent.classList.toggle('open');
}));

// Cinematic chapter cuts when entering major scenes.
const cutscene = document.getElementById('cutscene');
const cutsceneKicker = document.getElementById('cutsceneKicker');
const cutsceneTitle = document.getElementById('cutsceneTitle');
const cutsceneSub = document.getElementById('cutsceneSub');
const chapterScenes = [
  {id:'voyage', kicker:'CHAPTER 01', title:'THE VOYAGE', sub:'THE CALM BEFORE THE STORM'},
  {id:'waters', kicker:'CHAPTER 02', title:'UNCHARTED WATERS', sub:'THE MAP IS STILL BEING DRAWN'},
  {id:'crew', kicker:'CHAPTER 03', title:'THE CREW', sub:'HANDS ON DECK'},
  {id:'signal', kicker:'CHAPTER 04', title:'THE SIGNAL', sub:'TRANSMISSION INCOMING'},
  {id:'final', kicker:'FINAL LOG', title:'THE SEA AWAITS', sub:'THE NEXT VOYAGE BEGINS'}
];
let lastChapter = '';
let cutLock = false;
function playCut(scene){
  if(cutLock || lastChapter === scene.id) return;
  cutLock = true; lastChapter = scene.id;
  cutsceneKicker.textContent = scene.kicker; cutsceneTitle.textContent = scene.title; cutsceneSub.textContent = scene.sub;
  cutscene.classList.remove('active'); void cutscene.offsetWidth; cutscene.classList.add('active');
  setTimeout(()=>cutLock=false,1050);
}
const sceneObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && entry.intersectionRatio > .28){
      entry.target.classList.add('scene-in');
      const scene = chapterScenes.find(s => s.id === entry.target.id);
      if(scene) playCut(scene);
    }
  });
},{threshold:[.28,.55]});
chapterScenes.forEach(s=>{const el=document.getElementById(s.id); if(el) sceneObserver.observe(el)});

// Make menu links feel like cinematic scene transitions.
document.querySelectorAll('.nav-drop-content a').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    menuPanel.classList.remove('open');
    if(target){
      const scene = chapterScenes.find(s=>s.id===target.id);
      if(scene){ lastChapter=''; setTimeout(()=>playCut(scene),120); }
    }
  });
});
