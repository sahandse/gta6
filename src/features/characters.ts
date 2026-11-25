import { characters } from "../data/site";
import { norm, qs } from "../lib/dom";
import { characterCard } from "./characters-cards";

export function initCharacters(): void {
  const grid = qs<HTMLElement>("[data-characters]");
  if (!grid) return;
  const search = qs<HTMLInputElement>("[data-character-search]");
  const count = qs<HTMLElement>("[data-character-count]");
  const render = (): void => {
    const query = norm(search?.value ?? "");
    const filtered = characters.filter((item) =>
      norm([item.name, item.role, item.bio].join(" ")).includes(query),
    );
    grid.innerHTML = filtered.length
      ? filtered.map(characterCard).join("")
      : '<div class="empty-state"><h3>شخصیتی پیدا نشد</h3><p>عبارت جست‌وجو را تغییر بده.</p></div>';
    if (count) count.textContent = `${filtered.length} شخصیت`;
  };
  search?.addEventListener("input", render);
  render();
}
