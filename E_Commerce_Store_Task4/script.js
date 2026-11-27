const API_URL = "https://fakestoreapi.com/products";
const CART_KEY = "datheonMarket.cart.v1";
const TAX_RATE = 0.08; // 8% sales tax
const SHIPPING_CENTS = 599; // flat shipping
const FREE_SHIPPING_CENTS = 10000; // free shipping from $100.00
const MAX_QTY = 10;

// State 
let products = [];
let cart = loadCart(); // [{ id, title, image, priceCents, qty }]
let categoryFilter = "all";
let searchTerm = "";
let sortMode = "featured";
let lastFocused = null;
let toastTimer = null;

// Elements
const $ = (id) => document.getElementById(id);
const grid = $("product-grid");
const statusEl = $("status");
const resultCount = $("result-count");
const searchInput = $("search-input");
const sortSelect = $("sort-select");
const filterButtons = document.querySelectorAll("[data-category]");
const mainEl = document.querySelector("main");

const cartButton = $("cart-button");
const cartBadge = $("cart-badge");
const drawer = $("cart-drawer");
const overlay = $("overlay");
const cartClose = $("cart-close");
const cartItemsEl = $("cart-items");
const cartEmptyEl = $("cart-empty");
const cartFoot = $("cart-foot");
const shippingNote = $("shipping-note");
const checkoutBtn = $("checkout-btn");
const clearCartBtn = $("clear-cart");

const checkoutModal = $("checkout-modal");
const checkoutClose = $("checkout-close");
const checkoutForm = $("checkout-form");
const checkoutStep = $("checkout-step");
const confirmStep = $("confirm-step");
const formError = $("form-error");

// Helpers 
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatCents = (cents) => money.format(cents / 100);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function toast(message) {
  const t = $("toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

// FakeStoreAPI has 4 categories
function mapCategory(apiCategory) {
  const c = String(apiCategory || "").toLowerCase();
  if (c === "electronics") return "Electronics";
  if (c.startsWith("jewel")) return "Jewelry"; 
  if (c.includes("clothing")) return "Clothing";
  return "Other";
}

// A small generated picture with the product's initials, used if a photo fails to load
function placeholderImage(title) {
  const letters =
    String(title || "")
      .split(/\s+/)
      .map((w) => w.replace(/[^A-Za-z0-9]/g, "").charAt(0).toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "?";
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>" +
    "<rect width='200' height='200' fill='#ede9fe'/>" +
    "<text x='100' y='120' font-size='64' text-anchor='middle' fill='#5b21b6' font-family='Georgia,serif'>" +
    letters + "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function useImageFallback(img, title) {
  img.addEventListener("error", () => {
    if (img.dataset.fallback) return; // never loop
    img.dataset.fallback = "1";
    img.src = placeholderImage(title);
  });
}

function isSafeImage(url) {
  // Our own generated placeholder pictures (used by the sample products)
  if (typeof url === "string" && url.startsWith("data:image/svg+xml,")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch (e) {
    return false;
  }
}

// Fetching products 
function normalizeProducts(data) {
  return data
    .filter((p) => p && typeof p.title === "string" && Number.isFinite(Number(p.price)))
    .map((p) => ({
      id: Number(p.id),
      title: p.title,
      priceCents: Math.round(Number(p.price) * 100),
      description: String(p.description || ""),
      category: mapCategory(p.category),
      image: isSafeImage(p.image) ? p.image : "",
      rate: Number(p.rating && p.rating.rate) || 0,
      count: Number(p.rating && p.rating.count) || 0
    }));
}

async function fetchProducts() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    if (!res.ok) throw new Error("Server responded with " + res.status);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    return normalizeProducts(data);
  } finally {
    clearTimeout(timer);
  }
}


function showNotice(show) {
  const box = $("notice");
  box.innerHTML = "";
  box.hidden = !show;
  if (!show) return;
  box.appendChild(
    el("span", "", "Couldn't reach FakeStoreAPI, so you're seeing sample products. The cart and checkout work the same way. ")
  );
  const retry = el("button", "link-btn inline", "Try live products again");
  retry.type = "button";
  retry.addEventListener("click", loadProducts);
  box.appendChild(retry);
}

async function loadProducts() {
  showSkeletons();
  statusEl.hidden = true;
  resultCount.textContent = "Loading products...";
  let usingSample = false;
  try {
    products = await fetchProducts();
    if (products.length === 0) throw new Error("No products returned");
  } catch (err) {
    products = normalizeProducts(window.FALLBACK_PRODUCTS || []);
    usingSample = true;
  }

  if (products.length === 0) {
    grid.innerHTML = "";
    resultCount.textContent = "";
    showNotice(false);
    showStatus("Couldn't load products", "Check your connection and try again.", true);
    return;
  }
  showNotice(usingSample);
  render();
}

function showStatus(title, text, withRetry) {
  statusEl.innerHTML = "";
  statusEl.appendChild(el("strong", "", title));
  statusEl.appendChild(el("span", "", text));
  if (withRetry) {
    const btn = el("button", "btn btn-primary", "Try again");
    btn.type = "button";
    btn.addEventListener("click", loadProducts);
    statusEl.appendChild(document.createElement("br"));
    statusEl.appendChild(btn);
  }
  statusEl.hidden = false;
}

function showSkeletons() {
  grid.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const card = el("article", "product skeleton");
    card.setAttribute("aria-hidden", "true");
    card.appendChild(el("div", "product-img"));
    const body = el("div", "product-body");
    body.append(el("div", "line short"), el("div", "line"), el("div", "line short"));
    card.appendChild(body);
    grid.appendChild(card);
  }
}

// Filtering, searching, sorting
function getVisibleProducts() {
  const q = searchTerm.trim().toLowerCase();
  const list = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (q && !(p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) return false;
    return true;
  });
  if (sortMode === "price-asc") list.sort((a, b) => a.priceCents - b.priceCents);
  else if (sortMode === "price-desc") list.sort((a, b) => b.priceCents - a.priceCents);
  else if (sortMode === "rating") list.sort((a, b) => b.rate - a.rate || b.count - a.count);
  return list;
}

// Product rendering 
function starsFor(rate) {
  const full = Math.round(rate);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function buildProductCard(p) {
  const card = el("article", "product");

  const imgWrap = el("div", "product-img");
  const img = document.createElement("img");
  img.src = p.image || placeholderImage(p.title);
  img.alt = p.title;
  img.loading = "lazy";
  useImageFallback(img, p.title);
  imgWrap.appendChild(img);
  card.appendChild(imgWrap);

  // Badges
  const badges = el("div", "badges");
  if (p.rate >= 4.5) badges.appendChild(el("span", "pill", "Top rated"));
  if (p.count >= 400) badges.appendChild(el("span", "pill alt", "Popular"));
  if (badges.children.length) card.appendChild(badges);

  const body = el("div", "product-body");
  body.appendChild(el("span", "product-cat", p.category));

  const title = el("h2", "product-title", p.title);
  title.title = p.title;
  body.appendChild(title);

  const rating = el("div", "rating");
  rating.setAttribute("aria-label", "Rated " + p.rate.toFixed(1) + " out of 5 from " + p.count + " reviews");
  const stars = el("span", "stars", starsFor(p.rate));
  stars.setAttribute("aria-hidden", "true");
  rating.append(stars, document.createTextNode(" " + p.rate.toFixed(1) + " (" + p.count + ")"));
  body.appendChild(rating);

  body.appendChild(el("div", "price", formatCents(p.priceCents)));

  const add = el("button", "btn btn-primary", "Add to cart");
  add.type = "button";
  add.setAttribute("aria-label", "Add " + p.title + " to cart");
  add.addEventListener("click", () => {
    addToCart(p.id);
    add.textContent = "Added ✓";
    add.classList.add("added");
    setTimeout(() => {
      add.textContent = "Add to cart";
      add.classList.remove("added");
    }, 1000);
  });
  body.appendChild(add);

  card.appendChild(body);
  return card;
}

function render() {
  const visible = getVisibleProducts();
  grid.innerHTML = "";
  visible.forEach((p) => grid.appendChild(buildProductCard(p)));

  if (visible.length === 0) {
    resultCount.textContent = "";
    showStatus("No products found", "Try a different search or category.", false);
  } else {
    statusEl.hidden = true;
    resultCount.textContent = "Showing " + visible.length + (visible.length === 1 ? " product" : " products");
  }
}

// Cart logic
function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (i) =>
          i &&
          Number.isInteger(i.id) &&
          typeof i.title === "string" &&
          Number.isInteger(i.priceCents) &&
          i.priceCents >= 0 &&
          Number.isInteger(i.qty) &&
          i.qty >= 1
      )
      .map((i) => ({
        id: i.id,
        title: i.title,
        image: typeof i.image === "string" && isSafeImage(i.image) ? i.image : "",
        priceCents: i.priceCents,
        qty: Math.min(i.qty, MAX_QTY)
      }));
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    // Storage may be blocked. The cart still works for this visit.
  }
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    if (existing.qty >= MAX_QTY) {
      toast("Maximum " + MAX_QTY + " of each item");
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, title: product.title, image: product.image, priceCents: product.priceCents, qty: 1 });
  }
  saveCart();
  renderCart(true);
  toast("Added to cart");
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function updateQuantity(id, qty) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  if (qty < 1) return removeFromCart(id);
  item.qty = Math.min(qty, MAX_QTY);
  saveCart();
  renderCart();
}

function calculateTotal() {
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);
  const subtotalCents = cart.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  const shippingCents = subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;
  return { itemCount, subtotalCents, shippingCents, taxCents, totalCents };
}

function buildCartItem(item) {
  const li = el("li", "cart-item");

  const thumb = document.createElement("img");
  thumb.src = item.image || placeholderImage(item.title);
  thumb.alt = "";
  useImageFallback(thumb, item.title);
  li.appendChild(thumb);

  const info = el("div");
  info.appendChild(el("h3", "", item.title));
  info.appendChild(el("p", "unit", formatCents(item.priceCents) + " each"));

  const qty = el("div", "qty");
  const minus = el("button", "", "−");
  minus.type = "button";
  minus.setAttribute("aria-label", "Decrease quantity of " + item.title);
  minus.disabled = item.qty <= 1;
  minus.addEventListener("click", () => updateQuantity(item.id, item.qty - 1));

  const out = document.createElement("output");
  out.textContent = String(item.qty);
  out.setAttribute("aria-label", "Quantity");

  const plus = el("button", "", "+");
  plus.type = "button";
  plus.setAttribute("aria-label", "Increase quantity of " + item.title);
  plus.disabled = item.qty >= MAX_QTY;
  plus.addEventListener("click", () => updateQuantity(item.id, item.qty + 1));

  qty.append(minus, out, plus);
  info.appendChild(qty);
  li.appendChild(info);

  const right = el("div");
  right.appendChild(el("div", "line-total", formatCents(item.priceCents * item.qty)));
  const rm = el("button", "remove-btn", "Remove");
  rm.type = "button";
  rm.setAttribute("aria-label", "Remove " + item.title + " from cart");
  rm.addEventListener("click", () => removeFromCart(item.id));
  right.appendChild(rm);
  li.appendChild(right);

  return li;
}

function renderCart(bump) {
  cartItemsEl.innerHTML = "";
  cart.forEach((item) => cartItemsEl.appendChild(buildCartItem(item)));

  const t = calculateTotal();
  const empty = cart.length === 0;

  cartEmptyEl.hidden = !empty;
  cartFoot.hidden = empty;

  $("sum-subtotal").textContent = formatCents(t.subtotalCents);
  $("sum-shipping").textContent = t.shippingCents === 0 ? "Free" : formatCents(t.shippingCents);
  $("sum-tax").textContent = formatCents(t.taxCents);
  $("sum-total").textContent = formatCents(t.totalCents);

  if (t.subtotalCents >= FREE_SHIPPING_CENTS) {
    shippingNote.textContent = "You've unlocked free shipping.";
  } else if (t.subtotalCents > 0) {
    shippingNote.textContent = "Add " + formatCents(FREE_SHIPPING_CENTS - t.subtotalCents) + " more for free shipping.";
  } else {
    shippingNote.textContent = "";
  }

  // Badge counter on the navbar
  cartBadge.hidden = t.itemCount === 0;
  cartBadge.textContent = String(t.itemCount);
  cartButton.setAttribute("aria-label", "Open cart, " + t.itemCount + (t.itemCount === 1 ? " item" : " items"));
  if (bump && t.itemCount > 0) {
    cartBadge.classList.remove("bump");
    void cartBadge.offsetWidth; // restart the animation
    cartBadge.classList.add("bump");
  }
}

// Drawer open / close 
function setBackgroundInert(on) {
  [mainEl, document.querySelector(".header"), document.querySelector(".footer")].forEach((n) => {
    if (n) n.inert = on;
  });
}

function openDrawer() {
  lastFocused = document.activeElement;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("show"));
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  setBackgroundInert(true);
  document.body.style.overflow = "hidden";
  cartClose.focus();
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
  setTimeout(() => {
    if (!drawer.classList.contains("open")) overlay.hidden = true;
  }, 300);
  setBackgroundInert(false);
  document.body.style.overflow = "";
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

const drawerIsOpen = () => drawer.classList.contains("open");
const modalIsOpen = () => !checkoutModal.hidden;

// Checkout 
function openCheckout() {
  if (cart.length === 0) return;
  if (drawerIsOpen()) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.classList.remove("show");
    overlay.hidden = true;
  }
  checkoutStep.hidden = false;
  confirmStep.hidden = true;
  formError.hidden = true;
  $("checkout-total").textContent = formatCents(calculateTotal().totalCents);


  const user = window.Auth && Auth.currentUser();
  $("guest-note").hidden = Boolean(user);
  if (user) {
    checkoutForm.elements["name"].value = user.name;
    checkoutForm.elements["email"].value = user.email;
    checkoutForm.elements["address"].value = user.address;
  }
  checkoutModal.hidden = false;
  setBackgroundInert(true);
  document.body.style.overflow = "hidden";
  checkoutForm.elements["name"].focus();
}

function closeCheckout() {
  checkoutModal.hidden = true;
  checkoutForm.reset();
  setBackgroundInert(false);
  document.body.style.overflow = "";
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

function makeOrderNumber() {
  const part = Math.random().toString(36).slice(2, 7).toUpperCase();
  return "EM-" + Date.now().toString(36).toUpperCase().slice(-5) + part;
}

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = checkoutForm.elements["name"].value.trim();
  const email = checkoutForm.elements["email"].value.trim();
  const address = checkoutForm.elements["address"].value.trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !address) {
    formError.textContent = !name
      ? "Enter your full name."
      : !emailOk
      ? "Enter a valid email address."
      : "Enter your delivery address.";
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  // Snapshot the order, then clear the cart
  const totals = calculateTotal();
  const items = cart.map((i) => ({ title: i.title, qty: i.qty, lineCents: i.priceCents * i.qty }));
  const orderNo = makeOrderNumber();

  // Signed-in customers keep the order in their history
  const user = window.Auth && Auth.currentUser();
  let saved = false;
  if (user) {
    saved = Auth.addOrder(user.email, {
      id: orderNo,
      date: new Date().toISOString(),
      items: items,
      totals: {
        subtotalCents: totals.subtotalCents,
        shippingCents: totals.shippingCents,
        taxCents: totals.taxCents,
        totalCents: totals.totalCents
      },
      shipTo: { name: name, email: email, address: address }
    });
  }
  $("confirm-orders").hidden = !saved;

  $("confirm-text").textContent =
    "Thanks, " + name + ". Order " + orderNo + " is confirmed (simulation). A confirmation would be sent to " + email + "." +
    (saved ? " It's saved in your order history." : "");

  const list = $("confirm-items");
  list.innerHTML = "";
  items.forEach((i) => {
    const li = el("li");
    li.append(el("span", "", i.qty + " × " + i.title), el("span", "", formatCents(i.lineCents)));
    list.appendChild(li);
  });
  $("confirm-total").textContent = formatCents(totals.totalCents);

  cart = [];
  saveCart();
  renderCart();

  checkoutStep.hidden = true;
  confirmStep.hidden = false;
  $("confirm-title").focus();
});

// Events 
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryFilter = btn.dataset.category;
    filterButtons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    if (products.length) render();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  if (products.length) render();
});

sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  if (products.length) render();
});

cartButton.addEventListener("click", openDrawer);
cartClose.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
checkoutBtn.addEventListener("click", openCheckout);
clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

checkoutClose.addEventListener("click", closeCheckout);
$("confirm-done").addEventListener("click", closeCheckout);
checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) closeCheckout();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modalIsOpen()) closeCheckout();
  else if (drawerIsOpen()) closeDrawer();
});

// The theme toggle and the navbar account area live in common.js

// Navbar
const homeLink = document.querySelector('[data-nav="home"]');
const shopLink = document.querySelector('[data-nav="shop"]');

function syncNav() {
  const onShop = window.location.hash === "#products";
  if (homeLink) {
    if (onShop) homeLink.removeAttribute("aria-current");
    else homeLink.setAttribute("aria-current", "page");
  }
  if (shopLink) {
    if (onShop) shopLink.setAttribute("aria-current", "page");
    else shopLink.removeAttribute("aria-current");
  }
}
window.addEventListener("hashchange", syncNav);
syncNav();

renderCart();
loadProducts();