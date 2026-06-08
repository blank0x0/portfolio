/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Typewriter effect ── */
const words = ['web apps.', 'APIs.', 'clean code.', 'fast UIs.', 'cool things.'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const word = words[wi];
  tw.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  let delay = deleting ? 60 : 100;
  if (!deleting && ci === word.length + 1) { delay = 1800; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
  setTimeout(type, delay);
}
setTimeout(type, 1400);

/* ── Particle canvas ── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${this.a})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 80 }, () => new Particle());
}
initParticles();

let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - d / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
    if (mouse.x) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(168,85,247,${0.25 * (1 - d / 160)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(loop);
}
loop();

/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

/* ── Skill bars ── */
function buildSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const track = document.createElement('div');
    track.className = 'skill-bar-track';
    const fill = document.createElement('div');
    fill.className = 'skill-bar-fill';
    track.appendChild(fill);
    bar.appendChild(track);
  });
}
buildSkillBars();

const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
        setTimeout(() => {
          bar.querySelector('.skill-bar-fill').style.width = bar.dataset.pct + '%';
        }, i * 120);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(c => skillObs.observe(c));

/* ── Counter animation ── */
function animateCounter(el, target) {
  let current = 0;
  const step  = target / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 40);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, +el.dataset.target);
      });
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.about-stats');
if (statsEl) statObs.observe(statsEl);

/* ── Contact form ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn  = e.target.querySelector('button');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Sent!</span>';
  btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 3000);
});
