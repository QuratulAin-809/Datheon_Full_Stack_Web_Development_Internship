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

// Project modal
// Edit this object with your own project details and links.
const projects = {
  smartreview: {
    title: "SmartReview",
    desc:
      "A web-based sentiment analysis platform for Pakistani beauty product reviews. " +
      "I built the FastAPI backend, the web scraping pipeline and the system integration " +
      "that connects the data, model and web interface.",
    tags: ["FastAPI", "Web Scraping", "Sentiment Analysis", "Python"],
    links: [] // source is private; add a demo link here if you have one
  },
  project2: {
    title: "Project Two",
    desc: "Replace this with a description of another project: the problem, what you built and what you learned.",
    tags: ["Python", "API"],
    links: [{ label: "GitHub", url: "https://github.com/your-username/project-two" }]
  },
  portfolio: {
    title: "This Portfolio",
    desc:
      "A responsive developer portfolio with a dark/light theme toggle, mobile menu, " +
      "smooth scrolling and project popups, built with plain HTML, CSS and JavaScript.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    links: [{ label: "Source Code", url: "https://github.com/your-username/portfolio" }]
  }
};

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalTags = document.getElementById("modal-tags");
const modalLinks = document.getElementById("modal-links");
const modalClose = document.getElementById("modal-close");
let lastFocused = null;

function openModal(key) {
  const p = projects[key];
  if (!p) return;

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

document.querySelectorAll("[data-project]").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.project));
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// Footer year 
document.getElementById("year").textContent = new Date().getFullYear();