import { resourceCategories } from "../data/resources";
import type { ResourceItem } from "../types";
import { escapeHTML, faNumber, norm, qs, qsa } from "../lib/dom";
import { imageTag } from "../lib/media";

function resourceCard(item: ResourceItem, imageKey: string): string {
  return `<a class="res-card" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">
    <div class="res-media">${imageTag(imageKey, item.name, { widths: [640, 1280], sizes: "(max-width: 680px) 92vw, 33vw" })}</div>
    <div class="res-top">
      <span class="res-name">${escapeHTML(item.name)}<small>${escapeHTML(item.fa)}</small></span>
      <span class="res-badge ${item.tag}">${item.tag === "free" ? "رایگان" : "فریمیوم"}</span>
    </div>
    <p>${escapeHTML(item.desc)}</p>
    <div class="res-foot">
      <span class="res-license">${escapeHTML(item.license)}</span>
      <span class="res-arrow" aria-hidden="true">↗</span>
    </div>
  </a>`;
}

export function initResources(): void {
  const grid = qs<HTMLElement>("[data-resources]");
  if (!grid) return;

  const search = qs<HTMLInputElement>("[data-resource-search]");
  const tagSelect = qs<HTMLSelectElement>("[data-resource-tag]");
  const pillsWrap = qs<HTMLElement>("[data-resource-cats]");
  const countElement = qs<HTMLElement>("[data-resource-count]");

  let activeCategory = "all";
  let activeTag = "all";
  let query = "";

  if (pillsWrap) {
    pillsWrap.innerHTML =
      '<button class="pill active" type="button" data-res-cat="all">همه</button>' +
      resourceCategories
        .map(
          (category) =>
            `<button class="pill" type="button" data-res-cat="${category.id}">${category.icon} ${escapeHTML(category.title.split("—")[0]?.trim() ?? category.title)}</button>`,
        )
        .join("");
  }

  const render = (): void => {
    let total = 0;
    grid.innerHTML = "";

    resourceCategories.forEach((category) => {
      if (activeCategory !== "all" && activeCategory !== category.id) return;

      const items = category.items.filter((item) => {
        const matchesTag = activeTag === "all" || item.tag === activeTag;
        const matchesQuery =
          !query || norm([item.name, item.fa, item.desc, item.license, category.title].join(" ")).includes(query);
        return matchesTag && matchesQuery;
      });

      if (!items.length) return;
      total += items.length;

      const section = document.createElement("section");
      section.className = "resource-section";
      section.id = category.id;
      section.innerHTML = `<div class="res-section-head">
        <span class="res-section-icon">${imageTag(category.image, category.title, { widths: [640, 1280], sizes: "72px" })}</span>
        <div>
          <h2>${escapeHTML(category.title)}</h2>
          <span class="res-section-count">${faNumber(items.length)} مورد</span>
        </div>
      </div>
      <div class="res-grid">${items.map((item) => resourceCard(item, category.image)).join("")}</div>`;
      grid.appendChild(section);
    });

    if (!total) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.innerHTML = "<strong>منبعی پیدا نشد</strong><span>عبارت جست‌وجو یا فیلتر را تغییر دهید.</span>";
      grid.appendChild(empty);
    }

    if (countElement) {
      countElement.textContent = `${faNumber(total)} منبع در این نمایش`;
    }
  };

  pillsWrap?.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-res-cat]");
    if (!button) return;
    qsa<HTMLButtonElement>("[data-res-cat]", pillsWrap).forEach((pill) => pill.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.resCat ?? "all";
    render();
  });

  search?.addEventListener("input", () => {
    query = norm(search.value);
    render();
  });

  if (tagSelect) {
    tagSelect.value = "all";
    tagSelect.addEventListener("change", () => {
      activeTag = tagSelect.value;
      render();
    });
  }

  render();
}
