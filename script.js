// Fallback data, used only if data.json can't be fetched
// (e.g. opening index.html directly via file:// without a local server)
const FALLBACK_DATA = {
  "profile": {
    "name": "Jhared Andrei",
    "handle": "jharedandrei_",
    "age": 20,
    "role": "Student / Builder",
    "email": "jharedandrei.tadifa@lorma.edu",
    "phone": "0956 709 7681",
    "tagline": "I turn ideas into things that run.",
    "bio": "20-year-old student who learns by shipping. I like taking a concept apart until I understand it, then rebuilding it as something that actually works — a game, a live data feed, a server that keeps a conversation alive in real time. Still early, still curious, still up too late debugging."
  },
  "skills": [
    { "name": "JavaScript", "note": "core logic, DOM, async flows" },
    { "name": "HTML & CSS", "note": "structure, layout, responsive UI" },
    { "name": "REST APIs", "note": "fetching & parsing live data" },
    { "name": "WebSockets", "note": "real-time, persistent connections" },
    { "name": "Algorithms", "note": "game logic, decision systems" },
    { "name": "Git", "note": "version control, workflow" },
    { "name": "UI/UX Basics", "note": "usable, readable interfaces" }
  ],
  "projects": [
    {
      "id": "rpsc", "index": "01", "name": "RPSc Game",
      "command": "./run rpsc --mode=arcade",
      "description": "An interactive Rock-Paper-Scissors game featuring custom algorithmic opponent logic, local session score tracking, and a responsive arcade-inspired interface.",
      "stack": ["JavaScript", "HTML", "CSS", "Local Storage"],
      "status": "stable"
    },
    {
      "id": "weather", "index": "02", "name": "Weather Forecast",
      "command": "curl weather.forecast --live",
      "description": "A dynamic weather portal that queries external REST APIs to parse and display real-time meteorological data, regional conditions, and multi-day climate projections.",
      "stack": ["JavaScript", "REST API", "Fetch API", "CSS"],
      "status": "stable"
    },
    {
      "id": "chat", "index": "03", "name": "Chat Server",
      "command": "node server.js --socket",
      "description": "A real-time, multi-user messaging system leveraging persistent WebSocket connections for instant communication channels and active user state updates.",
      "stack": ["Node.js", "WebSocket", "JavaScript"],
      "status": "active"
    }
  ],
  "footer": { "year": "2026", "line": "Built with Blood, Sweat, and Tears." }
};

async function loadData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('bad response');
    return await res.json();
  } catch (e) {
    return FALLBACK_DATA;
  }
}

function typeLine(el, text, speed = 18) {
  return new Promise((resolve) => {
    let i = 0;
    const span = document.createElement('span');
    el.appendChild(span);
    const interval = setInterval(() => {
      span.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function runBootSequence(profile) {
  const boot = document.getElementById('bootLines');
  const lines = [
    { text: `$ whoami`, cls: 'prompt' },
    { text: `${profile.name.toLowerCase().replace(' ', '_')} — ${profile.role.toLowerCase()}`, cls: 'ok' },
    { text: `$ status --check`, cls: 'prompt' },
    { text: `[ok] ${profile.age} y/o · currently building`, cls: 'ok final' }
  ];

  for (const line of lines) {
    const p = document.createElement('p');
    p.className = 'boot-line';
    boot.appendChild(p);
    const inner = document.createElement('span');
    inner.className = line.cls;
    p.appendChild(inner);
    await typeLine(inner, line.text, 14);
    await new Promise(r => setTimeout(r, 120));
  }
}

function populateAbout(profile) {
  document.getElementById('aboutBio').textContent = profile.bio;
  document.getElementById('aboutAge').textContent = `${profile.age} years old · ${profile.role}`;
  document.getElementById('heroTagline').innerHTML = `${profile.tagline} <span class="cyan">@${profile.handle}</span>`;
}

function populateSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = skills.map(s => `
    <li class="skill-item">
      <div class="skill-name">${escapeHtml(s.name)}</div>
      <div class="skill-note">${escapeHtml(s.note)}</div>
    </li>
  `).join('');
}

function populateProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = projects.map(p => `
    <article class="project-card">
      <div class="project-index">${escapeHtml(p.index)}</div>
      <div class="terminal-window">
        <div class="terminal-chrome">
          <span class="dot dot-red"></span><span class="dot dot-amber"></span><span class="dot dot-green"></span>
          <span class="terminal-title">${escapeHtml(p.id)}.sh</span>
          <span class="project-status">${escapeHtml(p.status)}</span>
        </div>
        <div class="terminal-body">
          <p class="prompt-line"><span class="prompt">$</span> ${escapeHtml(p.command)}</p>
          <h3 class="project-name">${escapeHtml(p.name)}</h3>
          <p class="project-desc">${escapeHtml(p.description)}</p>
          <div class="project-stack">
            ${p.stack.map(t => `<span class="stack-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function populateContact(profile) {
  const list = document.getElementById('contactList');
  const items = [
    { label: 'email', value: profile.email, copy: profile.email },
    { label: 'phone', value: profile.phone, copy: profile.phone.replace(/\s/g, '') },
    { label: 'socials', value: `@${profile.handle}`, copy: `@${profile.handle}` }
  ];
  list.innerHTML = items.map((it, idx) => `
    <button class="contact-item" data-copy="${escapeHtml(it.copy)}" data-idx="${idx}">
      <span>
        <span class="contact-label">${escapeHtml(it.label)}</span>
        <span class="contact-value">${escapeHtml(it.value)}</span>
      </span>
      <span class="contact-copy">click to copy</span>
    </button>
  `).join('');

  list.querySelectorAll('.contact-item').forEach(btn => {
    btn.addEventListener('click', async () => {
      const copyEl = btn.querySelector('.contact-copy');
      const original = copyEl.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        copyEl.textContent = 'copied ✓';
        copyEl.classList.add('copied');
      } catch (e) {
        copyEl.textContent = 'select & copy';
      }
      setTimeout(() => {
        copyEl.textContent = original;
        copyEl.classList.remove('copied');
      }, 1600);
    });
  });
}

function populateFooter(footer) {
  document.getElementById('footerLine').textContent = `© ${footer.year} jhared_andrei. ${footer.line}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupNavToggle() {
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupScrollReveal() {
  const targets = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(24px)';
    t.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    io.observe(t);
  });
}

(async function init() {
  const data = await loadData();
  populateAbout(data.profile);
  populateSkills(data.skills);
  populateProjects(data.projects);
  populateContact(data.profile);
  populateFooter(data.footer);
  setupNavToggle();
  setupScrollReveal();
  runBootSequence(data.profile);
})();