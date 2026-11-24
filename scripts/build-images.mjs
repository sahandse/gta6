/**
 * Downloads the official Rockstar Games GTA VI media used by the fan hub,
 * then emits optimised local WebP variants.
 *
 * Run: npm run images
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const CDN = "https://www.rockstargames.com/VI/_next/static/media/";
const OUT = join(process.cwd(), "src", "assets", "images");

/** @typedef {{ key: string, file: string, widths?: number[], nav?: boolean }} Source */

/** @type {Source[]} */
const sources = [
  { key: "hero/jason-lucia", file: "Jason_and_Lucia_01.0naeahss9-1x6.jpg", widths: [1280, 1920, 2560], nav: true },

  { key: "characters/lucia", file: "Lucia_Caminos_01.0a7yqvewctkfp.jpg", widths: [640, 1000], nav: true },
  { key: "characters/jason", file: "Jason_Duval_07.0ca326xbl~oyh.jpg", widths: [640, 1000] },
  { key: "characters/boobie", file: "Boobie_Ike_01.0-wji2pg5anfs.jpg", widths: [640, 1000] },
  { key: "characters/drequan", file: "DreQuan_Priest_01.0_0~wi-ipdj35.jpg", widths: [640, 1000] },
  { key: "characters/cal", file: "Cal_Hampton_01.0xlil231_osh4.jpg", widths: [640, 1000] },
  { key: "characters/raul", file: "Raul_Bautista_01.0md1ii-yrn96r.jpg", widths: [640, 1000] },

  { key: "regions/vice-city", file: "Vice_City_13.0iq8ff474tsdx.jpg", widths: [640, 1280], nav: true },
  { key: "regions/keys", file: "Leonida_Keys_01.0zgz7tveur6y8.jpg", widths: [640, 1280], nav: true },
  { key: "regions/grassrivers", file: "Grassrivers_01.1096rw4lbjur_.jpg", widths: [640, 1280], nav: true },
  { key: "regions/port-gellhorn", file: "Port_Gellhorn_01.0fmisvza-5-cq.jpg", widths: [640, 1280] },
  { key: "regions/ambrosia", file: "Ambrosia_01.0rqphs0gazkm..jpg", widths: [640, 1280] },
  { key: "regions/mount-kalaga", file: "Mount_Kalaga_National_Park_01.0v5fl0f83hjv_.jpg", widths: [640, 1280] },
  { key: "map/poster", file: "Leonida_Map_Poster.08ir77j-.26ny.jpg", widths: [640, 1280], nav: true },

  { key: "vehicles/grotti-cheetah", file: "ULTIMATE_EDITION_GROTTI_CHEETAH_01.0a.wy3s_ogjey.jpg", widths: [640, 1280], nav: true },
  { key: "vehicles/safehouse-1", file: "ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_01.0wv6pw3t-mky3.jpg", widths: [640, 1280], nav: true },
  { key: "vehicles/safehouse-2", file: "ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_02.0-2n5rm9n8.rq.jpg", widths: [640, 1280] },
  { key: "vehicles/safehouse-3", file: "ULTIMATE_EDITION_SAFEHOUSE_VEHICLES_03.0c9.qtpdi.tf..jpg", widths: [640, 1280] },
  { key: "vehicles/squalo", file: "ULTIMATE_EDITION_SQUALO_01.0cim7hj58ypb1.jpg", widths: [640, 1280] },
  { key: "vehicles/buggy", file: "ULTIMATE_EDITION_VAPID_BUGGY_01.0jxfiql~371ik.jpg", widths: [640, 1280] },
  { key: "vehicles/stock-305", file: "ULTIMATE_EDITION_STOCK_305_01.0vuq0m5_1j-17.jpg", widths: [640, 1280] },
  { key: "vehicles/wyman-1", file: "ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_01.0swhrm__iu~6b.jpg", widths: [640, 1280] },
  { key: "vehicles/wyman-2", file: "ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_02.0_biiqjqkpg2b.jpg", widths: [640, 1280] },
  { key: "vehicles/wyman-3", file: "ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_03.0~0maq32u-4ai.jpg", widths: [640, 1280] },
  { key: "vehicles/wyman-4", file: "ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_04.05ku1csui.4h6.jpg", widths: [640, 1280] },
  { key: "vehicles/wyman-5", file: "ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_05.0e5.kdb~mrdih.jpg", widths: [640, 1280] },
  { key: "vehicles/wyman-6", file: "ULTIMATE_EDITION_WYMAN_CAR_COLLECTION_06.0ikq3r8wnrayv.jpg", widths: [640, 1280] },
  { key: "vehicles/ganado-retro", file: "ULTIMATE_EDITION_VAPID_GANADO_RETRO_BUILD_01.062dgvkwdynw5.jpg", widths: [640, 1280] },
  { key: "vehicles/stanier-1", file: "VINTAGE_VICE_CITY_PACK_VAPID_STANIER_01.004m_8d1~qngy.jpg", widths: [640, 1280] },
  { key: "vehicles/stanier-2", file: "VINTAGE_VICE_CITY_PACK_VAPID_STANIER_02.0s2wun4_vzld2.jpg", widths: [640, 1280] },
  { key: "vehicles/stanier-3", file: "VINTAGE_VICE_CITY_PACK_VAPID_STANIER_03.0dzlk-r0ehlu4.jpg", widths: [640, 1280] },
  { key: "vehicles/electric-fang-1", file: "ULTIMATE_EDITION_ELECTRIC_FANG_01.04tsytu7qp2b-.jpg", widths: [640, 1280] },
  { key: "vehicles/electric-fang-2", file: "ULTIMATE_EDITION_ELECTRIC_FANG_02.0a0h59s0zvhgc.jpg", widths: [640, 1280] },
  { key: "vehicles/electric-fang-3", file: "ULTIMATE_EDITION_ELECTRIC_FANG_03.0wd4urd9xwy5..jpg", widths: [640, 1280] },

  { key: "weapons/variants", file: "ULTIMATE_EDITION_WEAPON_VARIANTS_01.12licq0_o7mb5.jpg", widths: [640, 1280], nav: true },
  { key: "weapons/revolvers-1", file: "ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_01.0~3pdc~~sing4.jpg", widths: [640, 1280] },
  { key: "weapons/revolvers-2", file: "ULTIMATE_EDITION_HAWK_AND_LITTLE_MORGAN_REVOLVERS_02.04e_9jco7lluf.jpg", widths: [640, 1280] },
  { key: "weapons/one-eyed-1", file: "ULTIMATE_EDITION_ONE_EYED_WILLIE_01.0n7-__or5f.b6.jpg", widths: [640, 1280] },
  { key: "weapons/one-eyed-2", file: "ULTIMATE_EDITION_ONE_EYED_WILLIE_02.0dgnw_y_1bqao.jpg", widths: [640, 1280] },
  { key: "weapons/pattern", file: "VINTAGE_VICE_CITY_WEAPON_PATTERN_01.0gybtumgwdcoi.jpg", widths: [640, 1280] },
  { key: "weapons/gear", file: "ULTIMATE_EDITION_GOODTIME_GEAR_01.0t7de8dow381q.jpg", widths: [640, 1280] },

  { key: "vice-city/style-1", file: "ULTIMATE_EDITION_VICE_CITY_STYLE_01.0.u1gt~99yzks.jpg", widths: [640, 1280], nav: true },
  { key: "vice-city/style-2", file: "ULTIMATE_EDITION_VICE_CITY_STYLE_02.0c-r4s-x7srt5.jpg", widths: [640, 1280] },
  { key: "vice-city/style-3", file: "ULTIMATE_EDITION_VICE_CITY_STYLE_03.08.sic8sgqk4u.jpg", widths: [640, 1280] },
  { key: "vice-city/store", file: "ULTIMATE_EDITION_PTT_STORE_01.0seuocb~7b1-q.jpg", widths: [640, 1280] },
  { key: "vice-city/salon", file: "ULTIMATE_EDITION_SARAS_SALON_01.0gn7dwlvcgz17.jpg", widths: [640, 1280] },
];

const CONCURRENCY = 4;
const retries = 3;

async function download(file) {
  const url = `${CDN}${file}?akim=1&imdensity=1&imwidth=2600`;
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; GTAVIHub/3.0; +https://github.com/sahandse/gta6)" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
    }
  }
  throw lastError;
}

async function emit(item) {
  const buffer = await download(item.file);
  const base = sharp(buffer, { failOn: "none" }).rotate();
  const meta = await base.metadata();
  const nativeWidth = meta.width ?? 1280;

  for (const width of item.widths ?? [640, 1280]) {
    if (width > nativeWidth * 1.05) continue;
    const output = join(OUT, `${item.key}-${width}.webp`);
    await mkdir(dirname(output), { recursive: true });
    await base
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(output);
    console.log(`  ✓ ${item.key}-${width}.webp`);
  }

  if (item.nav) {
    const output = join(OUT, `nav/${item.key.replaceAll("/", "-")}-240.webp`);
    await mkdir(dirname(output), { recursive: true });
    await base
      .clone()
      .resize({ width: 240, height: 160, fit: "cover", position: "attention", withoutEnlargement: true })
      .webp({ quality: 74, effort: 4 })
      .toFile(output);
    console.log(`  ✓ nav/${item.key.replaceAll("/", "-")}-240.webp`);
  }
}

async function emitOg() {
  const buffer = await download("Jason_and_Lucia_01.0naeahss9-1x6.jpg");
  const output = join(OUT, "og-cover.webp");
  await sharp(buffer)
    .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
    .webp({ quality: 80, effort: 4 })
    .toFile(output);
  console.log("  ✓ og-cover.webp");
}

async function main() {
  console.log(`Building ${sources.length} image sets into ${OUT}`);
  let index = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (index < sources.length) {
      const current = sources[index];
      index += 1;
      if (!current) continue;
      console.log(`[${index}/${sources.length}] ${current.key}`);
      await emit(current);
    }
  });
  await Promise.all(workers);
  await emitOg();
  console.log("Done.");
}

await main();
