// Sample products used only when FakeStoreAPI can't be reached
// They use the same shape as the API, so the store treats them the same way
(function () {
  function art(bg, fg, label) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>" +
      "<rect width='200' height='200' fill='" + bg + "'/>" +
      "<text x='100' y='120' font-size='70' text-anchor='middle' fill='" + fg + "' font-family='Georgia,serif'>" +
      label + "</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const items = [
    ["Wireless Earbuds with Charging Case", 49.99, "electronics", "Bluetooth earbuds with a pocket charging case.", 4.4, 320, "#e0f2fe", "#075985", "EB"],
    ["27-inch Full HD IPS Monitor", 159.0, "electronics", "Crisp IPS display with slim bezels.", 4.7, 210, "#ede9fe", "#5b21b6", "HD"],
    ["Power Bank 20000mAh", 29.5, "electronics", "Fast-charging portable battery for phones and tablets.", 4.2, 540, "#fef3c7", "#92400e", "PB"],
    ["Mechanical Keyboard, Compact", 74.0, "electronics", "Tactile switches in a compact 75% layout.", 4.6, 180, "#fce7f3", "#9d174d", "KB"],
    ["Silver Pendant Necklace", 38.0, "jewelery", "Simple sterling silver pendant on a fine chain.", 4.5, 95, "#f1f5f9", "#334155", "SP"],
    ["Gold Plated Bangle Bracelet", 64.0, "jewelery", "Polished gold plated bangle with a smooth finish.", 4.1, 140, "#fef9c3", "#854d0e", "GB"],
    ["Pearl Stud Earrings", 24.99, "jewelery", "Classic freshwater pearl studs.", 4.8, 410, "#fdf2f8", "#831843", "PE"],
    ["Men's Classic Cotton T-Shirt", 14.99, "men's clothing", "Soft everyday crew neck in 100% cotton.", 4.0, 760, "#dcfce7", "#166534", "TS"],
    ["Men's Lightweight Rain Jacket", 59.9, "men's clothing", "Packable waterproof shell with a hood.", 4.3, 290, "#cffafe", "#155e75", "RJ"],
    ["Women's Denim Jacket", 54.5, "women's clothing", "Relaxed-fit denim jacket with button front.", 4.2, 330, "#dbeafe", "#1e40af", "DJ"],
    ["Women's Knit Cardigan", 42.0, "women's clothing", "Warm knit cardigan with pockets.", 3.9, 120, "#ffedd5", "#9a3412", "KC"],
    ["Women's Everyday Hoodie", 34.99, "women's clothing", "Midweight fleece hoodie with a kangaroo pocket.", 4.5, 470, "#ccfbf1", "#115e59", "HD"]
  ];

  window.FALLBACK_PRODUCTS = items.map((it, i) => ({
    id: 101 + i,
    title: it[0],
    price: it[1],
    category: it[2],
    description: it[3],
    image: art(it[6], it[7], it[8]),
    rating: { rate: it[4], count: it[5] }
  }));
})();