/* ============================================================
   GTA VI HUB — interactions & rendering
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const grad = (c) => `linear-gradient(150deg, ${c[0]}, ${c[1]})`;

  /* ---------------- header / nav ---------------- */
  const navToggle = $(".nav-toggle");
  const mainNav = $(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", mainNav.classList.contains("open"));
    });
  }

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }
  }

  /* ---------------- animated counters ---------------- */
  $$("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const dur = 1100;
    const start = performance.now();
    const suffix = el.dataset.suffix || "";
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("fa-IR") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ---------------- helpers ---------------- */
  const norm = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .replace(/[\u064A]/g, "ی")
      .replace(/[\u0643]/g, "ک")
      .trim();

  function emptyState(text) {
    const d = document.createElement("div");
    d.className = "empty";
    d.innerHTML = `<strong>نتیجه‌ای پیدا نشد</strong><span>${text}</span>`;
    return d;
  }

  function statBar(label, value, color) {
    return `
      <div class="stat-line">
        <span>${label}</span>
        <div class="bar"><i style="width:${value}%;background:${color}"></i></div>
        <b>${value}</b>
      </div>`;
  }

  /* ---------------- vehicles ---------------- */
  const vehicleGrid = $("[data-vehicles]");
  if (vehicleGrid) {
    const searchInput = $("[data-vehicle-search]");
    const sortSel = $("[data-vehicle-sort]");
    const countEl = $("[data-vehicle-count]");
    const pills = $$("[data-class]");

    let activeClass = "همه";
    let query = norm(new URLSearchParams(location.search).get("q") || "");
    if (query && searchInput) searchInput.value = query;

    function render() {
      let list = GTA6.vehicles.slice();

      if (activeClass !== "همه") list = list.filter((v) => v.cls === activeClass);
      if (query) {
        list = list.filter((v) =>
          norm([v.name, v.cls, v.maker, ...(v.tags || [])].join(" ")).includes(query)
        );
      }

      const sort = sortSel ? sortSel.value : "default";
      if (sort === "speed") list.sort((a, b) => b.speed - a.speed);
      if (sort === "handling") list.sort((a, b) => b.handling - a.handling);
      if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

      vehicleGrid.innerHTML = "";
      if (!list.length) {
        vehicleGrid.appendChild(emptyState("فیلترها را تغییر دهید یا عبارت دیگری جست‌وجو کنید."));
      } else {
        list.forEach((v, i) => {
          const card = document.createElement("article");
          card.className = "card vehicle-card reveal in";
          card.style.animationDelay = i * 30 + "ms";
          card.innerHTML = `
            <div class="card-media" style="background:${grad(v.color)}">
              <span class="glyph">${v.maker.slice(0, 3).toUpperCase()}</span>
              <span class="media-badge">${v.cls}</span>
            </div>
            <div class="card-body">
              <h3>${v.name}</h3>
              <p>سازنده: ${v.maker} · قیمت: <b>${v.price}</b></p>
              <div class="stat-lines">
                ${statBar("سرعت", v.speed, "linear-gradient(90deg,#ff2d95,#ff8a00)")}
                ${statBar("هندلینگ", v.handling, "linear-gradient(90deg,#22e0ff,#8a5cff)")}
              </div>
              <div class="chip-row">${(v.tags || []).map((t) => `<span class="chip">${t}</span>`).join("")}</div>
            </div>`;
          vehicleGrid.appendChild(card);
        });
      }
      if (countEl) countEl.textContent = `${list.length.toLocaleString("fa-IR")} وسیله‌ی نقلیه`;
    }

    pills.forEach((p) =>
      p.addEventListener("click", () => {
        pills.forEach((x) => x.classList.remove("active"));
        p.classList.add("active");
        activeClass = p.dataset.class;
        render();
      })
    );
    if (searchInput)
      searchInput.addEventListener("input", () => {
        query = norm(searchInput.value);
        render();
      });
    if (sortSel) sortSel.addEventListener("change", render);

    render();
  }

  /* ---------------- weapons ---------------- */
  const weaponGrid = $("[data-weapons]");
  if (weaponGrid) {
    GTA6.weapons.forEach((w) => {
      const card = document.createElement("article");
      card.className = "card weapon-card reveal in";
      card.innerHTML = `
        <div class="card-body">
          <div class="weapon-head">
            <h3>${w.name}</h3>
            <span class="chip hot">${w.cat}</span>
          </div>
          <p>${w.desc}</p>
          <div class="stat-lines">
            ${statBar("قدرت", w.dmg, "linear-gradient(90deg,#ff2d95,#ff8a00)")}
            ${statBar("سرعت شلیک", w.rate, "linear-gradient(90deg,#ff8a00,#ffd166)")}
            ${statBar("برد", w.range, "linear-gradient(90deg,#22e0ff,#37f5a1)")}
          </div>
        </div>`;
      weaponGrid.appendChild(card);
    });
  }

  /* ---------------- characters ---------------- */
  const charGrid = $("[data-characters]");
  if (charGrid) {
    GTA6.characters.forEach((c) => {
      const card = document.createElement("article");
      card.className = "card char-card reveal in";
      card.innerHTML = `
        <div class="card-media" style="background:${grad(c.color)}">
          <span class="glyph">${c.initials}</span>
        </div>
        <div class="card-body">
          <span class="role">${c.role}</span>
          <h3>${c.name}</h3>
          <p>${c.bio}</p>
          <div class="stat-lines">
            ${Object.entries(c.stats)
              .map(([k, v]) => statBar(k, v, grad(c.color)))
              .join("")}
          </div>
        </div>`;
      charGrid.appendChild(card);
    });
  }

  /* ---------------- official Leonida map viewer ---------------- */
  const mapViewport = $("[data-official-map-viewport]");
  const mapImage = $("[data-official-map-image]");
  if (mapViewport && mapImage) {
    const zoomLabel = $("[data-map-zoom-label]");
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let pointer = null;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const render = () => {
      mapImage.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`;
      if (zoomLabel) zoomLabel.textContent = `بزرگ‌نمایی: ${Math.round(scale * 100).toLocaleString("fa-IR")}٪`;
    };
    const zoomAt = (next, clientX, clientY) => {
      const rect = mapViewport.getBoundingClientRect();
      const cx = clientX == null ? rect.left + rect.width / 2 : clientX;
      const cy = clientY == null ? rect.top + rect.height / 2 : clientY;
      const localX = cx - rect.left - rect.width / 2;
      const localY = cy - rect.top - rect.height / 2;
      const nextScale = clamp(next, 1, 5);
      const ratio = nextScale / scale;
      offsetX = localX - (localX - offsetX) * ratio;
      offsetY = localY - (localY - offsetY) * ratio;
      scale = nextScale;
      render();
    };

    $$("[data-map-zoom]").forEach((button) => {
      button.addEventListener("click", () => zoomAt(scale + (button.dataset.mapZoom === "in" ? 0.25 : -0.25)));
    });
    const reset = $("[data-map-reset]");
    if (reset) reset.addEventListener("click", () => {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      render();
    });

    mapViewport.addEventListener("wheel", (event) => {
      event.preventDefault();
      zoomAt(scale + (event.deltaY < 0 ? 0.18 : -0.18), event.clientX, event.clientY);
    }, { passive: false });

    mapViewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointer = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      baseX = offsetX;
      baseY = offsetY;
      mapViewport.classList.add("dragging");
      mapViewport.setPointerCapture(event.pointerId);
    });
    mapViewport.addEventListener("pointermove", (event) => {
      if (pointer !== event.pointerId) return;
      offsetX = baseX + event.clientX - startX;
      offsetY = baseY + event.clientY - startY;
      render();
    });
    const stopDrag = (event) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      mapViewport.classList.remove("dragging");
    };
    mapViewport.addEventListener("pointerup", stopDrag);
    mapViewport.addEventListener("pointercancel", stopDrag);
    mapImage.addEventListener("load", render);
    render();
  }

  /* ---------------- news ---------------- */
  const newsWrap = $("[data-news]");
  if (newsWrap) {
    const feature = newsWrap.querySelector(".news-feature");
    const listEl = newsWrap.querySelector(".news-list");
    const [first, ...rest] = GTA6.news;

    if (feature) {
      feature.href = "#";
      feature.innerHTML = `
        <div class="feature-inner">
          <span class="chip hot">${first.cat}</span>
          <h3>${first.title}</h3>
          <p class="feature-excerpt">${first.excerpt}</p>
          <div class="meta">${first.date} · ${first.read} مطالعه</div>
        </div>`;
    }
    if (listEl) {
      listEl.innerHTML = rest
        .slice(0, 4)
        .map(
          (n) => `
        <a class="news-item" href="#">
          <span class="news-thumb" style="background:${grad(n.color)}">${n.glyph}</span>
          <span class="news-text">
            <span class="news-cat">${n.cat} · ${n.date}</span>
            <h4>${n.title}</h4>
          </span>
        </a>`
        )
        .join("");
    }
  }

  const newsFull = $("[data-news-full]");
  if (newsFull) {
    const search = $("[data-news-search]");
    const pills = $$("[data-news-cat]");
    let cat = "همه";

    function renderNews() {
      const q = norm(search ? search.value : "");
      const list = GTA6.news.filter((n) => {
        const okCat = cat === "همه" || n.cat === cat;
        const okQ = !q || norm(n.title + " " + n.excerpt + " " + n.cat).includes(q);
        return okCat && okQ;
      });
      newsFull.innerHTML = list.length
        ? list
            .map(
              (n) => `
        <a class="article-row reveal in" href="#">
          <span class="thumb" style="background:${grad(n.color)}">${n.glyph}</span>
          <span>
            <span class="meta">${n.cat} · ${n.date} · ${n.read} مطالعه</span>
            <h3>${n.title}</h3>
            <p>${n.excerpt}</p>
          </span>
        </a>`
            )
            .join("")
        : `<div class="empty"><strong>خبری پیدا نشد</strong><span>فیلتر یا جست‌وجو را تغییر دهید.</span></div>`;
    }

    pills.forEach((p) =>
      p.addEventListener("click", () => {
        pills.forEach((x) => x.classList.remove("active"));
        p.classList.add("active");
        cat = p.dataset.newsCat;
        renderNews();
      })
    );
    if (search) search.addEventListener("input", renderNews);
    renderNews();
  }

  /* ---------------- cheats ---------------- */
  const cheatWrap = $("[data-cheats]");
  if (cheatWrap) {
    cheatWrap.innerHTML = GTA6.cheats
      .map(
        (c) => `
      <div class="cheat-card">
        <div class="cheat-top">
          <code>${c.code}</code>
          <button class="copy-btn" data-copy="${c.code}">کپی</button>
        </div>
        <p>${c.effect}</p>
        <span class="chip">${c.platform}</span>
      </div>`
      )
      .join("");

    cheatWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const text = btn.dataset.copy;
      const done = () => {
        btn.textContent = "کپی شد";
        setTimeout(() => (btn.textContent = "کپی"), 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
      else done();
    });
  }

  /* ---------------- global header search -> vehicles ---------------- */
  const globalSearch = $("[data-global-search]");
  if (globalSearch) {
    globalSearch.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = globalSearch.value.trim();
      const page = document.body.dataset.page;
      const vehSearch = $("[data-vehicle-search]");
      if (vehSearch) {
        vehSearch.value = q;
        vehSearch.dispatchEvent(new Event("input"));
        vehSearch.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (q) {
        location.href = `vehicles.html?q=${encodeURIComponent(q)}`;
      }
    });
  }


  /* ---------------- resources ---------------- */
  const resWrap = $("[data-resources]");
  if (resWrap && typeof RESOURCES !== "undefined") {
    const search = $("[data-resource-search]");
    const tagSel = $("[data-resource-tag]");
    const pillsWrap = $("[data-resource-cats]");
    const countEl = $("[data-resource-count]");

    let cat = "all";
    let tag = "all";
    let q = "";

    pillsWrap.innerHTML =
      '<button class="pill active" data-res-cat="all">همه</button>' +
      RESOURCES.categories
        .map((c) => `<button class="pill" data-res-cat="${c.id}">${c.icon} ${c.title.split("—")[0].trim()}</button>`)
        .join("");

    const pills = () => $$("[data-res-cat]", pillsWrap);

    function renderResources() {
      let total = 0;
      resWrap.innerHTML = "";

      RESOURCES.categories.forEach((c) => {
        if (cat !== "all" && cat !== c.id) return;

        const items = c.items.filter((it) => {
          const okTag = tag === "all" || it.tag === tag;
          const okQ =
            !q ||
            norm([it.name, it.fa, it.desc, it.license, c.title].join(" ")).includes(q);
          return okTag && okQ;
        });
        if (!items.length) return;
        total += items.length;

        const section = document.createElement("section");
        section.className = "resource-section reveal in";
        section.id = c.id;
        section.innerHTML = `
          <div class="res-section-head">
            <span class="res-section-icon" style="background:${grad(c.color)}">${c.icon}</span>
            <div>
              <h2>${c.title}</h2>
              <span class="res-section-count">${items.length.toLocaleString("fa-IR")} مورد</span>
            </div>
          </div>
          <div class="res-grid">
            ${items
              .map(
                (it) => `
              <a class="res-card" href="${it.url}" target="_blank" rel="noopener noreferrer">
                <div class="res-top">
                  <span class="res-name">${it.name}<small>${it.fa}</small></span>
                  <span class="res-badge ${it.tag}">${it.tag === "free" ? "رایگان" : "فریمیوم"}</span>
                </div>
                <p>${it.desc}</p>
                <div class="res-foot">
                  <span class="res-license">${it.license}</span>
                  <span class="res-arrow" aria-hidden="true">↗</span>
                </div>
              </a>`
              )
              .join("")}
          </div>`;
        resWrap.appendChild(section);
      });

      if (!total) {
        resWrap.appendChild(emptyState("عبارت جست‌وجو یا فیلتر را تغییر دهید."));
      }
      if (countEl) countEl.textContent = `${total.toLocaleString("fa-IR")} منبع در این نمایش`;
    }

    pillsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-res-cat]");
      if (!btn) return;
      pills().forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      cat = btn.dataset.resCat;
      renderResources();
    });

    if (search)
      search.addEventListener("input", () => {
        q = norm(search.value);
        renderResources();
      });
    if (tagSel) {
      tagSel.value = "all";
      tagSel.addEventListener("change", () => {
        tag = tagSel.value;
        renderResources();
      });
    }

    renderResources();
  }

  /* ---------------- footer year ---------------- */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
