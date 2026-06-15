/* ═══════════════════════════════════════════════════════════════
   TRI-WORLD PORTAL — Main JavaScript
   Theme switching · Particles · Parallax · Typewriter · Scroll
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── STATE ───────────────────────────────────────────────────────
let currentTheme = 'onepiece';
let particles = [];
let animFrame;
let scrollY = 0;

// ─── THEME CONFIG ────────────────────────────────────────────────
const THEMES = {
  onepiece: {
    name: 'Grand Line',
    roles: ['AI/ML Engineer', 'Full-Stack Developer', 'Data Scientist'],
    particleType: 'bubble',
    particleColor: '#F59E0B',
    particleCount: 55,
  },
  aot: {
    name: 'Survey Corps',
    roles: ['AI/ML Engineer', 'Full-Stack Developer', 'Data Scientist'],
    particleType: 'dust',
    particleColor: '#4D7C0F',
    particleCount: 40,
  },
  sakura: {
    name: 'Sakura Garden',
    roles: ['AI/ML Engineer', 'Full-Stack Developer', 'Data Scientist'],
    particleType: 'petal',
    particleColor: '#f472b6',
    particleCount: 65,
  }
};

// ─── DOM REFS ────────────────────────────────────────────────────
const body = document.body;
const overlay = document.getElementById('theme-overlay');
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const orbs = document.querySelectorAll('.theme-orb');
const minimapDots = document.querySelectorAll('.minimap-dot');
const sections = document.querySelectorAll('.section');
const panelContainers = document.querySelectorAll('.panel-container');
const expTabs = document.querySelectorAll('.exp-tab');
const expContents = document.querySelectorAll('.exp-content');
const bgSky = document.getElementById('bg-sky');
const bgMid = document.getElementById('bg-mid');

// ─── CANVAS RESIZE ───────────────────────────────────────────────
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ─── PARTICLE SYSTEM ─────────────────────────────────────────────
class Particle {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.reset(true);
  }

  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : canvas.height + 20;
    this.size = Math.random() * 6 + 2;
    this.speedY = -(Math.random() * 1.2 + 0.3);
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.7 + 0.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.03 + 0.01;
  }

  update() {
    this.y += this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.5;
    this.rotation += this.rotSpeed;
    if (this.type === 'petal') {
      this.speedY = -(Math.random() * 0.6 + 0.2);
    }
    if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'bubble') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = this.color + '22';
      ctx.fill();
    } else if (this.type === 'dust') {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.4);
    } else if (this.type === 'petal') {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 1.4, this.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color + 'cc';
      ctx.fill();
      // Petal vein
      ctx.beginPath();
      ctx.moveTo(-this.size * 1.2, 0);
      ctx.lineTo(this.size * 1.2, 0);
      ctx.strokeStyle = this.color + '66';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    ctx.restore();
  }
}

function initParticles() {
  const config = THEMES[currentTheme];
  particles = [];
  for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle(config.particleType, config.particleColor));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

// ─── THEME SWITCHING ─────────────────────────────────────────────
function switchTheme(newTheme) {
  if (newTheme === currentTheme) return;

  // Flash overlay
  overlay.style.background = newTheme === 'onepiece' ? '#0EA5E9'
    : newTheme === 'aot' ? '#4D7C0F'
    : '#f472b6';
  overlay.classList.add('flash');

  setTimeout(() => {
    // Swap classes
    body.classList.remove(`theme-${currentTheme}`);
    body.classList.add(`theme-${newTheme}`);
    body.setAttribute('data-theme', newTheme);
    currentTheme = newTheme;

    // Update orb active state
    orbs.forEach(o => {
      o.classList.toggle('active', o.dataset.theme === newTheme);
    });

    // Reinit particles
    cancelAnimationFrame(animFrame);
    initParticles();
    animateParticles();

    // Restart typewriter
    startTypewriter();

    overlay.classList.remove('flash');
  }, 280);
}

orbs.forEach(orb => {
  orb.addEventListener('click', () => switchTheme(orb.dataset.theme));
});

// ─── TYPEWRITER ───────────────────────────────────────────────────
let typewriterTimeout;
function startTypewriter() {
  const el = document.getElementById('typewriter');
  const roles = THEMES[currentTheme].roles;
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  clearTimeout(typewriterTimeout);
  el.textContent = '';

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        typewriterTimeout = setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typewriterTimeout = setTimeout(type, 300);
        return;
      }
    }
    typewriterTimeout = setTimeout(type, deleting ? 55 : 80);
  }
  type();
}

// ─── PARALLAX ────────────────────────────────────────────────────
function updateParallax() {
  // Background is position:fixed — stays completely still, no transform needed.
  // World elements keep their CSS keyframe animations; no JS scroll offset applied.
}

// ─── SCROLL REVEAL ───────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

panelContainers.forEach(el => revealObserver.observe(el));

// ─── MINIMAP / ACTIVE SECTION ────────────────────────────────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      minimapDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.target === id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

minimapDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── EXPERIENCE TABS ─────────────────────────────────────────────
expTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    expTabs.forEach(t => t.classList.remove('active'));
    expContents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(`exp-${tab.dataset.exp}`);
    if (target) target.classList.add('active');
  });
});

// ─── NAV SCROLL EFFECT ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  updateParallax();
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 32px rgba(0,0,0,0.3)'
    : 'none';
});

// ─── SMOOTH SCROLL NAV LINKS ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── 3D TILT ON CARDS ────────────────────────────────────────────
document.querySelectorAll('.project-card, .contact-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── KEYBOARD THEME SWITCHING ────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === '1') switchTheme('onepiece');
  if (e.key === '2') switchTheme('aot');
  if (e.key === '3') switchTheme('sakura');
});

// ─── PROJECT MODAL DATA ─────────────────────────────────────────
const PROJECTS = {
  codereview: {
    badge: '🤖 AI Tool · Course Project',
    title: 'AI Code Review Bot',
    period: 'April 2026 · Personal / Course Project',
    desc: 'A GitHub bot I built that automatically reviews pull requests and posts structured inline comments. It flags potential security issues, messy code patterns, and complexity hotspots — each with a severity score (low / medium / high / critical). I built this as a way to learn how to combine LLMs with real developer workflows.',
    highlights: [
      'Connects to GitHub via webhooks — triggers automatically when a PR is opened',
      'Uses LangChain + Anthropic API to analyze code diffs and generate structured review comments',
      'Severity scoring system with 4 levels to help prioritize what to fix first',
      'Packaged with Docker so it can be deployed anywhere easily',
      'Achieved ~87% agreement with manual code reviews in testing'
    ],
    tech: ['LangChain', 'GitHub API', 'FastAPI', 'Docker', 'React', 'Python', 'Anthropic API'],
    github: 'https://github.com/sahithi-muppavaram/ai-code-review-bot',
    demo: null
  },
  deepfake: {
    badge: '🎥 Computer Vision · Course Project',
    title: 'Multimodal Deepfake Detector',
    period: 'March 2026 · Course Project',
    desc: 'A deepfake detection system that looks at both video frames AND audio at the same time — because fakes often slip through when you only check one. I used EfficientNet for video frame analysis, librosa for audio spectrograms, and combined them into a single detection layer. Added Grad-CAM so you can visually see what the model is looking at.',
    highlights: [
    'Fuses video (EfficientNet) + audio (librosa spectrograms) + metadata for more reliable detection',
    'Extended to real time video streams and live calls via face tracking across frames, catching temporal inconsistencies beyond standard uploaded video analysis',
    'Grad-CAM and SHAP explainability across all modalities — highlights exactly what triggered each detection',
    'Confidence scoring with uncertainty estimation, tamper detection for video edits, and multilingual synthetic voice manipulation detection',
    'Automated forensic PDF report generation per video analyzed',
    'Async batch processing with Celery and Redis — 30+ videos/hour',
    '96% detection accuracy on test dataset'
  ],
    tech: ['PyTorch', 'EfficientNet', 'librosa', 'Celery', 'Redis', 'Python', 'OpenCV'],
    github: 'https://github.com/sahithi-muppavaram/multimodal-deepfake-detector',
    demo: null
  },
  llama: {
    badge: '🦙 LLM Fine-Tuning · Research Project',
    title: 'LLaMA DPO Fine-Tuning',
    period: 'Jan 2026 · Research / Course Project',
    desc: 'I fine-tuned LLaMA 3.2 using Direct Preference Optimization (DPO) — a technique that teaches the model to prefer better responses over worse ones. Used LoRA adapters to make training feasible on limited hardware. Generated 5 candidate completions per instruction and used pairwise ranking to build the preference dataset. Published the resulting model to HuggingFace.',
    highlights: [
      'Used LoRA adapters to fine-tune efficiently without needing massive GPU resources',
      'Built 2 custom preference datasets using pairwise ranking of model outputs',
      'Generated 5 candidate completions per instruction for comparison',
      'Trained with DPO loss to align model behavior with human preferences',
      'Published the fine-tuned model to HuggingFace Hub'
    ],
    tech: ['LLaMA 3.2', 'LoRA', 'QLoRA', 'DPO', 'HuggingFace', 'Python', 'PyTorch', 'PEFT'],
    demo: 'null'
  },
  smartcart: {
    badge: '🏆 IEEE Published · IIT Madras Winner',
    title: 'Smart Cart — IoT System',
    period: 'Dec 2023 · Won 1st Prize at IIT Madras TechFest · Published in IEEE',
    desc: 'An IoT-powered smart shopping cart that automatically bills items as you drop them in using RFID tags, and uses weight sensors to detect if something was added without scanning. Built this with a team and it won 1st Prize at IIT Madras TechFest — and we got it published in IEEE! It was one of my first hardware+software projects and I learned a ton.',
    highlights: [
      'RFID-based automatic item detection and billing — no manual scanning needed',
      'Weight sensors cross-check item additions to prevent theft',
      'Raspberry Pi as the central controller with a simple display UI',
      'Reduced checkout time by ~30% and theft incidents by ~25% in testing',
      '🏆 1st Prize — IIT Madras TechFest | Published in IEEE'
    ],
    tech: ['RFID', 'Python', 'Raspberry Pi', 'IoT', 'GPIO', 'SQLite'],
    github: 'https://github.com/sahithi-muppavaram/Smart-Cart-with-Automatic-Billing-and-Anti-theft',
    publication: 'https://ieeexplore.ieee.org/document/10401143'
  },
  meta: {
    badge: '📊 Big Data · Course Project',
    title: 'Meta Content Moderation Pipeline',
    period: 'April 2025 · Course Project (Big Data Systems)',
    desc: 'A course project where I designed (not deployed) a big data architecture for how a platform like Meta might handle content moderation at scale. The goal was to understand how to design systems that handle high volume, velocity, and variety of data — the 3Vs of big data. Used 6 different frameworks across the pipeline.',
    highlights: [
      'Kafka for real-time event streaming of user-generated content',
      'Apache Spark for distributed processing and ML-based moderation scoring',
      'Airflow for orchestrating the end-to-end pipeline with scheduling',
      'Cassandra for high-write, distributed storage of moderation results',
      'Neo4j for graph-based relationship analysis between accounts',
      'Tableau dashboards for analytics and monitoring'
    ],
    tech: ['Apache Kafka', 'Apache Spark', 'Airflow', 'Cassandra', 'Neo4j', 'Tableau', 'Python'],
    lucidchart: 'https://lucid.app/lucidspark/f032be0f-7c2b-4649-a37a-2abc324af0c8/edit?viewport_loc=-3590%2C-1129%2C7084%2C3188%2C0_0&invitationId=inv_3a2cee5e-94a8-480b-b16e-b209063fa908',
    demo: null
  },
  leco: {
    badge: '🐱 Chrome Extension · Personal Project',
    title: 'LECO — LeetCode AI Companion',
    period: 'June 2026 · Personal Project',
    desc: 'LECO is a Chrome extension I built that acts like a cat tutor sitting in the corner of LeetCode. When you get stuck on a problem, it gives you small Socratic hints that nudge you toward the answer — it will never just hand you the solution. The interesting part is that it is completely free for anyone to use, because I route the AI calls through a serverless proxy that holds the API key on the server side.',
    highlights: [
      '4 hint modes: Hints (Socratic nudges), Explain (reads your code back), Optimize (complexity tips), and Chat',
      'Serverless proxy keeps the API key off the client — completely free and keyless for all users',
      'Reads the LeetCode problem and your code live from the DOM using defensive CSS selectors',
      'MutationObserver detects when you pass test cases and triggers a cat celebration party 🎉',
      'Built with TypeScript + Chrome Manifest V3 + Vite/CRXJS — companion is a Lottie animation'
    ],
    tech: ['TypeScript', 'Chrome MV3', 'Vite', 'CRXJS', 'Serverless Proxy', 'Lottie', 'DOM Scraping'],
    github: 'https://github.com/sahithimuppavaram/leco',
    demo: null
  },
  eyeblink: {
    badge: '♿ Accessibility · IoT Project',
    title: 'Eye Blink Home Automation',
    period: 'Jan 2024 · Personal / Course Project',
    desc: 'A hands-free home automation system designed for people with mobility challenges. It uses a webcam and OpenCV to detect eye blinks in real time, and maps different blink patterns to appliance controls (like turning lights on/off). Built on Raspberry Pi with GPIO relays to actually control physical devices.',
    highlights: [
      'Uses Eye Aspect Ratio (EAR) algorithm via OpenCV to detect blinks accurately',
      '95% blink detection accuracy in varied lighting conditions',
      'Different blink patterns (single, double, long) mapped to different appliances',
      'Raspberry Pi + GPIO relays to physically control real appliances',
      'Designed specifically for people with paralysis or limited mobility'
    ],
    tech: ['OpenCV', 'Python', 'Raspberry Pi', 'GPIO', 'dlib', 'IoT'],
    github: 'https://github.com/sahithi-muppavaram/Home-Automation-Using-Eye-Blink-Detection-for-Paralyzed-People',
    publication: 'https://www.pnrjournal.com/index.php/home/article/view/10591'
  }
};

// ─── MODAL LOGIC ─────────────────────────────────────────────────
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');

function openModal(projectKey) {
  const p = PROJECTS[projectKey];
  if (!p) return;

  document.getElementById('modal-badge').textContent = p.badge;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-period').textContent = p.period;
  document.getElementById('modal-desc').textContent = p.desc;

  const hl = document.getElementById('modal-highlights');
  hl.innerHTML = '<h4>What I built / learned</h4><ul>' +
    p.highlights.map(h => `<li>${h}</li>`).join('') + '</ul>';

  const tech = document.getElementById('modal-tech');
  tech.innerHTML = p.tech.map(t => `<span class="tag">${t}</span>`).join('');

  const links = document.getElementById('modal-links');
  links.innerHTML = '';
  if (p.github) {
    links.innerHTML += `<a href="${p.github}" target="_blank" class="modal-link">⌥ GitHub Profile</a>`;
  }
  if (p.demo) {
    links.innerHTML += `<a href="${p.demo}" target="_blank" class="modal-link secondary">↗ View Demo / Model</a>`;
  }
  if (p.publication) {
    links.innerHTML += `<a href="${p.publication}" target="_blank" class="modal-link secondary">↗ View Publication / Model</a>`;
  }
  if (p.lucidchart) {
    links.innerHTML += `<a href="${p.lucidchart}" target="_blank" class="modal-link secondary">↗ View LucidChart / Model</a>`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.project); }
  });
});

// ─── ANIMATED WAVE CANVAS (One Piece ocean game feel) ────────────────
const waveCanvas = document.getElementById('wave-canvas');
const wCtx = waveCanvas ? waveCanvas.getContext('2d') : null;
let waveTime = 0;

function resizeWaveCanvas() {
  if (!waveCanvas) return;
  waveCanvas.width = waveCanvas.offsetWidth;
  waveCanvas.height = waveCanvas.offsetHeight;
}

function drawWaves() {
  if (!wCtx || !waveCanvas) return;
  const W = waveCanvas.width;
  const H = waveCanvas.height;
  wCtx.clearRect(0, 0, W, H);

  const waves = [
    { amp: 18, freq: 0.018, speed: 0.022, yBase: H * 0.28, color: 'rgba(14,165,233,0.35)', fill: 'rgba(14,165,233,0.12)' },
    { amp: 14, freq: 0.024, speed: 0.030, yBase: H * 0.42, color: 'rgba(56,189,248,0.30)', fill: 'rgba(56,189,248,0.10)' },
    { amp: 10, freq: 0.032, speed: 0.040, yBase: H * 0.58, color: 'rgba(186,230,253,0.25)', fill: 'rgba(186,230,253,0.08)' },
    { amp: 7,  freq: 0.042, speed: 0.055, yBase: H * 0.72, color: 'rgba(255,255,255,0.20)', fill: 'rgba(255,255,255,0.06)' },
  ];

  waves.forEach(w => {
    wCtx.beginPath();
    wCtx.moveTo(0, H);
    for (let x = 0; x <= W; x += 3) {
      const y = w.yBase + Math.sin(x * w.freq + waveTime * w.speed * 60) * w.amp
                        + Math.sin(x * w.freq * 1.7 + waveTime * w.speed * 40) * (w.amp * 0.4);
      wCtx.lineTo(x, y);
    }
    wCtx.lineTo(W, H);
    wCtx.closePath();
    wCtx.fillStyle = w.fill;
    wCtx.fill();
    wCtx.strokeStyle = w.color;
    wCtx.lineWidth = 1.5;
    wCtx.stroke();
  });

  // Foam sparkles
  if (Math.random() < 0.08) {
    const fx = Math.random() * W;
    const fy = H * (0.25 + Math.random() * 0.5);
    wCtx.beginPath();
    wCtx.arc(fx, fy, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
    wCtx.fillStyle = 'rgba(255,255,255,0.6)';
    wCtx.fill();
  }

  waveTime += 0.016;
  requestAnimationFrame(drawWaves);
}

window.addEventListener('resize', resizeWaveCanvas);

// ─── INIT ────────────────────────────────────────────────
function init() {
  initParticles();
  animateParticles();
  startTypewriter();
  // Start wave animation for One Piece ocean feel
  resizeWaveCanvas();
  drawWaves();
  // Trigger hero panel visibility immediately
  document.querySelector('#hero .hero-content') && (
    document.querySelector('#hero .hero-content').style.opacity = '1'
  );
}

document.addEventListener('DOMContentLoaded', init);
