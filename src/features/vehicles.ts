import { vehicles } from "../data/site";
import { emptyState, faNumber, norm, qs, qsa } from "../lib/dom";
import { vehicleCard } from "./vehicles-cards";

export function initVehicles(): void {
  const grid = qs<HTMLElement>("[data-vehicles]");
  if (!grid) return;

  const searchInput = qs<HTMLInputElement>("[data-vehicle-search]");
  const sortSelect = qs<HTMLSelectElement>("[data-vehicle-sort]");
  const countElement = qs<HTMLElement>("[data-vehicle-count]");
  const pills = qsa<HTMLButtonElement>("[data-class]");

  let activeClass = "همه";
  let query = norm(new URLSearchParams(location.search).get("q") ?? "");

  if (query && searchInput) searchInput.value = query;

  const render = (): void => {
    let list = vehicles.slice();

    if (activeClass !== "همه") {
      list = list.filter((vehicle) => vehicle.cls === activeClass);
    }
    if (query) {
      list = list.filter((vehicle) =>
        norm([vehicle.name, vehicle.cls, vehicle.maker, ...vehicle.tags].join(" ")).includes(query),
      );
    }

    const sort = sortSelect?.value ?? "default";
    if (sort === "speed") list.sort((a, b) => b.speed - a.speed);
    if (sort === "handling") list.sort((a, b) => b.handling - a.handling);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = "";
    if (!list.length) {
      grid.appendChild(emptyState("فیلترها را تغییر دهید یا عبارت دیگری جست‌وجو کنید."));
    } else {
      list.forEach((vehicle, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.animationDelay = `${index * 28}ms`;
        wrapper.innerHTML = vehicleCard(vehicle);
        const card = wrapper.firstElementChild;
        if (card) grid.appendChild(card);
      });
    }

    if (countElement) {
      countElement.textContent = `${faNumber(list.length)} وسیله‌ی نقلیه`;
    }
  };

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((other) => other.classList.remove("active"));
      pill.classList.add("active");
      activeClass = pill.dataset.class ?? "همه";
      render();
    });
  });

  searchInput?.addEventListener("input", () => {
    query = norm(searchInput.value);
    render();
  });

  sortSelect?.addEventListener("change", render);
  render();
}
