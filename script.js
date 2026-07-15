document.addEventListener("DOMContentLoaded", () => {
  initClock();
  loadPortfolioData();
  initContactForm();
});

// Real-time taskbar clock
function initClock() {
  const clockElement = document.getElementById("clock");
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
  };
  updateClock();
  setInterval(updateClock, 1000);
}

// Local Fallback Data (Works instantly on double-click!)
const fallbackData = {
  profile: {
    name: "Kaizer David",
    tagline: "Senior Web Developer & Designer",
    about: "I am a multidisciplinary Senior Web Developer and Designer dedicated to crafting fast, accessible, and visually striking digital experiences. Bridging the gap between robust engineering and pixel-perfect design, I specialize in building scalable web applications. Currently, I am expanding my expertise in advanced cloud architecture and responsive design systems."
  },
  projects: [
    {
      title: "RPSc Game",
      description: "An interactive Rock-Paper-Scissors game featuring custom algorithmic opponent logic, local session score tracking, and a responsive arcade-inspired interface."
    },
    {
      title: "Weather Forecast",
      description: "A dynamic weather portal that queries external REST APIs to parse and display real-time meteorological data, regional conditions, and multi-day climate projections."
    },
    {
      title: "Chat Server",
      description: "A real-time, multi-user messaging system leveraging persistent WebSocket connections for instant communication channels and active user state updates."
    }
  ],
  skills: [
    "HTML5 / CSS3 / Semantic Markup",
    "JavaScript (ES6+) / Modern Frameworks",
    "UI/UX Design Systems & Wireframing",
    "Responsive Web Architecture & Accessibility"
  ]
};

// Dynamic content renderer (Checks data.json first, then falls back to local object)
async function loadPortfolioData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Could not fetch data.json");
    
    const data = await response.json();
    console.log("Loaded data from data.json successfully!");
    renderUI(data);
  } catch (error) {
    console.warn("CORS/Fetch error detected. Loading built-in portfolio data instead.");
    renderUI(fallbackData);
  }
}

function renderUI(data) {
  renderProfile(data.profile);
  renderProjects(data.projects);
  renderSkills(data.skills);
}

function renderProfile(profile) {
  document.title = `${profile.name} | Portfolio`;
  document.getElementById("window-title").textContent = `${profile.name} - portfolio.exe`;
  document.getElementById("taskbar-item-title").textContent = `${profile.name}`;
  document.getElementById("dev-name").textContent = profile.name;
  document.getElementById("dev-tagline").textContent = profile.tagline;
  document.getElementById("about-text").textContent = profile.about;
  document.getElementById("footer-copyright").innerHTML = `&copy; 2026 ${profile.name.toLowerCase().replace(" ", "_")}. Built with Love, Blood, Sweat &amp; Tears`;
}

function renderProjects(projects) {
  const gridContainer = document.getElementById("portfolio-grid");
  gridContainer.innerHTML = "";
  projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    `;
    gridContainer.appendChild(card);
  });
}

function renderSkills(skills) {
  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = "";
  skills.forEach(skill => {
    const listItem = document.createElement("li");
    listItem.textContent = skill;
    skillsList.appendChild(listItem);
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    alert(`Thank you, ${formData.get("name")}! Your message has been sent successfully.`);
    form.reset();
  });
}