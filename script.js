/* ═══════════════════════════════════════════
   PORTFOLIO — script.js
   Interactions | Terminal Mode | Animations
═══════════════════════════════════════════ */

"use strict";

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveSection();
}, { passive: true });

// ── Highlight active nav link on scroll ──
function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ── Mobile hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
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

// ── Project filtering ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn 0.35s ease';
      }
    });
  });
});

// ── Case Study Modal ──
function openCaseStudy(id) {
  // Close any open modal first
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  const modal = document.getElementById('case-study-' + id);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}
function closeCaseStudy() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCaseStudy();
});
// Expose to HTML
window.openCaseStudy = openCaseStudy;
window.closeCaseStudy = closeCaseStudy;

// ── Contact form (Functional via Formspree/AJAX) ──
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  // Linked to your specific Formspree ID
  const formSpreeId = "xreawdwl";
  const endpoint = `https://formspree.io/f/${formSpreeId}`;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = new FormData(form);

  fetch(endpoint, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      form.reset();
      successMsg.textContent = "✅ Message sent! I'll get back to you soon.";
      successMsg.classList.remove('hidden');
      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          alert(data["errors"].map(error => error["message"]).join(", "));
        } else {
          alert("Oops! There was a problem submitting your form");
        }
      })
    }
  }).catch(error => {
    alert("Oops! There was a problem submitting your form");
  }).finally(() => {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  });
}
window.handleFormSubmit = handleFormSubmit;

// ── Scroll-reveal animations ──
const observer = new IntersectionObserver(
  (entries) => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.featured-project, .other-card, .blog-card, .skill-group, .stat-card, .contact-card, .cb-card')
  .forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });

document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

// ── Typed name animation ──
const nameEl = document.getElementById('typed-name');
if (nameEl) {
  const name = nameEl.textContent;
  nameEl.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  nameEl.appendChild(cursor);
  const type = () => {
    if (i < name.length) {
      nameEl.insertBefore(document.createTextNode(name[i++]), cursor);
      setTimeout(type, 110 + Math.random() * 60);
    } else {
      setTimeout(() => cursor.remove(), 1200);
    }
  };
  setTimeout(type, 600);
}

/* ═══════════════════════════════════════════
   TERMINAL MODE
═══════════════════════════════════════════ */
const terminalToggle = document.getElementById('terminal-toggle');
const terminalClose = document.getElementById('terminal-close');
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const typedCmd = document.getElementById('t-cmd-1');

const TERMINAL_COMMANDS = {
  help: () => [
    { text: 'Available commands:', cls: 'highlight' },
    { text: '  whoami        → About me' },
    { text: '  skills        → List my tech stack' },
    { text: '  projects      → List my projects' },
    { text: '  contact       → Get in touch' },
    { text: '  building      → What I\'m working on' },
    { text: '  clear         → Clear terminal' },
    { text: '  exit          → Close terminal' },
  ],
  whoami: () => [
    { text: 'Aritra Mandal — CS Engineering Student', cls: 'highlight' },
    { text: 'Building AI-powered products and viral web apps.' },
    { text: 'Obsessed with: ML systems, clean UI, scalable architecture.' },
    { text: 'Status: actively looking for internships.', cls: 'success' },
  ],
  skills: () => [
    { text: 'Languages:  Python, C++, Java, JavaScript', cls: 'highlight' },
    { text: 'Frontend:   React, HTML/CSS, Tailwind, Figma' },
    { text: 'Backend:    Node.js, Express, REST APIs, SQL' },
    { text: 'AI/ML:      Scikit-learn, TensorFlow, Pandas, SVD' },
    { text: 'Tools:      Git, GitHub, Docker, VS Code, Vercel' },
  ],
  projects: () => [
    { text: '1. CineMatch — ML Movie Recommender    [AI]', cls: 'highlight' },
    { text: '   → Hybrid SVD + content-based, 3× CTR improvement' },
    { text: '2. AI Task Simplifier                  [AI]', cls: 'highlight' },
    { text: '   → LLM-powered task breakdown via Groq API' },
    { text: '3. Hackathon UI System                 [WEB]', cls: 'highlight' },
    { text: '   → Full design system in 24h' },
    { text: '4. Network Supernetting Visualizer     [SYSTEMS]', cls: 'highlight' },
    { text: '   → Interactive CIDR/IP visualization' },
  ],
  contact: () => [
    { text: 'Best ways to reach me:', cls: 'highlight' },
    { text: '  Email:    eraritramandal@gmail.com' },
    { text: '  GitHub:   github.com/NoxShadow17' },
  ],
  building: () => [
    { text: '🔴 Currently building:', cls: 'highlight' },
    { text: '  → LLM-based dev tools', cls: 'success' },
    { text: '  → Virality-engineered web apps', cls: 'success' },
    { text: '  → AI + generative UI experiments', cls: 'success' },
  ],
  clear: () => { terminalOutput.innerHTML = ''; return []; },
  exit: () => { closeTerminal(); return []; },
};

function openTerminal() {
  terminalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  // Type a greeting command
  typeTerminalGreeting();
  setTimeout(() => terminalInput.focus(), 300);
}

function closeTerminal() {
  terminalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  // Reset
  typedCmd.textContent = '';
  terminalOutput.innerHTML = '';
}

function typeTerminalGreeting() {
  const greeting = 'help';
  let i = 0;
  typedCmd.textContent = '';
  const type = () => {
    if (i < greeting.length) {
      typedCmd.textContent += greeting[i++];
      setTimeout(type, 80);
    } else {
      setTimeout(() => runTerminalCommand('help'), 400);
    }
  };
  setTimeout(type, 400);
}

function addOutputLines(lines) {
  lines.forEach(({ text, cls }) => {
    const div = document.createElement('div');
    div.className = 'terminal-output-line' + (cls ? ` ${cls}` : '');
    div.textContent = text;
    terminalOutput.appendChild(div);
  });
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runTerminalCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase();
  // Echo the command
  if (trimmed && trimmed !== 'help' || (trimmed === 'help' && terminalOutput.children.length > 0)) {
    const echo = document.createElement('div');
    echo.className = 'terminal-line';
    echo.innerHTML = `<span class="prompt">$ </span><span>${trimmed}</span>`;
    terminalOutput.appendChild(echo);
  }
  if (!trimmed) { terminalBody.scrollTop = terminalBody.scrollHeight; return; }
  const fn = TERMINAL_COMMANDS[trimmed];
  if (fn) {
    const result = fn();
    if (result && result.length) addOutputLines(result);
  } else {
    addOutputLines([{ text: `command not found: ${trimmed}. Type 'help' for available commands.`, cls: 'error' }]);
  }
}

terminalInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = terminalInput.value;
    runTerminalCommand(val);
    terminalInput.value = '';
  }
});

terminalToggle.addEventListener('click', openTerminal);
terminalClose.addEventListener('click', closeTerminal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !terminalOverlay.classList.contains('hidden')) {
    closeTerminal();
  }
});
