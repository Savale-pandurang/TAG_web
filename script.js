/* ── PARTICLE SYSTEM ── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    // draw connections
    for (let j = i + 1; j < particles.length; j++) {
      const dx = p.x - particles[j].x;
      const dy = p.y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── NAVBAR SCROLL ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── HAMBURGER MENU ── */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ANIMATED COUNTERS ── */
function animateCounter(element, target, duration = 2000, isYears = false) {
  if (!element) return;
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = formatNumber(target, isYears);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(start), isYears);
    }
  }, 16);
}

function formatNumber(num, isYears = false) {
  if (isYears) return num.toFixed(1) + '+';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M+';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
  return num.toString();
}

/* ── SCROLL REVEAL + COUNTER TRIGGER ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.querySelector('#stat-subscribers'), 7600000);
      animateCounter(document.querySelector('#stat-views'), 747000000);
      animateCounter(document.querySelector('#stat-years'), 6, 2000, true);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('#stats');
if (statsSection) statsObserver.observe(statsSection);

/* ── HERO TYPING EFFECT ── */
const heroLines = document.querySelectorAll('.hero-content h1 .type-line');
heroLines.forEach((line, i) => {
  const text = line.textContent;
  line.textContent = '';
  line.style.borderRight = '2px solid var(--gold)';
  let charIndex = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      line.textContent += text[charIndex];
      charIndex++;
      if (charIndex >= text.length) {
        clearInterval(interval);
        line.style.borderRight = 'none';
      }
    }, 50);
  }, i * 1200);
});

/* ── NOTIFY FORM ── */
const notifyForm = document.getElementById('notify-form');
if (notifyForm) {
  notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = notifyForm.querySelector('input');
    if (input.value) {
      const btn = notifyForm.querySelector('button');
      btn.textContent = '✓ NOTIFIED!';
      btn.style.background = '#22c55e';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'NOTIFY ME';
        btn.style.background = '';
      }, 3000);
    }
  });
}

/* ── SMOOTH SCROLL FOR CTA ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── TILT EFFECT ON PLAYER CARDS ── */
document.querySelectorAll('.player-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
