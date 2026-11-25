import * as L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";

import type { DistrictsFile, MapDistrict, MapPlace, PlacesFile } from "../types";
import { escapeHTML as esc, faNumber as format, norm, qs, qsa } from "../lib/dom";

const DATA_URL = "assets/data/places.json";
const DISTRICTS_URL = "assets/data/districts.json";
const TILE_BASE = "https://fbritoferreira.github.io/gta6/tiles";

const STORE = {
  favorites: "gta6-map-favorites-v2",
  visited: "gta6-map-visited-v2",
  custom: "gta6-map-custom-v2",
  theme: "gta6-map-theme-v2",
} as const;

type Confidence = "community" | "press" | "unverified";

const categoryNames: Record<string, string> = {
  hotel: "هتل و اقامت",
  safehouse: "خانه امن",
  shop: "فروشگاه و خدمات",
  building: "ساختمان و مکان شاخص",
  civic: "مراکز عمومی",
  food: "رستوران و غذا",
  transport: "حمل‌ونقل",
  leisure: "تفریح و ورزش",
  nature: "طبیعت",
};

const confidenceLabels: Record<string, string> = {
  community: "بازسازی جامعه",
  press: "گزارش رسانه‌ای",
  unverified: "تأییدنشده",
};

const categoryColors: Record<string, string> = {
  hotel: "#ff9b59",
  safehouse: "#ff4f9a",
  shop: "#ffd166",
  building: "#b8a1ff",
  civic: "#56cfe1",
  food: "#ff7b72",
  transport: "#8bd17c",
  leisure: "#f6bd60",
  nature: "#4ecdc4",
};

const categoryIcons: Record<string, string> = {
  hotel: "🏨",
  safehouse: "🏠",
  shop: "🛍️",
  building: "🏛️",
  civic: "🏥",
  food: "🍽️",
  transport: "🚉",
  leisure: "🎡",
  nature: "🌿",
};

interface Filters {
  query: string;
  category: string;
  area: string;
  confidence: Set<Confidence>;
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function inputOf(selector: string): HTMLInputElement | null {
  return qs<HTMLInputElement>(selector);
}

function selectOf(selector: string): HTMLSelectElement | null {
  return qs<HTMLSelectElement>(selector);
}

function confidenceLabel(value: string | undefined): string {
  return confidenceLabels[value ?? "community"] ?? "بازسازی جامعه";
}

export function initMapPage(): void {
  const viewport = qs<HTMLElement>("[data-map-viewport]");
  const mapEl = qs<HTMLElement>("#leonida-map");
  const selectedCard = qs<HTMLElement>("[data-map-selected-card]");
  if (!mapEl || !viewport) return;

  let places: MapPlace[] = [];
  let districts: MapDistrict[] = [];
  let custom: MapPlace[] = [];
  const favorites = new Set<string>(safeRead<string[]>(STORE.favorites, []));
  const visited = new Set<string>(safeRead<string[]>(STORE.visited, []));

  let map: L.Map | null = null;
  let markerLayer: L.MarkerClusterGroup | null = null;
  let districtLayer: L.LayerGroup | null = null;
  let routeLayer: L.LayerGroup | null = null;
  let selected: string | null = null;
  let filters: Filters = {
    query: "",
    category: "all",
    area: "all",
    confidence: new Set<Confidence>(["community", "press", "unverified"]),
  };

  const allPlaces = (): MapPlace[] => [...places, ...custom];
  const find = (id: string | null | undefined): MapPlace | undefined =>
    id ? allPlaces().find((place) => place.id === id) : undefined;
  const areaLabel = (place: MapPlace): string => place.area ?? "نامشخص";

  const count = (selector: string, value: number): void => {
    const element = qs<HTMLElement>(selector);
    if (element) element.textContent = format(value);
  };

  const message = (text: string): void => {
    const element = qs<HTMLElement>("[data-map-admin-status]");
    if (element) element.textContent = text;
  };

  const filtered = (): MapPlace[] => {
    const query = norm(filters.query);
    return allPlaces().filter((place) => {
      const haystack = norm(
        [place.name, place.area, place.real_life, place.service, place.kind].join(" "),
      );
      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory = filters.category === "all" || place.kind === filters.category;
      const matchesArea = filters.area === "all" || areaLabel(place) === filters.area;
      const matchesConfidence = filters.confidence.has(
        (place.confidence as Confidence | undefined) ?? "community",
      );
      return matchesQuery && matchesCategory && matchesArea && matchesConfidence;
    });
  };

  const markerIcon = (place: MapPlace): L.DivIcon => {
    const color = categoryColors[place.kind] ?? "#ff4f9a";
    return L.divIcon({
      className: "",
      html: `<span class="map-pin" style="display:block;background:${color}"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const clusterIcon = (cluster: L.MarkerCluster): L.DivIcon => {
    const total = cluster.getChildCount();
    const size = total < 20 ? "small" : total < 80 ? "medium" : "large";
    const pixels = size === "small" ? 32 : size === "medium" ? 40 : 48;
    return L.divIcon({
      html: `<span class="map-pin-cluster map-cluster-${size}">${format(total)}</span>`,
      className: "",
      iconSize: [pixels, pixels],
    });
  };

  const popupContent = (place: MapPlace): string => {
    const realLife = place.real_life
      ? `<div class="map-popup-desc">نمونه واقعی الهام‌بخش: ${esc(place.real_life)}</div>`
      : "";
    return `<div class="map-popup-title">${esc(place.name)}</div>
      <div class="map-popup-meta">${esc(areaLabel(place))} · ${esc(categoryNames[place.kind] ?? place.kind)} · ${esc(confidenceLabel(place.confidence))}</div>
      ${realLife}
      <div class="map-popup-desc">مختصات جامعه‌محور: ${format(place.x)}، ${format(place.y)}</div>`;
  };

  const renderSelected = (): void => {
    const place = find(selected);
    if (!selectedCard) return;
    if (!place) {
      selectedCard.innerHTML =
        '<div class="map-selected-empty">برای مشاهده جزئیات، یک نشانگر یا مکان از فهرست را انتخاب کن.</div>';
      return;
    }

    selectedCard.innerHTML = `<div class="map-selected-content">
      <div class="map-selected-placeholder">${categoryIcons[place.kind] ?? "📍"}</div>
      <div>
        <h3>${esc(place.name)}</h3>
        <p>${esc(areaLabel(place))} · ${esc(categoryNames[place.kind] ?? place.kind)}</p>
        ${place.real_life ? `<p>نمونه واقعی الهام‌بخش: ${esc(place.real_life)}</p>` : ""}
        <span class="map-status-pill ${place.confidence === "unverified" ? "unverified" : ""}">${esc(confidenceLabel(place.confidence))} · موقعیت جامعه‌محور</span>
      </div>
      <div class="map-card-actions">
        <button type="button" data-map-favorite>${favorites.has(place.id) ? "★ ذخیره‌شده" : "☆ علاقه‌مندی"}</button>
        <button type="button" data-map-visited>${visited.has(place.id) ? "✓ بازدید شد" : "علامت بازدید"}</button>
      </div>
    </div>`;

    qs<HTMLButtonElement>("[data-map-favorite]")?.addEventListener("click", () => {
      toggle(favorites, place.id, STORE.favorites);
    });
    qs<HTMLButtonElement>("[data-map-visited]")?.addEventListener("click", () => {
      toggle(visited, place.id, STORE.visited);
    });
  };

  const renderProgress = (): void => {
    const all = allPlaces();
    const visitedPlaces = all.filter((place) => visited.has(place.id));
    const favoritePlaces = all.filter((place) => favorites.has(place.id));
    const percent = all.length ? Math.round((visitedPlaces.length / all.length) * 100) : 0;

    count("[data-map-visited-count]", visitedPlaces.length);
    count("[data-map-favorite-count]", favoritePlaces.length);

    const percentEl = qs<HTMLElement>("[data-map-progress-percent]");
    if (percentEl) percentEl.textContent = `${format(percent)}٪`;
    const bar = qs<HTMLElement>("[data-map-progress-bar]");
    if (bar) bar.style.width = `${percent}%`;

    const fill = (selector: string, items: MapPlace[]): void => {
      const element = qs<HTMLElement>(selector);
      if (!element) return;
      element.innerHTML =
        items
          .slice(0, 120)
          .map(
            (place) =>
              `<div class="map-progress-item"><span>${esc(place.name)}</span><span>${esc(areaLabel(place))}</span></div>`,
          )
          .join("") || '<p class="map-empty">هنوز موردی ثبت نشده است.</p>';
    };

    fill("[data-map-visited-list]", visitedPlaces);
    fill("[data-map-favorites-list]", favoritePlaces);
  };

  const toggle = (set: Set<string>, id: string, key: string): void => {
    if (set.has(id)) set.delete(id);
    else set.add(id);
    safeWrite(key, [...set]);
    renderSelected();
    renderProgress();
  };

  const select = (id: string | undefined, fly = true): void => {
    const place = find(id);
    if (!place) return;
    selected = place.id;
    if (
      fly &&
      map &&
      Number.isFinite(Number(place.x)) &&
      Number.isFinite(Number(place.y))
    ) {
      map.flyTo([-Number(place.y), Number(place.x)], Math.max(map.getZoom(), 3), {
        duration: 0.45,
      });
    }
    renderSelected();
  };

  const renderMarkers = (): void => {
    if (!markerLayer) return;
    markerLayer.clearLayers();
    const items = filtered();
    items.forEach((place) => {
      if (!Number.isFinite(Number(place.x)) || !Number.isFinite(Number(place.y))) return;
      const marker = L.marker([-Number(place.y), Number(place.x)], {
        icon: markerIcon(place),
        title: place.name,
        alt: place.name,
      });
      marker.bindPopup(popupContent(place));
      marker.on("click", () => select(place.id, false));
      markerLayer?.addLayer(marker);
    });
    count("[data-map-total]", allPlaces().length);
    count("[data-map-visible]", items.length);
    renderDatabase();
  };

  const renderCategories = (): void => {
    const root = qs<HTMLElement>("[data-map-categories]");
    if (!root) return;
    const kinds = Object.keys(categoryNames).filter((kind) =>
      places.some((place) => place.kind === kind),
    );
    root.innerHTML =
      `<label><input type="radio" name="map-kind" value="all" checked> همه دسته‌ها (${format(allPlaces().length)})</label>` +
      kinds
        .map(
          (kind) =>
            `<label><input type="radio" name="map-kind" value="${kind}"> ${categoryIcons[kind] ?? "•"} ${categoryNames[kind] ?? kind} (${format(places.filter((place) => place.kind === kind).length)})</label>`,
        )
        .join("");

    qsa<HTMLInputElement>('input[name="map-kind"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        filters.category = radio.value;
        renderMarkers();
      });
    });
  };

  const renderAreas = (): void => {
    const element = selectOf("[data-map-area]");
    if (!element) return;
    const previous = element.value;
    const areas = [...new Set(places.map(areaLabel).filter((area) => area && area !== "نامشخص"))].sort(
      (a, b) => a.localeCompare(b),
    );
    element.innerHTML =
      `<option value="all">همه ناحیه‌ها (${format(places.length)})</option>` +
      areas.map((area) => `<option value="${esc(area)}">${esc(area)}</option>`).join("");
    element.value = areas.includes(previous) ? previous : "all";
  };

  const renderDatabase = (): void => {
    const root = qs<HTMLElement>("[data-map-database]");
    if (!root) return;
    const query = norm(qs<HTMLInputElement>("[data-map-db-search]")?.value ?? "");
    const items = allPlaces().filter(
      (place) => !query || norm([place.name, place.area, place.real_life, place.kind].join(" ")).includes(query),
    );
    const pageSize = 90;
    const page = Math.max(0, Number(root.dataset.page ?? 0));
    const start = page * pageSize;
    const visible = items.slice(start, start + pageSize);

    root.innerHTML =
      visible
        .map(
          (place) =>
            `<article class="map-database-card">
              <div class="map-database-meta"><span>${esc(areaLabel(place))}</span><span>·</span><span>${esc(categoryNames[place.kind] ?? place.kind)}</span><span>·</span><span>${esc(confidenceLabel(place.confidence))}</span></div>
              <h3>${categoryIcons[place.kind] ?? "📍"} ${esc(place.name)}</h3>
              <p>${esc(place.real_life ?? "برای این مکان نمونه واقعی ثبت نشده است.")}</p>
              <button type="button" data-map-open="${esc(place.id)}">نمایش روی نقشه</button>
            </article>`,
        )
        .join("") || '<p class="map-empty">مکانی پیدا نشد.</p>';

    const pages = Math.max(1, Math.ceil(items.length / pageSize));
    root.insertAdjacentHTML(
      "beforeend",
      `<div class="map-pagination">
        <button type="button" data-map-prev ${page === 0 ? "disabled" : ""}>قبلی</button>
        <span>صفحه ${format(page + 1)} از ${format(pages)} · ${format(items.length)} مکان</span>
        <button type="button" data-map-next ${page + 1 >= pages ? "disabled" : ""}>بعدی</button>
      </div>`,
    );

    qsa<HTMLButtonElement>("[data-map-open]", root).forEach((button) => {
      button.addEventListener("click", () => {
        switchTab("explore");
        select(button.dataset.mapOpen, true);
      });
    });

    qs<HTMLButtonElement>("[data-map-prev]", root)?.addEventListener("click", () => {
      root.dataset.page = String(Math.max(0, page - 1));
      renderDatabase();
    });
    qs<HTMLButtonElement>("[data-map-next]", root)?.addEventListener("click", () => {
      root.dataset.page = String(Math.min(pages - 1, page + 1));
      renderDatabase();
    });
  };

  const renderRoute = (): void => {
    if (!routeLayer) return;
    routeLayer.clearLayers();
    const from = find(selectOf("[data-map-route-from]")?.value);
    const to = find(selectOf("[data-map-route-to]")?.value);
    if (!from || !to || from.id === to.id) return;

    const line = L.polyline(
      [
        [-Number(from.y), Number(from.x)],
        [-Number(to.y), Number(to.x)],
      ],
      { color: "#38d7ff", weight: 3, dashArray: "7 7" },
    ).addTo(routeLayer);

    const distance = Math.hypot(Number(from.x) - Number(to.x), Number(from.y) - Number(to.y));
    line.bindTooltip(`فاصله مستقیم تقریبی: ${format(Math.round(distance))} واحد نقشه`);
  };

  const renderRouteSelects = (): void => {
    const options = allPlaces()
      .map((place) => `<option value="${esc(place.id)}">${esc(place.name)} — ${esc(areaLabel(place))}</option>`)
      .join("");
    ["[data-map-route-from]", "[data-map-route-to]"].forEach((selector) => {
      const element = selectOf(selector);
      if (!element) return;
      const previous = element.value;
      element.innerHTML = `<option value="">انتخاب مکان</option>${options}`;
      element.value = previous;
    });
  };

  const renderDistricts = (show: boolean): void => {
    if (!districtLayer) return;
    districtLayer.clearLayers();
    if (!show) return;
    districts.forEach((district) => {
      (district.rings ?? []).forEach((ring) => {
        const coords = ring.map((point) => [-Number(point[1]), Number(point[0])] as [number, number]);
        L.polygon(coords, {
          color: "#ff77ae",
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.035,
          interactive: true,
        })
          .bindTooltip(esc(district.name), { sticky: true })
          .addTo(districtLayer as L.LayerGroup);
      });
    });
  };

  const switchTab = (name: string): void => {
    qsa<HTMLButtonElement>("[data-map-tab]").forEach((button) => {
      const active = button.dataset.mapTab === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    qsa<HTMLElement>("[data-map-panel]").forEach((panel) => {
      const active = panel.dataset.mapPanel === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    if (name === "database") renderDatabase();
    if (name === "progress") renderProgress();
    if (name === "explore") window.setTimeout(() => map?.invalidateSize(), 80);
  };

  const initMap = (): void => {
    map = L.map(mapEl, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 7,
      zoomControl: true,
      preferCanvas: true,
    });

    const bounds: L.LatLngBoundsExpression = [
      [-1024, 0],
      [0, 1024],
    ];
    const tileOptions: L.TileLayerOptions = {
      tileSize: 256,
      minZoom: 0,
      maxNativeZoom: 5,
      maxZoom: 7,
      noWrap: true,
      bounds,
      attribution:
        'Map data &copy; <a href="https://github.com/fbritoferreira/gta6" target="_blank" rel="noopener">Open GTA 6 Map</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>',
    };

    const night = L.tileLayer(`${TILE_BASE}/night/{z}/{z},{y},{x}.webp`, tileOptions);
    const day = L.tileLayer(`${TILE_BASE}/day/{z}/{z},{y},{x}.webp`, tileOptions);
    night.addTo(map);

    markerLayer = L.markerClusterGroup({
      maxClusterRadius: 42,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: clusterIcon,
    });
    markerLayer.addTo(map);
    districtLayer = L.layerGroup().addTo(map);
    routeLayer = L.layerGroup().addTo(map);

    L.control
      .layers(
        { "نقشه شب": night, "نقشه روز": day },
        { "نشانگر مکان‌ها": markerLayer, "مرز ناحیه‌ها": districtLayer, "مسیر مستقیم": routeLayer },
        { collapsed: true },
      )
      .addTo(map);

    map.fitBounds(bounds);
    map.setMaxBounds([
      [-1100, -60],
      [80, 1100],
    ]);
    map.on("zoomend", () => {
      const label = qs<HTMLElement>("[data-map-zoom-label]");
      if (label && map) label.textContent = `بزرگ‌نمایی: ${format(map.getZoom())}`;
    });
  };

  const load = async (): Promise<void> => {
    try {
      const [placesResponse, districtsResponse] = await Promise.all([
        fetch(DATA_URL),
        fetch(DISTRICTS_URL),
      ]);
      if (!placesResponse.ok || !districtsResponse.ok) {
        throw new Error(`HTTP ${!placesResponse.ok ? placesResponse.status : districtsResponse.status}`);
      }
      const placesFile = (await placesResponse.json()) as PlacesFile;
      const districtsFile = (await districtsResponse.json()) as DistrictsFile;

      places = Array.isArray(placesFile.places) ? placesFile.places : [];
      districts = Array.isArray(districtsFile.districts) ? districtsFile.districts : [];
      custom = safeRead<MapPlace[]>(STORE.custom, []);

      initMap();
      renderCategories();
      renderAreas();
      const initialQuery = new URLSearchParams(location.search).get("q");
      if (initialQuery) {
        filters.query = initialQuery;
        const searchField = inputOf("[data-map-search]");
        if (searchField) searchField.value = initialQuery;
      }
      renderMarkers();
      renderSelected();
      renderProgress();
      renderRouteSelects();
      const requestedTab = location.hash.slice(1);
      if (requestedTab === "database" || requestedTab === "progress") switchTab(requestedTab);

      count("[data-map-total]", places.length + custom.length);
      const label = qs<HTMLElement>("[data-map-zoom-label]");
      if (label) label.textContent = `${format(places.length + custom.length)} مکان · داده جامعه‌محور`;
    } catch (error) {
      message(`دریافت دیتابیس نقشه ناموفق بود: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  qsa<HTMLButtonElement>("[data-map-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.mapTab ?? "explore"));
  });

  inputOf("[data-map-search]")?.addEventListener("input", (event) => {
    filters.query = (event.target as HTMLInputElement).value;
    renderMarkers();
  });

  selectOf("[data-map-area]")?.addEventListener("change", (event) => {
    filters.area = (event.target as HTMLSelectElement).value;
    renderMarkers();
  });

  qsa<HTMLInputElement>("[data-map-confidence]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const value = (checkbox.dataset.mapConfidence ?? "community") as Confidence;
      if (checkbox.checked) filters.confidence.add(value);
      else filters.confidence.delete(value);
      renderMarkers();
    });
  });

  qs<HTMLButtonElement>("[data-map-clear-filters]")?.addEventListener("click", () => {
    filters = {
      query: "",
      category: "all",
      area: "all",
      confidence: new Set<Confidence>(["community", "press", "unverified"]),
    };
    const search = inputOf("[data-map-search]");
    if (search) search.value = "";
    const area = selectOf("[data-map-area]");
    if (area) area.value = "all";
    qsa<HTMLInputElement>("[data-map-confidence]").forEach((checkbox) => {
      checkbox.checked = true;
    });
    qsa<HTMLInputElement>('input[name="map-kind"][value="all"]').forEach((radio) => {
      radio.checked = true;
    });
    renderMarkers();
  });

  inputOf("[data-map-db-search]")?.addEventListener("input", () => {
    const database = qs<HTMLElement>("[data-map-database]");
    if (database) database.dataset.page = "0";
    renderDatabase();
  });

  qs<HTMLButtonElement>("[data-map-route]")?.addEventListener("click", renderRoute);
  qs<HTMLButtonElement>("[data-map-route-clear]")?.addEventListener("click", () => {
    routeLayer?.clearLayers();
    const from = selectOf("[data-map-route-from]");
    const to = selectOf("[data-map-route-to]");
    if (from) from.value = "";
    if (to) to.value = "";
  });

  qs<HTMLButtonElement>("[data-map-reset]")?.addEventListener("click", () => {
    map?.fitBounds([
      [-1024, 0],
      [0, 1024],
    ]);
  });

  qsa<HTMLButtonElement>("[data-map-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!map) return;
      map.setZoom(map.getZoom() + (button.dataset.mapZoom === "in" ? 1 : -1));
    });
  });

  qs<HTMLButtonElement>("[data-map-fullscreen]")?.addEventListener("click", () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      const request = viewport.requestFullscreen?.();
      if (request) {
        void request.then(() => window.setTimeout(() => map?.invalidateSize(), 100));
      }
    }
  });

  qs<HTMLInputElement>("[data-map-districts]")?.addEventListener("change", (event) => {
    renderDistricts((event.target as HTMLInputElement).checked);
  });

  const theme = safeRead<string>(STORE.theme, "dark");
  if (theme === "light") document.body.classList.add("map-light");
  const themeButton = qs<HTMLButtonElement>("[data-map-theme]");
  themeButton?.addEventListener("click", () => {
    const light = document.body.classList.toggle("map-light");
    safeWrite(STORE.theme, light ? "light" : "dark");
    if (themeButton) themeButton.textContent = light ? "☀ حالت تیره" : "☾ حالت روشن";
  });
  if (theme === "light" && themeButton) themeButton.textContent = "☀ حالت تیره";

  qs<HTMLButtonElement>("[data-map-progress-reset]")?.addEventListener("click", () => {
    visited.clear();
    favorites.clear();
    safeWrite(STORE.visited, []);
    safeWrite(STORE.favorites, []);
    renderSelected();
    renderProgress();
  });

  qs<HTMLFormElement>("[data-map-add-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;

    const item: MapPlace = {
      id: `local-${Date.now().toString(36)}`,
      name,
      kind: String(data.get("category") ?? "building"),
      area: String(data.get("region") ?? "Leonida"),
      x: Number(data.get("x")) * 10.24,
      y: Number(data.get("y")) * 10.24,
      real_life: "",
      service: String(data.get("desc") ?? ""),
      confidence: "unverified",
      source_urls: [],
    };
    custom.push(item);
    safeWrite(STORE.custom, custom);
    form.reset();
    renderCategories();
    renderAreas();
    renderMarkers();
    renderRouteSelects();
    message("مکان به فهرست محلی اضافه شد.");
  });

  qs<HTMLButtonElement>("[data-map-export]")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ version: 1, source: "local user additions", places: custom }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gta6-map-custom-places.json";
    anchor.click();
    URL.revokeObjectURL(url);
    message("خروجی مکان‌های محلی آماده شد.");
  });

  qs<HTMLInputElement>("[data-map-import]")?.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    void file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text) as { places?: MapPlace[] };
        if (!Array.isArray(parsed.places)) throw new Error("invalid");
        custom = parsed.places
          .filter(
            (place) =>
              place &&
              place.id &&
              place.name &&
              Number.isFinite(Number(place.x)) &&
              Number.isFinite(Number(place.y)),
          )
          .map((place) => ({ ...place, confidence: "unverified" }));
        safeWrite(STORE.custom, custom);
        renderCategories();
        renderAreas();
        renderMarkers();
        renderRouteSelects();
        message("فایل JSON وارد شد.");
      })
      .catch(() => {
        message("ساختار فایل JSON معتبر نیست.");
      })
      .finally(() => {
        target.value = "";
      });
  });

  qs<HTMLButtonElement>("[data-map-reset-local]")?.addEventListener("click", () => {
    custom = [];
    safeWrite(STORE.custom, []);
    renderCategories();
    renderAreas();
    renderMarkers();
    renderRouteSelects();
    message("مکان‌های محلی پاک شدند؛ دیتابیس اصلی حفظ شد.");
  });

  void load();
}
