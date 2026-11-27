# Datheon Full Stack Web Development Internship

This repository contains my project work for the Datheon Full Stack Web Development Internship.
Each task lives in its own folder, and this README describes all of them in one place.

**Author:** Qurat ul Ain, BS IT, University of the Punjab

## Tasks Overview

| # | Task | Folder | Status | Live Demo |
|---|------|--------|--------|-----------|
| 1 | Personal Developer Portfolio & Project Showcase | [`Portfolio_Task1`](./Portfolio_Task1) | Completed | [View site](https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Portfolio_Task1/) |
| 2 | Dynamic Task Manager & Productivity Tracker (CRUD) | [`Task_Manager_Task2`](./Task_Manager_Task2) | Completed | [View app](https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/Task_Manager_Task2/) |
| 4 | E-Commerce Product Catalog & Interactive Shopping Cart | [`E_Commerce_Store_Task4`](./E_Commerce_Store_Task4) | Completed | [View store](https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/E_Commerce_Store_Task4/) |

## Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── README.md
├── Portfolio_Task1/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── resume.pdf
├── Task_Manager_Task2/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── E_Commerce_Store_Task4/
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

## Task 4: E-Commerce Product Catalog & Interactive Shopping Cart

### Problem Statement

Construct a modern e-commerce storefront. Fetch product data from FakeStoreAPI, render product cards with
ratings, prices and badges, and implement category filtering (Electronics, Jewelry, Clothing) plus a persistent
slide-out shopping cart drawer with quantity increment/decrement, tax/shipping computation and subtotal calculations.

### What I Built

- **Product catalog:** products are fetched asynchronously from [FakeStoreAPI](https://fakestoreapi.com/products)
  and shown in a responsive CSS Grid of cards with image, category, star rating, review count and price
- **Badges:** "Top rated" (rating of 4.5 or more) and "Popular" (400 or more reviews)
- **Filtering:** category buttons (All, Electronics, Jewelry, Clothing), live search by title or description,
  and sorting by price or rating. The API's men's and women's clothing are grouped under "Clothing"
- **Cart drawer:** slide-out drawer with a live item-count badge on the navbar, a quantity stepper (1 to 10 per item),
  and remove / clear actions
- **Cart functions:** `addToCart()`, `removeFromCart()`, `updateQuantity()` and `calculateTotal()`
- **Totals:** subtotal, 8% tax and shipping ($5.99, free from $100) with a "spend X more for free shipping" hint.
  All money maths is done in cents, so there are no floating point errors
- **Persistent cart:** saved to localStorage, validated on load, and restored after a page reload
- **Simulated checkout:** a modal with name, email and address validation and an order confirmation with an
  order number. No payment details are collected and no real order is placed
- **Loading and errors:** skeleton cards while loading, and a clear error message with a "Try again" button if the API
  is unreachable
- **Accessibility:** labelled controls, focus moves into the drawer and modal, Esc closes them, the page behind is inert while they are open
- Dark/light theme toggle, responsive layout (2-column grid on phones), zero build step

### Tech Stack

JavaScript (ES6+), Fetch API (async/await), FakeStoreAPI, CSS Grid, localStorage, state management with plain JavaScript

### Deployment

Deployed with the same GitHub Pages site as the other tasks.

Live store: https://quratulain-809.github.io/Datheon_Full_Stack_Web_Development_Internship/E_Commerce_Store_Task4/