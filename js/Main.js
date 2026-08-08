/* ---------------- Hero: automaton canvas ---------------- */
const canvas = document.getElementById('automaton');
const ctx = canvas.getContext('2d');
let W, H, DPR;

function resize(){
  DPR = window.devicePixelRatio || 1;
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize', resize);

const word = "JOSUE";
let states = [];
let activeIndex = -1;
let pulseT = 0;
let lastStep = 0;
const stepInterval = 650;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function layoutStates(){
  states = [];
  const n = word.length + 1; // states: q0..qn (accept)
  const margin = 70;
  const usableW = Math.max(W - margin*2, 100);
  for(let i=0;i<n;i++){
    const x = margin + (usableW * i / (n-1));
    const y = H/2 + (i % 2 === 0 ? -18 : 18);
    states.push({x, y, accept: i === n-1});
  }
}

function draw(ts){
  if(!lastStep) lastStep = ts;
  ctx.clearRect(0,0,W,H);

  // edges
  ctx.lineWidth = 1.4;
  for(let i=0;i<states.length-1;i++){
    const a = states[i], b = states[i+1];
    const lit = i < activeIndex;
    ctx.strokeStyle = lit ? 'rgba(232,163,61,0.85)' : 'rgba(42,53,80,0.9)';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    const midX = (a.x+b.x)/2, midY = Math.min(a.y,b.y) - 26;
    ctx.quadraticCurveTo(midX, midY, b.x, b.y);
    ctx.stroke();

    // transition label (letter consumed)
    if(i < word.length){
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillStyle = lit ? '#E8A33D' : '#8892B0';
      ctx.textAlign = 'center';
      ctx.fillText(word[i], midX, midY - 6);
    }
  }

  // nodes
  for(let i=0;i<states.length;i++){
    const s = states[i];
    const isActive = i === activeIndex;
    const isPast = i < activeIndex;
    const r = s.accept ? 15 : 12;

    if(isActive && !prefersReduced){
      const glow = 8 + Math.sin(pulseT/120) * 4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r+glow, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(232,163,61,0.15)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, Math.PI*2);
    ctx.fillStyle = '#0B1120';
    ctx.fill();
    ctx.lineWidth = isActive ? 2.4 : 1.6;
    ctx.strokeStyle = isActive ? '#E8A33D' : (isPast ? '#5FB3B3' : '#2A3550');
    ctx.stroke();

    if(s.accept){
      ctx.beginPath();
      ctx.arc(s.x, s.y, r-4, 0, Math.PI*2);
      ctx.strokeStyle = isPast || isActive ? '#5FB3B3' : '#2A3550';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  pulseT += 16;
  if(ts - lastStep > stepInterval){
    lastStep = ts;
    activeIndex++;
    if(activeIndex > states.length){
      activeIndex = -1; // reset loop after a pause
    }
  }
  requestAnimationFrame(draw);
}

resize();
layoutStates();
window.addEventListener('resize', layoutStates);
requestAnimationFrame(draw);

/* ---------------- anime.js: hero entrance ---------------- */
anime.timeline({ easing: 'easeOutExpo' })
  .add({ targets:'#eyebrow', opacity:[0,1], translateY:[8,0], duration:600 })
  .add({ targets:'#heroTitle', opacity:[0,1], translateY:[16,0], duration:700 }, '-=350')
  .add({ targets:'#heroTag', opacity:[0,1], translateY:[10,0], duration:600 }, '-=400')
  .add({ targets:'#heroLinks', opacity:[0,1], translateY:[10,0], duration:500 }, '-=350');

/* ---------------- scroll reveal ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      anime({
        targets: entry.target,
        opacity: [0,1],
        translateY: [16,0],
        duration: 700,
        easing: 'easeOutExpo'
      });
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));