import "./styles/site.css";

import { initCharacters } from "./features/characters";
import { initCheats } from "./features/cheats";
import { initHome } from "./features/home";
import { initNewsPage, initNewsPreview } from "./features/news";
import { initResources } from "./features/resources";
import { initUI } from "./features/ui";
import { initVehicles } from "./features/vehicles";
import { initWeapons } from "./features/weapons";

function bootstrap(): void {
  initUI();
  initHome();
  initVehicles();
  initCharacters();
  initWeapons();
  initNewsPreview();
  initNewsPage();
  initCheats();
  initResources();

  if (document.querySelector("#leonida-map")) {
    void import("./features/map").then((module) => module.initMapPage());
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
