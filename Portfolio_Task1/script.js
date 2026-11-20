// Theme toggle 
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null;
  }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// Mobile hamburger menu 
const menuBtn = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  });
});

//  Projects 
// To add a new project, copy one of the entries below, paste it at the end of
// the list (before the closing bracket) and change the details.
// The card appears automatically, and the "new project" placeholder moves after it.
const projects = [
  {
    title: "SmartReview",
    summary: "Sentiment analysis platform for Pakistani beauty product reviews.",
    desc:
      "A web-based sentiment analysis platform for Pakistani beauty product reviews. " +
      "I built the FastAPI backend, the web scraping pipeline and the system integration " +
      "that connects the data, model and web interface.",
    tags: ["FastAPI", "Web Scraping", "Sentiment Analysis", "Python"],
    links: [] // source is private; add a demo link here if you have one
  },
  {
    title: "This Portfolio",
    summary: "Responsive portfolio with theme toggle, built with HTML, CSS and JavaScript.",
    desc:
      "A responsive developer portfolio with a dark/light theme toggle, mobile menu, " +
      "smooth scrolling and project popups, built with plain HTML, CSS and JavaScript " +
      "and deployed on GitHub Pages.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    links: [{ label: "Source Code", url: "https://github.com/QuratulAin-809/Portfolio_Task1" }]
  }
  // , {
  //   title: "Your New Project",
  //   summary: "One-line description shown on the card.",
  //   desc: "Longer description shown in the popup: the problem, what you built, what you learned.",
  //   tags: ["Python", "PostgreSQL"],
  //   links: [{ label: "GitHub", url: "https://github.com/your-username/your-repo" }]
  // }
];

const grid = document.getElementById("projects-grid");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalTags = document.getElementById("modal-tags");
const modalLinks = document.getElementById("modal-links");
const modalClose = document.getElementById("modal-close");
let lastFocused = null;

function buildTags(list) {
  const ul = document.createElement("ul");
  ul.className = "tags";
  list.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
  return ul;
}

function renderProjects() {
  projects.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card project-card";

    const h3 = document.createElement("h3");
    h3.textContent = p.title;

    const para = document.createElement("p");
    para.textContent = p.summary;

    const btn = document.createElement("button");
    btn.className = "btn btn-small";
    btn.textContent = "Details";
    btn.addEventListener("click", () => openModal(p));

    card.append(h3, para, buildTags(p.tags), btn);
    grid.appendChild(card);
  });

  // Placeholder card for the next project
  const ph = document.createElement("article");
  ph.className = "card project-card placeholder";
  ph.innerHTML =
    '<div class="placeholder-plus" aria-hidden="true">+</div>' +
    "<h3>Your Next Project</h3>" +
    "<p>New projects will appear here.</p>";
  grid.appendChild(ph);
}

// Project modal 
function openModal(p) {
  lastFocused = document.activeElement;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;

  modalTags.innerHTML = "";
  p.tags.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    modalTags.appendChild(li);
  });

  modalLinks.innerHTML = "";
  p.links.forEach((l) => {
    const a = document.createElement("a");
    a.href = l.url;
    a.textContent = l.label;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "btn btn-small";
    modalLinks.appendChild(a);
  });

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

renderProjects();

// Footer year 
document.getElementById("year").textContent = new Date().getFullYear();