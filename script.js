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
