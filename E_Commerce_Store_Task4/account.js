// Sign in / create account page
(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const next = Auth.safeNext(params.get("next"));

  // Already signed in: go straight on
  if (Auth.currentUser()) {
    Auth.navigate(next === "index.html" ? "profile.html" : next);
    return;
  }

  const tabs = {
    signin: { tab: document.getElementById("tab-signin"), panel: document.getElementById("panel-signin") },
    signup: { tab: document.getElementById("tab-signup"), panel: document.getElementById("panel-signup") }
  };

  function showTab(name, moveFocus) {
    Object.keys(tabs).forEach((key) => {
      const on = key === name;
      tabs[key].tab.classList.toggle("active", on);
      tabs[key].tab.setAttribute("aria-selected", String(on));
      tabs[key].tab.tabIndex = on ? 0 : -1;
      tabs[key].panel.hidden = !on;
    });
    if (moveFocus) tabs[name].tab.focus();
  }

  Object.keys(tabs).forEach((key) => {
    tabs[key].tab.addEventListener("click", () => showTab(key, false));
    tabs[key].tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        showTab(key === "signin" ? "signup" : "signin", true);
      }
    });
  });

  if (window.location.hash === "#signup") showTab("signup", false);

  function showError(id, message) {
    const p = document.getElementById(id);
    p.textContent = message;
    p.hidden = false;
  }

  function wire(formId, errorId, action) {
    const form = document.getElementById(formId);
    const button = form.querySelector("button[type=submit]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.getElementById(errorId).hidden = true;
      button.disabled = true;
      try {
        const result = await action(new FormData(form));
        if (result.ok) Auth.navigate(next);
        else showError(errorId, result.error);
      } catch (err) {
        showError(errorId, "Something went wrong. Try again.");
      } finally {
        button.disabled = false;
      }
    });
  }

  wire("signin-form", "signin-error", (d) => Auth.signIn(d.get("email"), d.get("password")));
  wire("signup-form", "signup-error", (d) => Auth.signUp(d.get("name"), d.get("email"), d.get("password")));
})();