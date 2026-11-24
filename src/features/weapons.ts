import { weapons } from "../data/site";
import { qs } from "../lib/dom";
import { weaponCard } from "./weapons-cards";

export function initWeapons(): void {
  const grid = qs<HTMLElement>("[data-weapons]");
  if (!grid) return;
  grid.innerHTML = weapons.map(weaponCard).join("");
}
