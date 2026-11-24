import type { Weapon } from "../types";
import { escapeHTML, statBar } from "../lib/dom";
import { imageTag } from "../lib/media";

export function weaponCard(weapon: Weapon): string {
  const image = imageTag(weapon.image, `تصویر ${weapon.name} در GTA VI`, {
    widths: [640, 1280],
    sizes: "(max-width: 680px) 92vw, (max-width: 1040px) 46vw, 31vw",
  });

  return `<article class="card weapon-card">
    <div class="card-media">${image}<span class="media-badge">${escapeHTML(weapon.cat)}</span></div>
    <div class="card-body">
      <div class="weapon-head">
        <h3>${escapeHTML(weapon.name)}</h3>
        <span class="chip hot">${escapeHTML(weapon.cat)}</span>
      </div>
      <p>${escapeHTML(weapon.desc)}</p>
      <div class="stat-lines">
        ${statBar("قدرت", weapon.dmg, "linear-gradient(90deg,#ff2d95,#ff8a00)")}
        ${statBar("سرعت شلیک", weapon.rate, "linear-gradient(90deg,#ff8a00,#ffd166)")}
        ${statBar("برد", weapon.range, "linear-gradient(90deg,#22e0ff,#37f5a1)")}
      </div>
    </div>
  </article>`;
}
