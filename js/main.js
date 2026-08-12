const { animate, stagger, onScroll, utils } = anime;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- boot terminal intro ---------------- */
const bootOverlay = document.getElementById('bootOverlay');
const bootBody = document.getElementById('bootBody');

const bootScript = [
  { type:'cmd', prompt:'visitor@josue:~$ ',           text:'cd portfolio' },
  { type:'cmd', prompt:'visitor@josue:~/portfolio$ ', text:'ls -la' },
  { type:'out', text:'drwxr-xr-x   6 josue  staff   192B  index.html' },
  { type:'out', text:'drwxr-xr-x   3 josue  staff    96B  css/' },
  { type:'out', text:'drwxr-xr-x   3 josue  staff    96B  js/' },
  { type:'out', text:'drwxr-xr-x   4 josue  staff   128B  src/' },
  { type:'out', text:'-rw-r--r--   1 josue  staff   1.2K  README.md' },
  { type:'cmd', prompt:'visitor@josue:~/portfolio$ ', text:'./boot.sh' },
  { type:'out', text:'[ok] mounting DOM' },
  { type:'out', text:'[ok] loading fonts (Fraunces, JetBrains Mono)' },
  { type:'out', text:'[ok] initializing automaton (rule 30)' },
  { type:'out', text:'[ok] session ready' },
];

function finishBoot(){
  if(!bootOverlay) return;
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  if(prefersReduced){
    bootOverlay.style.display = 'none';
    return;
  }
  animate(bootOverlay, {
    opacity: [1, 0],
    duration: 500,
    ease: 'inOutQuad',
    onComplete: () => { bootOverlay.style.display = 'none'; }
  });
}

if(bootOverlay && bootBody){
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  if(prefersReduced){
    finishBoot();
  } else {
    let skipped = false;
    const skip = () => { if(!skipped){ skipped = true; finishBoot(); } };
    bootOverlay.addEventListener('click', skip);
    window.addEventListener('keydown', skip, { once:true });

    (async () => {
      for(const line of bootScript){
        if(skipped) break;
        const row = document.createElement('div');
        row.className = 'boot-line' + (line.type === 'out' ? ' boot-out' : '');
        bootBody.appendChild(row);

        if(line.type === 'cmd'){
          const promptSpan = document.createElement('span');
          promptSpan.className = 'boot-prompt';
          promptSpan.textContent = line.prompt;
          row.appendChild(promptSpan);

          const cmdSpan = document.createElement('span');
          cmdSpan.className = 'boot-cmd typing';
          row.appendChild(cmdSpan);

          for(const ch of line.text){
            if(skipped) break;
            cmdSpan.textContent += ch;
            await new Promise(r => setTimeout(r, 28 + Math.random() * 100));
          }
          cmdSpan.classList.remove('typing');
          await new Promise(r => setTimeout(r, 310));
        } else {
          row.textContent = line.text;
          await new Promise(r => setTimeout(r, 210));
        }
        bootBody.scrollTop = bootBody.scrollHeight;
      }

      if(!skipped){
        const cursorRow = document.createElement('div');
        cursorRow.className = 'boot-line';
        const promptSpan = document.createElement('span');
        promptSpan.className = 'boot-prompt';
        promptSpan.textContent = 'visitor@josue:~/portfolio$ ';
        cursorRow.appendChild(promptSpan);
        const cursor = document.createElement('span');
        cursor.className = 'boot-cursor';
        cursorRow.appendChild(cursor);
        bootBody.appendChild(cursorRow);

        await new Promise(r => setTimeout(r, 450));
        finishBoot();
      }
    })();
  }
}

/*  scroll reveal (sections) via native ScrollObserver  */
const revealEls = document.querySelectorAll('.reveal:not(.card)');
if(prefersReduced){
  utils.set(revealEls, { opacity: 1, translateY: 0 });
} else {
  revealEls.forEach(el => {
    animate(el, {
      opacity: [0,1],
      translateY: [16,0],
      duration: 700,
      ease: 'outExpo',
      autoplay: onScroll({ target: el, enter: 'bottom-=10% top', repeat: false })
    });
  });
}

/* staggered skill lists  */
const skillsGrid = document.querySelector('.skills-grid');
if(skillsGrid){
  const skillItems = skillsGrid.querySelectorAll('.skill-group li');
  if(prefersReduced){
    utils.set(skillItems, { opacity: 1, translateX: 0 });
  } else {
    animate(skillItems, {
      opacity: [0,1],
      translateX: [-10,0],
      delay: stagger(45),
      duration: 500,
      ease: 'outExpo',
      autoplay: onScroll({ target: skillsGrid, enter: 'bottom-=10% top', repeat: false })
    });
  }
}

/*  project cards: staggered entrance + hover lift */
const cards = document.querySelectorAll('.card');
if(prefersReduced){
  utils.set(cards, { opacity: 1, translateY: 0 });
} else {
  animate(cards, {
    opacity: [0,1],
    translateY: [20,0],
    delay: stagger(60),
    duration: 650,
    ease: 'outExpo',
    autoplay: onScroll({ target: '.projects', enter: 'bottom-=10% top', repeat: false })
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', ()=>{
      animate(card, { translateX: 6, duration: 300, ease: 'outQuad' });
    });
    card.addEventListener('mouseleave', ()=>{
      animate(card, { translateX: 0, duration: 300, ease: 'outQuad' });
    });
  });
}

/* ---------------- magnetic buttons ---------------- */
if(!prefersReduced){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e)=>{
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width/2) * 0.25;
      const y = (e.clientY - rect.top - rect.height/2) * 0.4;
      animate(btn, { translateX: x, translateY: y, duration: 200, ease: 'outQuad' });
    });
    btn.addEventListener('mouseleave', ()=>{
      animate(btn, { translateX: 0, translateY: 0, duration: 400, ease: 'outElastic(1, .6)' });
    });
  });
}

/* ---------------- nav link underline ---------------- */
document.querySelectorAll('.navlinks a').forEach(link => {
  link.style.backgroundImage = 'linear-gradient(var(--amber), var(--amber))';
  link.style.backgroundRepeat = 'no-repeat';
  link.style.backgroundPosition = '0 100%';
  link.style.backgroundSize = '0% 1px';
  link.style.paddingBottom = '2px';
  if(prefersReduced) return;
  link.addEventListener('mouseenter', ()=>{
    animate(link, { backgroundSize: ['0% 1px','100% 1px'], duration: 300, ease: 'outQuad' });
  });
  link.addEventListener('mouseleave', ()=>{
    animate(link, { backgroundSize: ['100% 1px','0% 1px'], duration: 250, ease: 'inQuad' });
  });
});

/*  Duke's mug: idle steam + hover wiggle  */
if(!prefersReduced){
  animate('.steam-wisp', {
    translateY: [0, -6],
    opacity: [0.7, 0],
    ease: 'outSine',
    duration: 1400,
    delay: stagger(220),
    loop: true
  });
}
const dukeMug = document.getElementById('dukeMug');
if(dukeMug && !prefersReduced){
  dukeMug.addEventListener('mouseenter', ()=>{
    animate(dukeMug, {
      rotate: [
        { to: -8, duration: 120 },
        { to: 8,  duration: 160 },
        { to: 0,  duration: 140 }
      ],
      ease: 'inOutSine'
    });
  });
}

/* ---------------- hero canvas: live elementary cellular automaton (Rule 30) ---------------- */
/* δ: Σ* → Q — the eyebrow line isn't decoration, this is the automaton it refers to */
const automatonCanvas = document.getElementById('automaton');
if(automatonCanvas){
  const ctx = automatonCanvas.getContext('2d');
  const RULE = 30;               // swap for 90, 110, 184... to change the pattern
  const CELL = 5;                 // px per cell
  const ruleBits = RULE.toString(2).padStart(8, '0').split('').map(Number);
  const nextState = (l, c, r) => ruleBits[7 - (l * 4 + c * 2 + r)];

  let cols, rows, cells, row = 0;
  let rafId = null;

  function sizeCanvas(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = automatonCanvas.clientWidth;
    const h = automatonCanvas.clientHeight;
    automatonCanvas.width = w * dpr;
    automatonCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.floor(w / CELL);
    rows = Math.floor(h / CELL);
    cells = new Uint8Array(cols);
    cells[Math.floor(cols / 2)] = 1;   // single seed cell, centered
    row = 0;
    ctx.clearRect(0, 0, w, h);
  }

  function drawRow(){
    ctx.save();
    ctx.shadowColor = 'rgba(76,255,122,0.85)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#4CFF7A';
    for(let i=0;i<cols;i++){
      if(cells[i]) ctx.fillRect(i*CELL, row*CELL, CELL-1, CELL-1);
    }
    ctx.restore();
  }

  function stepAutomaton(){
    const next = new Uint8Array(cols);
    for(let i=0;i<cols;i++){
      const l = cells[(i - 1 + cols) % cols];
      const c = cells[i];
      const r = cells[(i + 1) % cols];
      next[i] = nextState(l, c, r);
    }
    cells = next;
    row++;
    if(row >= rows){
      // fade the whole trace and reseed, so it runs indefinitely without ever feeling static
      ctx.fillStyle = 'rgba(11,17,32,0.94)';
      ctx.fillRect(0, 0, automatonCanvas.clientWidth, automatonCanvas.clientHeight);
      cells = new Uint8Array(cols);
      cells[Math.floor(cols / 2)] = 1;
      row = 0;
    }
  }

  sizeCanvas();
  if(prefersReduced){
    // static single generation — still legible as automaton theory, no motion
    for(let r=0;r<Math.min(rows, 40);r++){ drawRow(); stepAutomaton(); }
  } else {
    let last = 0;
    const FRAME_MS = 90;
    function loop(ts){
      if(ts - last >= FRAME_MS){
        drawRow();
        stepAutomaton();
        last = ts;
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    let resizeTimer;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeCanvas, 200);
    });
  }
}

/* ---------------- Flipper Zero badge: hover wiggle, same family as Duke's mug ---------------- */
const flipperIcon = document.getElementById('flipperIcon');
if(flipperIcon && !prefersReduced){
  flipperIcon.addEventListener('mouseenter', ()=>{
    animate(flipperIcon, {
      rotate: [
        { to: -10, duration: 90 },
        { to: 10,  duration: 130 },
        { to: 0,   duration: 110 }
      ],
      ease: 'inOutSine'
    });
  });
}
const dragonDivider = document.getElementById('dragonDivider');
if(dragonDivider){
  if(prefersReduced){
    utils.set(dragonDivider, { opacity: 1 });
  } else {
    animate(dragonDivider, {
      opacity: [0, 0.9],
      scale: [0.94, 1],
      duration: 900,
      ease: 'outQuad',
      autoplay: onScroll({ target: dragonDivider, enter: 'bottom-=10% top', repeat: false })
    });
  }
}

/* ---------------- dot divider: grid stagger ripple (nod to animejs.com) ---------------- */
const dotDivider = document.getElementById('dotDivider');
if(dotDivider){
  const COLS = 16, ROWS = 3;
  const frag = document.createDocumentFragment();
  for(let i=0;i<COLS*ROWS;i++){
    const dot = document.createElement('span');
    dot.className = 'dot';
    frag.appendChild(dot);
  }
  dotDivider.appendChild(frag);
  const dots = dotDivider.querySelectorAll('.dot');

  if(prefersReduced){
    utils.set(dots, { scale: 1 });
  } else {
    animate(dots, {
      scale: [0, 1],
      opacity: [0, 0.8],
      delay: stagger(28, { grid: [COLS, ROWS], from: 'center' }),
      duration: 500,
      ease: 'outQuad',
      autoplay: onScroll({ target: dotDivider, enter: 'bottom-=5% top', repeat: false })
    });
  }

}

/* ---------------- scroll progress bar: onScroll sync mode ---------------- */
/* tracks the whole page (body) top->bottom against the viewport, sync:true ties
   the bar's scaleX directly to scroll position — no manual scroll listener needed */
const scrollProgress = document.getElementById('scrollProgress');
if(scrollProgress){
  if(prefersReduced){
    scrollProgress.style.display = 'none';
  } else {
    animate(scrollProgress, {
      scaleX: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        target: document.body,
        container: window,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true
      })
    });
  }
}