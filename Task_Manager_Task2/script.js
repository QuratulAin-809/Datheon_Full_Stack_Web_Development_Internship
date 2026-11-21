// Task Manager: CRUD + localStorage persistence

const STORAGE_KEY = "taskManager.tasks.v1";
const CATEGORIES = ["Work", "Personal", "Study"];

// State 
let tasks = loadFromLocalStorage(); 
let statusFilter = "all"; 
let categoryFilter = "all";
let searchTerm = "";
let editingId = null;
let dragId = null;
let enterId = null; 
let justDoneId = null; 

// Elements 
const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categoryInput = document.getElementById("category-input");
const dueInput = document.getElementById("due-input");
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty-state");
const countEl = document.getElementById("task-count");
const clearBtn = document.getElementById("clear-completed");
const categoryFilterEl = document.getElementById("category-filter");
const searchEl = document.getElementById("search-input");
const filterButtons = document.querySelectorAll("[data-filter]");

// localStorage helpers 
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {

  }
}

function loadFromLocalStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data
      .filter((t) => t && typeof t.id === "string" && typeof t.text === "string")
      .map((t) => ({
        id: t.id,
        text: t.text.slice(0, 120),
        category: CATEGORIES.includes(t.category) ? t.category : "Personal",
        due: /^\d{4}-\d{2}-\d{2}$/.test(t.due || "") ? t.due : "",
        completed: Boolean(t.completed)
      }));
  } catch (e) {
    return [];
  }
}

// Utilities 
function makeId() {
  if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

function formatDue(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// CRUD 
function addTask(text, category, due) {
  const task = { id: makeId(), text: text, category: category, due: due, completed: false };
  tasks.unshift(task); // newest first
  enterId = task.id;
  saveToLocalStorage();
  render();
}

function updateTask(id, changes) {
  tasks = tasks.map((t) => (t.id === id ? Object.assign({}, t, changes) : t));
  saveToLocalStorage();
  render();
}

function deleteTask(id) {
  const node = listEl.querySelector('[data-id="' + id + '"]');
  const finish = () => {
    tasks = tasks.filter((t) => t.id !== id);
    if (editingId === id) editingId = null;
    saveToLocalStorage();
    render();
  };
  if (node) {
    node.classList.add("removing");
    setTimeout(finish, 220);
  } else {
    finish();
  }
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  justDoneId = task.completed ? null : id;
  updateTask(id, { completed: !task.completed });
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveToLocalStorage();
  render();
}

function moveTask(id, targetId) {
  // Move a task to the position of another task (full list order)
  const from = tasks.findIndex((t) => t.id === id);
  const to = tasks.findIndex((t) => t.id === targetId);
  if (from < 0 || to < 0 || from === to) return;
  const [item] = tasks.splice(from, 1);
  tasks.splice(to, 0, item);
  saveToLocalStorage();
  render();
}

function moveByStep(id, step) {
  // Move up/down relative to the tasks currently visible
  const visible = getVisibleTasks();
  const i = visible.findIndex((t) => t.id === id);
  const target = visible[i + step];
  if (target) moveTask(id, target.id);
}

// Filtering 
function getVisibleTasks() {
  const q = searchTerm.trim().toLowerCase();
  return tasks.filter((t) => {
    if (statusFilter === "active" && t.completed) return false;
    if (statusFilter === "completed" && !t.completed) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (q && !t.text.toLowerCase().includes(q)) return false;
    return true;
  });
}

// Rendering 
function buildTaskItem(task, index, visible) {
  const li = el("li", "task");
  li.dataset.id = task.id;
  li.dataset.category = task.category;
  if (task.completed) li.classList.add("done");
  if (task.id === enterId) li.classList.add("enter");
  if (task.id === justDoneId) li.classList.add("just-done");

  if (task.id === editingId) {
    li.appendChild(buildEditRow(task));
    return li;
  }

  // Drag handle
  const handle = el("span", "handle", "⋮⋮");
  handle.setAttribute("aria-hidden", "true");
  handle.title = "Drag to reorder";
  li.draggable = true;

  // Checkbox
  const check = el("input", "check");
  check.type = "checkbox";
  check.checked = task.completed;
  check.setAttribute("aria-label", "Mark \"" + task.text + "\" as complete");
  check.addEventListener("change", () => toggleTask(task.id));

  // Text + meta
  const body = el("div", "task-body");
  body.appendChild(el("span", "task-title", task.text));

  const meta = el("div", "meta");
  meta.appendChild(el("span", "badge", task.category));
  if (task.due) {
    const today = todayString();
    const due = el("span", "due", "Due " + formatDue(task.due));
    if (!task.completed && task.due < today) {
      due.classList.add("overdue");
      due.textContent += " (overdue)";
    } else if (!task.completed && task.due === today) {
      due.classList.add("today");
      due.textContent = "Due today";
    }
    meta.appendChild(due);
  }
  body.appendChild(meta);

  // Actions
  const actions = el("div", "actions");

  const up = el("button", "act", "↑");
  up.type = "button";
  up.title = "Move up";
  up.setAttribute("aria-label", "Move up");
  up.disabled = index === 0;
  up.addEventListener("click", () => moveByStep(task.id, -1));

  const down = el("button", "act", "↓");
  down.type = "button";
  down.title = "Move down";
  down.setAttribute("aria-label", "Move down");
  down.disabled = index === visible.length - 1;
  down.addEventListener("click", () => moveByStep(task.id, 1));

  const edit = el("button", "act", "✎");
  edit.type = "button";
  edit.title = "Edit";
  edit.setAttribute("aria-label", "Edit task");
  edit.addEventListener("click", () => {
    editingId = task.id;
    render();
    const input = listEl.querySelector(".edit-row input[type=text]");
    if (input) input.focus();
  });

  const del = el("button", "act delete", "✕");
  del.type = "button";
  del.title = "Delete";
  del.setAttribute("aria-label", "Delete task");
  del.addEventListener("click", () => deleteTask(task.id));

  actions.append(up, down, edit, del);
  li.append(handle, check, body, actions);

  // Drag and drop reordering
  li.addEventListener("dragstart", (e) => {
    dragId = task.id;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  });
  li.addEventListener("dragover", (e) => {
    if (!dragId || dragId === task.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    li.classList.add("drag-over");
  });
  li.addEventListener("dragleave", () => li.classList.remove("drag-over"));
  li.addEventListener("drop", (e) => {
    e.preventDefault();
    li.classList.remove("drag-over");
    if (dragId) moveTask(dragId, task.id);
    dragId = null;
  });
  li.addEventListener("dragend", () => {
    dragId = null;
    li.classList.remove("dragging");
    listEl.querySelectorAll(".drag-over").forEach((n) => n.classList.remove("drag-over"));
  });

  return li;
}

function buildEditRow(task) {
  const wrap = el("div", "edit-row");

  const text = el("input");
  text.type = "text";
  text.maxLength = 120;
  text.value = task.text;
  text.setAttribute("aria-label", "Task text");

  const cat = el("select");
  cat.setAttribute("aria-label", "Category");
  CATEGORIES.forEach((c) => {
    const opt = el("option", "", c);
    opt.value = c;
    if (c === task.category) opt.selected = true;
    cat.appendChild(opt);
  });

  const due = el("input");
  due.type = "date";
  due.value = task.due;
  due.setAttribute("aria-label", "Due date");

  const buttons = el("div", "edit-buttons");
  const save = el("button", "btn btn-primary btn-small", "Save");
  save.type = "button";
  const cancel = el("button", "btn btn-small", "Cancel");
  cancel.type = "button";
  buttons.append(save, cancel);

  function commit() {
    const value = text.value.trim();
    if (!value) {
      text.focus();
      return;
    }
    editingId = null;
    updateTask(task.id, { text: value, category: cat.value, due: due.value });
  }
  function abort() {
    editingId = null;
    render();
  }

  save.addEventListener("click", commit);
  cancel.addEventListener("click", abort);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      abort();
    }
  });

  wrap.append(text, cat, due, buttons);
  return wrap;
}

function render() {
  const visible = getVisibleTasks();

  listEl.innerHTML = "";
  visible.forEach((task, i) => listEl.appendChild(buildTaskItem(task, i, visible)));
  enterId = null;
  justDoneId = null;

  // Empty state
  if (visible.length === 0) {
    emptyEl.hidden = false;
    if (tasks.length === 0) {
      emptyEl.textContent = "No tasks yet. Add your first task above.";
    } else if (statusFilter === "completed") {
      emptyEl.textContent = "No completed tasks to show.";
    } else {
      emptyEl.textContent = "No tasks match your filters.";
    }
  } else {
    emptyEl.hidden = true;
  }

  // Footer
  const left = tasks.filter((t) => !t.completed).length;
  countEl.textContent = left + (left === 1 ? " task left" : " tasks left");
  clearBtn.disabled = !tasks.some((t) => t.completed);
}

// Events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }
  addTask(text, categoryInput.value, dueInput.value);
  taskInput.value = "";
  dueInput.value = "";
  taskInput.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    statusFilter = btn.dataset.filter;
    filterButtons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    render();
  });
});

categoryFilterEl.addEventListener("change", () => {
  categoryFilter = categoryFilterEl.value;
  render();
});

searchEl.addEventListener("input", () => {
  searchTerm = searchEl.value;
  render();
});

clearBtn.addEventListener("click", clearCompleted);

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

// Start
render();