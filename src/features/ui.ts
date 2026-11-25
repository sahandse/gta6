import { faNumber, qs, qsa } from "../lib/dom";

export function initNavigation(): void {
  const toggle = qs<HTMLButtonElement>(".menu-toggle");
  const nav = qs<HTMLElement>(".nav-links");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(opened));
  });

  nav.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

export function initReveal(): void {
  const items = qsa<HTMLElement>("[data-reveal], .reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible", "in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible", "in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  items.forEach((item) => observer.observe(item));
}

export function initCounters(): void {
  qsa<HTMLElement>("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count ?? 0);
    const suffix = element.dataset.suffix ?? "";
    const duration = 1100;
    const start = performance.now();

    const step = (now: number): void => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = faNumber(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}

export function initGlobalSearch(): void {
  const input = qs<HTMLInputElement>("[data-global-search]");
  if (!input) return;

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const query = input.value.trim();
    const vehicleSearch = qs<HTMLInputElement>("[data-vehicle-search]");
    if (vehicleSearch) {
      vehicleSearch.value = query;
      vehicleSearch.dispatchEvent(new Event("input", { bubbles: true }));
      vehicleSearch.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (query) {
      location.href = `vehicles.html?q=${encodeURIComponent(query)}`;
    }
  });
}

export function initYear(): void {
  qsa<HTMLElement>("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

export function initLanguage(): void {
  const key = "gta6-language-v1";
  const apply = (language: "fa" | "en"): void => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.querySelectorAll<HTMLElement>("[data-fa][data-en]").forEach((element) => {
      element.textContent = language === "en" ? element.dataset.en ?? "" : element.dataset.fa ?? "";
    });
    const button = qs<HTMLButtonElement>("[data-language-toggle]");
    if (button) button.textContent = language === "fa" ? "EN" : "فارسی";
    try { localStorage.setItem(key, language); } catch { /* private browsing */ }
    window.dispatchEvent(new Event("gta-language-change"));
  };
  let language: "fa" | "en" = "fa";
  try { language = localStorage.getItem(key) === "en" ? "en" : "fa"; } catch { /* default Persian */ }
  apply(language);
  qs<HTMLButtonElement>("[data-language-toggle]")?.addEventListener("click", () => {
    apply(document.documentElement.lang === "fa" ? "en" : "fa");
  });
}

export function initUI(): void {
  initLanguage();
  initNavigation();
  initReveal();
  initCounters();
  initGlobalSearch();
  initYear();
}
