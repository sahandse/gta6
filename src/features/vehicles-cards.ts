import type { Vehicle } from "../types";
import { escapeHTML } from "../lib/dom";
import { imageTag } from "../lib/media";

export function vehicleCard(vehicle: Vehicle): string {
  const image = imageTag(vehicle.image, `تصویر ${vehicle.name} در GTA VI`, {
    widths: [640, 1280],
    sizes: "(max-width: 680px) 92vw, (max-width: 1040px) 46vw, 31vw",
  });

  return `<article class="card vehicle-card" data-vehicle-card>
    <div class="card-media">
      ${image}
      <span class="media-badge">${escapeHTML(vehicle.cls)}</span>
    </div>
    <div class="card-body">
      <h3>${escapeHTML(vehicle.name)}</h3>
      <p>سازنده: ${escapeHTML(vehicle.maker)} · قیمت و آمار فنی: هنوز منتشر نشده</p>
      <div class="vehicle-data-note">نام و تصویر در رسانه رسمی نمایش داده شده؛ مشخصات عملکردی هنوز تأیید نشده است.</div>
      <div class="chip-row">${vehicle.tags.map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join("")}</div>
    </div>
  </article>`;
}

export function vehicleSummary(vehicle: Vehicle): string {
  return `<a class="mini-card" href="vehicles.html">
    <span class="mini-media">${imageTag(vehicle.image, vehicle.name, { widths: [640, 1280], sizes: "(max-width: 680px) 92vw, 25vw" })}</span>
    <span class="mini-copy">
      <strong>${escapeHTML(vehicle.name)}</strong>
      <small>${escapeHTML(vehicle.cls)} · ${escapeHTML(vehicle.maker)}</small>
      <span class="mini-stats"><span>اطلاعات رسمی</span><span>مشخصات در انتظار انتشار</span></span>
    </span>
  </a>`;
}
