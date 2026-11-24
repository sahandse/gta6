import type { ColorPair } from "../types";

const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHTML(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

export function qs<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector);
}

export function qsa<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function norm(value: unknown): string {
  return String(value ?? "")
    .toLocaleLowerCase("fa")
    .replace(/[\u064A]/g, "ی")
    .replace(/[\u0643]/g, "ک")
    .trim();
}

export function faNumber(value: number): string {
  return Number(value || 0).toLocaleString("fa-IR");
}

export function gradient(color: ColorPair): string {
  return `linear-gradient(150deg, ${color[0]}, ${color[1]})`;
}

export function statBar(label: string, value: number, color: string): string {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  return `<div class="stat-line"><span>${escapeHTML(label)}</span><div class="bar"><i style="width:${safeValue}%;background:${color}"></i></div><b>${faNumber(safeValue)}</b></div>`;
}

export function emptyState(text: string, title = "نتیجه‌ای پیدا نشد"): HTMLElement {
  const node = document.createElement("div");
  node.className = "empty";
  node.innerHTML = `<strong>${escapeHTML(title)}</strong><span>${escapeHTML(text)}</span>`;
  return node;
}
