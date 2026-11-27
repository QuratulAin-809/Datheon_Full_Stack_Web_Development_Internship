(function () {
  "use strict";

  const USERS_KEY = "emeraldMarket.users.v1";
  const SESSION_KEY = "emeraldMarket.session.v1";
  const ORDERS_KEY = "emeraldMarket.orders.v1";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const SAFE_PAGES = ["index.html", "profile.html"];

  // localStorage helpers 
  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }
  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  const isPlainObject = (v) => v && typeof v === "object" && !Array.isArray(v);
  const readUsers = () => {
    const u = read(USERS_KEY, {});
    return isPlainObject(u) ? u : {};
  };
  const readOrders = () => {
    const o = read(ORDERS_KEY, {});
    return isPlainObject(o) ? o : {};
  };

  // Password hashing 
  function bytesToHex(buf) {
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function randomHex(n) {
    const a = new Uint8Array(n);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else for (let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256);
    return bytesToHex(a);
  }
  async function hashPassword(password, salt) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
        key,
        256
      );
      return "pbkdf2$" + bytesToHex(bits);
    }
    // Very old browsers only: a simple non-cryptographic hash. Demo use only.
    let h = 5381;
    const s = salt + password;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return "weak$" + (h >>> 0).toString(16);
  }

  const normalizeEmail = (e) => String(e || "").trim().toLowerCase();
  const fail = (error) => ({ ok: false, error });

  function publicUser(u) {
    return { name: u.name, email: u.email, phone: u.phone || "", address: u.address || "", createdAt: u.createdAt };
  }

  // Auth API 
  const Auth = {
    currentUser() {
      const session = read(SESSION_KEY, null);
      if (!session || typeof session.email !== "string") return null;
      const users = readUsers();
      return has(users, session.email) ? publicUser(users[session.email]) : null;
    },

    async signUp(name, email, password) {
      name = String(name || "").trim().slice(0, 80);
      email = normalizeEmail(email);
      password = String(password || "");
      if (name.length < 2) return fail("Enter your full name.");
      if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.");
      if (password.length < 8) return fail("Use a password with at least 8 characters.");

      const salt = randomHex(16);
      const hash = await hashPassword(password, salt);
      const users = readUsers();
      if (has(users, email)) return fail("An account with this email already exists. Try signing in.");

      users[email] = { name, email, phone: "", address: "", salt, hash, createdAt: new Date().toISOString() };
      if (!write(USERS_KEY, users)) return fail("Couldn't save your account. Your browser may be blocking storage.");
      write(SESSION_KEY, { email });
      return { ok: true };
    },

    async signIn(email, password) {
      email = normalizeEmail(email);
      password = String(password || "");
      const users = readUsers();
      const user = has(users, email) ? users[email] : null;
      const bad = fail("Incorrect email or password.");
      if (!user) return bad;
      const hash = await hashPassword(password, user.salt);
      if (hash !== user.hash) return bad;
      if (!write(SESSION_KEY, { email })) return fail("Couldn't sign you in. Your browser may be blocking storage.");
      return { ok: true };
    },

    signOut() {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (e) {}
    },

    updateProfile(changes) {
      const user = Auth.currentUser();
      if (!user) return fail("You're signed out.");
      const name = String(changes.name || "").trim().slice(0, 80);
      if (name.length < 2) return fail("Enter your full name.");
      const users = readUsers();
      users[user.email].name = name;
      users[user.email].phone = String(changes.phone || "").trim().slice(0, 30);
      users[user.email].address = String(changes.address || "").trim().slice(0, 200);
      return write(USERS_KEY, users) ? { ok: true } : fail("Couldn't save. Your browser may be blocking storage.");
    },

    getOrders(email) {
      const all = readOrders();
      return has(all, email) && Array.isArray(all[email]) ? all[email] : [];
    },

    addOrder(email, order) {
      const all = readOrders();
      const list = has(all, email) && Array.isArray(all[email]) ? all[email] : [];
      list.unshift(order);
      all[email] = list.slice(0, 50);
      return write(ORDERS_KEY, all);
    },

    deleteAccount() {
      const user = Auth.currentUser();
      if (!user) return;
      const users = readUsers();
      delete users[user.email];
      write(USERS_KEY, users);
      const orders = readOrders();
      delete orders[user.email];
      write(ORDERS_KEY, orders);
      Auth.signOut();
    },

    // Only allow redirects to our own pages
    safeNext(value) {
      return SAFE_PAGES.includes(value) ? value : "index.html";
    },

    // Wrapped so tests can replace it
    navigate(url) {
      window.location.href = url;
    }
  };

  window.Auth = Auth;

  // Navbar account area 
  function renderNav() {
    const slot = document.getElementById("auth-slot");
    if (!slot) return;
    slot.innerHTML = "";
    const user = Auth.currentUser();
    if (user) {
      const chip = document.createElement("a");
      chip.className = "nav-chip";
      chip.href = "profile.html";
      chip.setAttribute("aria-label", "Your profile, " + user.name);
      const avatar = document.createElement("span");
      avatar.className = "avatar";
      avatar.textContent = user.name.charAt(0).toUpperCase();
      const label = document.createElement("span");
      label.className = "nav-chip-name";
      label.textContent = user.name.split(" ")[0];
      chip.append(avatar, label);
      slot.appendChild(chip);
    } else {
      const a = document.createElement("a");
      a.className = "btn btn-small";
      a.href = "account.html";
      a.textContent = "Sign in";
      slot.appendChild(a);
    }
  }
  renderNav();

  // Theme toggle 
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    const applyTheme = (theme) => {
      root.setAttribute("data-theme", theme);
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    };
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {}
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }
})();