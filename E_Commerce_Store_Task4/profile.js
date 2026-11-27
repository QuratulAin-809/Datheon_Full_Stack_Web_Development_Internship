// Profile page: details, order history, sign out
(function () {
  "use strict";

  const user = Auth.currentUser();
  if (!user) {
    // Signed out: send to the sign in page, then come back here
    Auth.navigate("account.html?next=profile.html");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const formatCents = (c) => money.format(c / 100);

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // Details 
  const form = $("profile-form");
  const msg = $("profile-msg");

  function fillForm() {
    const u = Auth.currentUser();
    $("greeting").textContent = "Hi, " + u.name.split(" ")[0];
    $("profile-email").value = u.email;
    form.elements["name"].value = u.name;
    form.elements["phone"].value = u.phone;
    form.elements["address"].value = u.address;
  }
  fillForm();

  function showMsg(text, isError) {
    msg.textContent = text;
    msg.classList.toggle("error", Boolean(isError));
    msg.hidden = false;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = Auth.updateProfile({
      name: form.elements["name"].value,
      phone: form.elements["phone"].value,
      address: form.elements["address"].value
    });
    if (result.ok) {
      fillForm();
      showMsg("Saved.", false);
      // Refresh the navbar name
      const chipName = document.querySelector(".nav-chip-name");
      if (chipName) chipName.textContent = Auth.currentUser().name.split(" ")[0];
    } else {
      showMsg(result.error, true);
    }
  });

  // Orders 
  function renderOrders() {
    const list = $("orders-list");
    list.innerHTML = "";
    const orders = Auth.getOrders(user.email);
    $("orders-empty").hidden = orders.length > 0;

    orders.forEach((o) => {
      const li = el("li", "order");

      const head = el("div", "order-head");
      head.appendChild(el("strong", "", "Order " + o.id));
      const when = new Date(o.date);
      head.appendChild(
        el(
          "span",
          "order-date",
          isNaN(when) ? "" : when.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
        )
      );
      li.appendChild(head);

      const items = el("ul", "order-items");
      (o.items || []).forEach((i) => {
        const row = el("li");
        row.append(el("span", "", i.qty + " × " + i.title), el("span", "", formatCents(i.lineCents)));
        items.appendChild(row);
      });
      li.appendChild(items);

      const t = o.totals || {};
      const foot = el("div", "order-foot");
      foot.appendChild(
        el(
          "span",
          "order-meta",
          "Subtotal " + formatCents(t.subtotalCents || 0) +
            " · Shipping " + (t.shippingCents ? formatCents(t.shippingCents) : "Free") +
            " · Tax " + formatCents(t.taxCents || 0)
        )
      );
      foot.appendChild(el("strong", "", "Total " + formatCents(t.totalCents || 0)));
      li.appendChild(foot);

      list.appendChild(li);
    });
  }
  renderOrders();

  // Account actions 
  $("signout-btn").addEventListener("click", () => {
    Auth.signOut();
    Auth.navigate("index.html");
  });

  $("delete-btn").addEventListener("click", () => {
    if (window.confirm("Delete your account and order history from this browser? This can't be undone.")) {
      Auth.deleteAccount();
      Auth.navigate("index.html");
    }
  });
})();