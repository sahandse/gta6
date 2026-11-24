import { characters, hubSections, news, vehicles } from "../data/site";
import { escapeHTML, norm, qs, qsa } from "../lib/dom";
import { imageTag } from "../lib/media";
import { characterMini } from "./characters-cards";
import { newsFeature, newsItemRow } from "./news-cards";
import { vehicleSummary } from "./vehicles-cards";

function hubCard(section: (typeof hubSections)[number]): string {
  return `<a class="feature-card" href="${escapeHTML(section.href)}" data-search="${escapeHTML(`${section.title} ${section.subtitle} ${section.tag}`)}">
    ${imageTag(section.image, section.title, { widths: [640, 1280], sizes: "(max-width: 680px) 92vw, 25vw" })}
    <span class="feature-tag">${escapeHTML(section.tag)}</span>
    <span class="feature-copy"><strong>${escapeHTML(section.title)}</strong><small>${escapeHTML(section.subtitle)}</small></span>
    <span class="feature-arrow" aria-hidden="true">↗</span>
  </a>`;
}

export function initHomeSearch(): void {
  const input = qs<HTMLInputElement>("[data-hub-search]");
  const cards = qsa<HTMLElement>("[data-search]");
  if (!input || !cards.length) return;

  input.addEventListener("input", () => {
    const query = norm(input.value);
    cards.forEach((card) => {
      const haystack = norm(card.dataset.search ?? "");
      card.hidden = Boolean(query) && !haystack.includes(query);
    });
  });
}

export function initHome(): void {
  const sections = qs<HTMLElement>("#hub-sections");
  if (sections) {
    sections.innerHTML = hubSections.map(hubCard).join("");
  }

  const garage = qs<HTMLElement>("[data-home-vehicles]");
  if (garage) {
    garage.innerHTML = vehicles.slice(0, 4).map(vehicleSummary).join("");
  }

  const people = qs<HTMLElement>("[data-home-characters]");
  if (people) {
    people.innerHTML = characters.slice(0, 3).map(characterMini).join("");
  }

  const newsWrap = qs<HTMLElement>("[data-home-news]");
  if (newsWrap) {
    const [first, ...rest] = news;
    if (first) {
      newsWrap.innerHTML = `<div class="news-grid">
        ${newsFeature(first)}
        <div class="news-list">${rest.slice(0, 4).map(newsItemRow).join("")}</div>
      </div>`;
    }
  }

  initHomeSearch();
}
