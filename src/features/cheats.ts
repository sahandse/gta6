import { cheats } from "../data/site";
import { escapeHTML, qs } from "../lib/dom";

function cheatCard(code: string, platform: string, effect: string): string {
  return `<div class="cheat-card">
    <div class="cheat-top">
      <code>${escapeHTML(code)}</code>
      <button class="copy-btn" type="button" data-copy="${escapeHTML(code)}">کپی</button>
    </div>
    <p>${escapeHTML(effect)}</p>
    <span class="chip">${escapeHTML(platform)}</span>
  </div>`;
}

function bindCopy(root: HTMLElement): void {
  root.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-copy]");
    if (!button) return;
    const text = button.dataset.copy ?? "";
    const done = (): void => {
      const original = button.dataset.label ?? "کپی";
      button.dataset.label = original;
      button.textContent = "کپی شد";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1600);
    };
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).then(done, done);
    } else {
      done();
    }
  });
}

export function initCheats(): void {
  const grid = qs<HTMLElement>("[data-cheats]");
  if (grid) {
    grid.innerHTML = cheats.map((cheat) => cheatCard(cheat.code, cheat.platform, cheat.effect)).join("");
    bindCopy(grid);
  }

  const home = qs<HTMLElement>("[data-home-cheats]");
  if (home) {
    home.innerHTML = cheats
      .slice(0, 4)
      .map((cheat) => cheatCard(cheat.code, cheat.platform, cheat.effect))
      .join("");
    bindCopy(home);
  }
}
