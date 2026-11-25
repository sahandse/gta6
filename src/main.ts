import "./styles/site.css";

import { initCharacters } from "./features/characters";
import { initHome } from "./features/home";
import { initNewsPage, initNewsPreview } from "./features/news";
import { initMissionGuide } from "./features/missions";
import { initResources } from "./features/resources";
import { initUI } from "./features/ui";
import { initVehicles } from "./features/vehicles";

function bootstrap(): void {
  initUI();
  initMissionGuide();
  initHome();
  initVehicles();
  initCharacters();
  initNewsPreview();
  initNewsPage();
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
