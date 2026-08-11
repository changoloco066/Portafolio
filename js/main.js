const { animate, createTimeline, stagger, onScroll, utils, scrambleText } = anime;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* anime.js v4: hero entrance  */
if(prefersReduced){
  utils.set('#eyebrow, #heroTitle, #heroTag, #heroLinks', { opacity: 1, translateY: 0 });
} else {
  createTimeline({ defaults: { ease: 'outExpo' } })
    .add('#eyebrow',   { opacity: [0,1], translateY: [8,0], innerHTML: scrambleText({ chars: 'braille' }), duration: 900 })
    .add('#heroTitle', { opacity: [0,1], translateY: [16,0], duration: 700 }, '-=500')
    .add('#heroTag',   { opacity: [0,1], translateY: [10,0], duration: 600 }, '-=400')
    .add('#heroLinks', { opacity: [0,1], translateY: [10,0], duration: 500 }, '-=350');
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