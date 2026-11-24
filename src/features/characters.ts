import { characters } from "../data/site";
import { qs } from "../lib/dom";
import { characterCard } from "./characters-cards";

export function initCharacters(): void {
  const grid = qs<HTMLElement>("[data-characters]");
  if (!grid) return;
  grid.innerHTML = characters.map(characterCard).join("");
}
