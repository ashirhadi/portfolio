// script.js — Lightweight interactions for holographic portfolio
(function(){
  'use strict';

  // Prefers reduced motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if(toggle && navLinks){
    toggle.addEventListener('click', ()=>{
      navLinks.classList.toggle('open');
    });
    // close when link clicked (mobile)
    navLinks.addEventListener('click', (e)=>{
      if(e.target.matches('a')) navLinks.classList.remove('open');
    });
  }

  // Typing effect
  const phrases = [
    'Facility Management Professional',
    'Team Leader',
    'Technician',
    'MEP Operations Support',
    'Computer Operations Professional'
  ];

  const typedEl = document.getElementById('typed-text');
  const cursor = document.querySelector('.cursor');

  function typeLoop(el, list, opts={}){
    if(!el) return;
    let idx = 0; let char = 0; let forward = true; let delay = 80;
    const pause = 1200;

    const step = ()=>{
      if(reduced){ // no animation
        el.textContent = list[0];
        if(cursor) cursor.style.display='none';
        return;
      }
      const current = list[idx];
      if(forward){
        if(char <= current.length){
          el.textContent = current.slice(0,char);
          char++;
          setTimeout(step, delay);
        } else {
          forward = false;
          setTimeout(step, pause);
        }
      } else {
        if(char > 0){
          el.textContent = current.slice(0,char-1);
          char--;
          setTimeout(step, 35);
        } else {
          forward = true;
          idx = (idx + 1) % list.length;
          setTimeout(step, 160);
        }
      }
    };
    step();
  }
  typeLoop(typedEl, phrases);

  // IntersectionObserver reveal and active nav
  const sections = document.querySelectorAll('main section, header.hero');
  const navItems = document.querySelectorAll('.nav-links a');

  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('reveal');
          // set active nav
          const id = entry.target.id;
          if(id){
            navItems.forEach(a=>{
              a.classList.toggle('active', a.getAttribute('href') === '#'+id);
            });
          }
        }
      });
    },{threshold:0.25});

    sections.forEach(s=>obs.observe(s));
  } else {
    // fallback: reveal all
    sections.forEach(s=>s.classList.add('reveal'));
  }

  // Mouse parallax on holo-card (desktop only)
  const holoStage = document.getElementById('holo-stage');
  const holoCard = document.getElementById('holo-card');

  if(holoStage && holoCard && !reduced){
    const onMove = (e)=>{
      const rect = holoStage.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
      const dy = (e.clientY - cy) / rect.height;
      const rx = (-dy) * 6; // rotateX
      const ry = (dx) * 8;  // rotateY
      holoCard.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const onLeave = ()=>{
      holoCard.style.transform = '';
    };

    // Enable only on wider screens
    const enableParallax = ()=>{
      if(window.innerWidth > 820){
        holoStage.addEventListener('mousemove', onMove);
        holoStage.addEventListener('mouseleave', onLeave);
      } else {
        holoStage.removeEventListener('mousemove', onMove);
        holoStage.removeEventListener('mouseleave', onLeave);
        holoCard.style.transform = '';
      }
    };

    window.addEventListener('resize', enableParallax);
    enableParallax();
  }

  // small perf improvement: reduce animations while not visible
  const pageVis = ()=>{
    if(document.hidden){
      document.documentElement.classList.add('reduced-animations');
    } else {
      document.documentElement.classList.remove('reduced-animations');
    }
  };
  document.addEventListener('visibilitychange', pageVis);

  // Smooth anchor scrolling fallback for older browsers
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

})();
