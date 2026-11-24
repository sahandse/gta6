"use strict";
const officialMedia = {
  hero: "https://www.rockstargames.com/VI/_next/static/media/Jason_and_Lucia_01.0naeahss9-1x6.jpg?akim=1&imdensity=1&imwidth=2400",
  viceCity: "https://www.rockstargames.com/VI/_next/static/media/Vice_City_13.0iq8ff474tsdx.jpg?akim=1&imdensity=1&imwidth=1400",
  lucia: "https://www.rockstargames.com/VI/_next/static/media/Lucia_Caminos_01.0a7yqvewctkfp.jpg?akim=1&imdensity=1&imwidth=1200",
  keys: "https://www.rockstargames.com/VI/_next/static/media/Leonida_Keys_01.0zgz7tveur6y8.jpg?akim=1&imdensity=1&imwidth=1200"
};
const sections = [
  { title: "نقشه لئونیدا", subtitle: "شهرها، جزیره‌ها و مناطق دیدنی", href: "map.html", image: officialMedia.keys, tag: "EXPLORE" },
  { title: "شخصیت‌ها", subtitle: "قهرمانان و چهره‌های دنیای بازی", href: "characters.html", image: officialMedia.lucia, tag: "PEOPLE" },
  { title: "وسایل نقلیه", subtitle: "گاراژ و وسایل نقلیه لئونیدا", href: "vehicles.html", image: officialMedia.viceCity, tag: "GARAGE" },
  { title: "اخبار و رسانه", subtitle: "تصاویر و خبرهای منتشرشده", href: "news.html", image: officialMedia.hero, tag: "MEDIA" }
];
const $ = selector => document.querySelector(selector);
const escapeHTML = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char));
function renderSections() {
  const grid = $("#hub-sections"); if (!grid) return;
  grid.innerHTML = sections.map(item => `<a class="feature-card" href="${item.href}" data-search="${escapeHTML(item.title + " " + item.subtitle)}"><img src="${item.image}" alt="${escapeHTML(item.title)}" loading="lazy"><span class="feature-shade"></span><span class="feature-tag">${item.tag}</span><span class="feature-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle)}</small></span><span class="feature-arrow" aria-hidden="true">↗</span></a>`).join("");
}
function initSearch() {
  const input = $("[data-hub-search]");
  input?.addEventListener("input", () => {
    const query = (input.value || "").trim().toLocaleLowerCase("fa");
    document.querySelectorAll(".feature-card").forEach(card => { card.hidden = !card.dataset.search?.toLocaleLowerCase("fa").includes(query); });
  });
}
function initNavigation() {
  const toggle = $(".menu-toggle"), nav = $(".nav-links");
  toggle?.addEventListener("click", () => { const opened = nav?.classList.toggle("is-open") ?? false; toggle.setAttribute("aria-expanded", String(opened)); });
}
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) { items.forEach(item => item.classList.add("is-visible")); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
  items.forEach(item => observer.observe(item));
}
document.addEventListener("DOMContentLoaded", () => { renderSections(); initSearch(); initNavigation(); initReveal(); const year = $("[data-year]"); if (year) year.textContent = String(new Date().getFullYear()); });
