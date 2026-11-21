<!-- # Datheon Full Stack Web Development Internship

This repository contains my project work for the Datheon Full Stack Web Development Internship.
Each task lives in its own folder and this README describes all of them in one place.

**Author:** Qurat ul Ain, BS IT, University of the Punjab

## Tasks Overview

| # | Task | Folder | Status | Live Demo |
|---|------|--------|--------|-----------|
| 1 | Personal Developer Portfolio & Project Showcase | [`Portfolio_Task1`](./Portfolio_Task1) | Completed | [View site](https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Portfolio_Task1/) |
| 2 | To be added | | Planned | |
| 3 | To be added | | Planned | |

## Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── README.md
└── Portfolio_Task1/
    ├── index.html
    ├── style.css
    ├── script.js
    └── resume.pdf
```

---

## Task 1: Personal Developer Portfolio & Project Showcase

### Problem Statement

Design and deploy a responsive, modern developer portfolio website that showcases technical projects,
resume credentials, tech stack skills and contact links. The site must use a mobile-first responsive
layout (Flexbox / CSS Grid), a dark/light theme toggle and smooth scrolling navigation, and be hosted live.

### What I Built

- Semantic HTML5 structure: Header, Hero, About Me, Skills, Featured Projects, Contact
- Mobile-first responsive layout using Flexbox and CSS Grid
- Dark / light theme toggle that remembers the visitor's choice and respects the system preference
- Mobile hamburger menu
- Project cards generated from a simple list in `script.js`, with detail popups (modals) and a
  "Your Next Project" placeholder, so adding a new project needs no HTML changes
- Smooth scrolling navigation
- Contact section with clickable Email, LinkedIn and GitHub icons
- Downloadable resume

### Tech Stack

HTML5, CSS3, JavaScript (ES6+), deployed on GitHub Pages

### Deployment

Deployed with GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

Live site: https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Portfolio_Task1/

---

## Task 2

To be added.

## Task 3

To be added. -->

# Datheon Full Stack Web Development Internship

This repository contains my project work for the Datheon Full Stack Web Development Internship.
Each task lives in its own folder, and this README describes all of them in one place.

**Author:** Qurat ul Ain, BS IT, University of the Punjab

## Tasks Overview

| # | Task | Folder | Status | Live Demo |
|---|------|--------|--------|-----------|
| 1 | Personal Developer Portfolio & Project Showcase | [`Portfolio_Task1`](./Portfolio_Task1) | Completed | [View site](https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Portfolio_Task1/) |
| 2 | Dynamic Task Manager & Productivity Tracker (CRUD) | [`Task_Manager_Task2`](./Task_Manager_Task2) | Completed | [View app](https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Task_Manager_Task2/) |
| 3 | To be added | | Planned | |

## Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── README.md
├── Portfolio_Task1/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── resume.pdf
└── Task_Manager_Task2/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## Task 1: Personal Developer Portfolio & Project Showcase

### Problem Statement

Design and deploy a responsive, modern developer portfolio website that showcases technical projects,
resume credentials, tech stack skills and contact links. The site must use a mobile-first responsive
layout (Flexbox / CSS Grid), a dark/light theme toggle and smooth scrolling navigation, and be hosted live.

### What I Built

- Semantic HTML5 structure: Header, Hero, About Me, Skills, Featured Projects, Contact
- Mobile-first responsive layout using Flexbox and CSS Grid
- Dark / light theme toggle that remembers the visitor's choice and respects the system preference
- Mobile hamburger menu
- Project cards generated from a simple list in `script.js`, with detail popups (modals) and a
  "Add a new project" card that opens a form
- Smooth scrolling navigation
- Contact section with clickable Email, LinkedIn and GitHub icons
- Downloadable resume

### Tech Stack

HTML5, CSS3, JavaScript (ES6+), deployed on GitHub Pages

### Deployment

Deployed with GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).

Live site: https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Portfolio_Task1/

---

## Task 2: Dynamic Task Manager & Productivity Tracker (CRUD)

### Problem Statement

Build an interactive task management application with browser localStorage persistence. It must support
full CRUD operations (Create, Read, Update, Delete), task categories (Work, Personal, Study), due dates,
marking tasks complete and filtering by status (All, Active, Completed). Data must survive page reloads.

### What I Built

- **Create:** add tasks with a category and an optional due date
- **Read:** task list with category badges, due dates, "overdue" and "due today" highlighting, and a live "tasks left" counter
- **Update:** edit a task's text, category and due date inline (Enter to save, Esc to cancel), and mark tasks complete or active
- **Delete:** remove a single task, or clear all completed tasks at once
- **Filters:** All / Active / Completed, plus a category filter
- **Search:** quick search filtering by task text
- **Reordering:** drag-and-drop with a drag handle, plus up/down buttons for touch screens and keyboard users
- **Animations:** slide-in for new tasks, animated strike-through and pop on completion, fade-out on delete (CSS transitions)
- **Persistence:** all tasks are saved to localStorage through `saveToLocalStorage()` and `loadFromLocalStorage()`, with validation of stored data
- Responsive layout, dark/light theme toggle, zero server dependencies
- Task text is inserted with `textContent`, so user input is never interpreted as HTML

### Tech Stack

JavaScript (ES6+), DOM manipulation, localStorage API, CSS transitions, HTML5 drag-and-drop

### Deployment

Deployed with the same GitHub Pages site as Task 1.

Live app: https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Task_Manager_Task2/

---

## Task 3

To be added.