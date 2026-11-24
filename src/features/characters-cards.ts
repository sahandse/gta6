import type { Character } from "../types";
import { escapeHTML, gradient, statBar } from "../lib/dom";
import { imageTag } from "../lib/media";

export function characterCard(character: Character): string {
  const image = imageTag(character.image, `تصویر ${character.name} در GTA VI`, {
    widths: [640, 1000],
    sizes: "(max-width: 680px) 92vw, (max-width: 1040px) 46vw, 31vw",
  });

  return `<article class="card char-card">
    <div class="card-media">${image}<span class="media-badge">${escapeHTML(character.initials)}</span></div>
    <div class="card-body">
      <span class="role">${escapeHTML(character.role)}</span>
      <h3>${escapeHTML(character.name)}</h3>
      <p>${escapeHTML(character.bio)}</p>
      <div class="stat-lines">
        ${Object.entries(character.stats)
          .map(([label, value]) => statBar(label, value, gradient(character.color)))
          .join("")}
      </div>
    </div>
  </article>`;
}

export function characterMini(character: Character): string {
  return `<a class="mini-card" href="characters.html">
    <span class="mini-media mini-media--portrait">${imageTag(character.image, character.name, { widths: [640, 1000], sizes: "(max-width: 680px) 92vw, 25vw" })}</span>
    <span class="mini-copy"><strong>${escapeHTML(character.name)}</strong><small>${escapeHTML(character.role)}</small></span>
  </a>`;
}
