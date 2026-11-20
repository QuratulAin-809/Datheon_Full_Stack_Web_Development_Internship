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

// Projects 
const projects = [
  {
    title: "SmartReview",
    summary: "Sentiment analysis platform for Pakistani beauty product reviews.",
    desc:
      "A web-based sentiment analysis platform for Pakistani beauty product reviews. " +
      "I built the FastAPI backend, the web scraping pipeline and the system integration " +
      "that connects the data, model and web interface.",
    tags: ["FastAPI", "Web Scraping", "Sentiment Analysis", "Python"],
    links: [] 
  },
  {
    title: "This Portfolio",
    summary: "Responsive portfolio with theme toggle, built with HTML, CSS and JavaScript.",
    desc:
      "A responsive developer portfolio with a dark/light theme toggle, mobile menu, " +
      "smooth scrolling and project popups, built with plain HTML, CSS and JavaScript " +
      "and deployed on GitHub Pages.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    links: [
      {
        label: "Source Code",
        url: "https://github.com/QuratulAin-809/Datheon_Full_Stack_Web_Development_Internship/tree/main/Portfolio_Task1"
      }
    ]
  }
];

// Projects added through the "Add a new project" form.
// They are saved in this browser only (localStorage), not for other visitors.
const STORAGE_KEY = "customProjects";

function isSafeUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch (e) {
    return false;
  }
}

function loadCustom() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data.filter(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.title === "string" &&
        typeof p.summary === "string" &&
        typeof p.desc === "string" &&
        Array.isArray(p.tags) &&
        Array.isArray(p.links)
    );
  } catch (e) {
    return [];
  }
}

function saveCustom() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects));
  } catch (e) {}
}

let customProjects = loadCustom();

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

function buildCard(p) {
  const card = document.createElement("article");
  card.className = "card project-card";

  const h3 = document.createElement("h3");
  h3.textContent = p.title;

  const para = document.createElement("p");
  para.textContent = p.summary;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-small";
  btn.textContent = "Details";
  btn.addEventListener("click", () => openModal(p));

  card.append(h3, para, buildTags(p.tags), btn);
  return card;
}

function buildPlaceholder() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card project-card placeholder";
  btn.setAttribute("aria-label", "Add a new project");

  const plus = document.createElement("span");
  plus.className = "placeholder-plus";
  plus.setAttribute("aria-hidden", "true");
  plus.textContent = "+";

  const title = document.createElement("span");
  title.className = "placeholder-title";
  title.textContent = "Add a new project";

  const text = document.createElement("span");
  text.className = "placeholder-text";
  text.textContent = "Click to add your next project.";

  btn.append(plus, title, text);
  btn.addEventListener("click", openAddModal);
  return btn;
}

function renderProjects() {
  grid.innerHTML = "";
  projects.forEach((p) => grid.appendChild(buildCard(p)));
  customProjects.forEach((p) => grid.appendChild(buildCard(p)));
  grid.appendChild(buildPlaceholder());
}

// Project details modal 
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
  p.links
    .filter((l) => isSafeUrl(l.url))
    .forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url;
      a.textContent = l.label;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "btn btn-small";
      modalLinks.appendChild(a);
    });

  // Projects added through the form can be removed again
  if (customProjects.some((c) => c.id === p.id)) {
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "btn btn-small btn-danger";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      customProjects = customProjects.filter((c) => c.id !== p.id);
      saveCustom();
      closeModal();
      renderProjects();
    });
    modalLinks.appendChild(rm);
  }

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

// Add project modal 
const addModal = document.getElementById("add-modal");
const addForm = document.getElementById("add-form");
const addClose = document.getElementById("add-close");
const urlInput = addForm.elements["url"];

function openAddModal() {
  lastFocused = document.activeElement;
  addModal.hidden = false;
  document.body.style.overflow = "hidden";
  addForm.elements["title"].focus();
}

function closeAddModal() {
  addModal.hidden = true;
  document.body.style.overflow = "";
  addForm.reset();
  urlInput.setCustomValidity("");
  if (lastFocused) lastFocused.focus();
}

urlInput.addEventListener("input", () => urlInput.setCustomValidity(""));

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(addForm);
  const url = String(data.get("url") || "").trim();

  if (url && !isSafeUrl(url)) {
    urlInput.setCustomValidity("Please enter a link starting with http:// or https://");
    urlInput.reportValidity();
    return;
  }

  const tags = String(data.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  customProjects.push({
    id: Date.now().toString(36),
    title: String(data.get("title")).trim(),
    summary: String(data.get("summary")).trim(),
    desc: String(data.get("desc")).trim(),
    tags: tags,
    links: url ? [{ label: "Project Link", url: url }] : []
  });

  saveCustom();
  closeAddModal();
  renderProjects();
});

addClose.addEventListener("click", closeAddModal);
addModal.addEventListener("click", (e) => {
  if (e.target === addModal) closeAddModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!modal.hidden) closeModal();
  if (!addModal.hidden) closeAddModal();
});

renderProjects();

// Footer year 
document.getElementById("year").textContent = new Date().getFullYear();