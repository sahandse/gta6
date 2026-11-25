import { qs } from "../lib/dom";

type Mission = { id: string; name: string; fa: string; noteFa: string; noteEn: string; chapter: number; };
const missions: Mission[] = [
  { id:"c1-m1", chapter:1, name:"Prologue", fa:"پیش‌درآمد", noteFa:"آغاز داستان و آشنایی با شخصیت‌ها و فضای لئونیدا.", noteEn:"The opening chapter introduces the protagonists and the world of Leonida." },
  { id:"c1-m2", chapter:1, name:"Gone Fishing", fa:"ماهیگیری", noteFa:"مرحله‌ای برای آشنایی با محیط جزیره‌ها و قایق‌رانی.", noteEn:"An early outing that introduces the Keys and boat navigation." },
  { id:"c1-m3", chapter:1, name:"Gear Up", fa:"آماده‌سازی", noteFa:"پیش از حرکت، هدف مرحله و نشانگرهای نقشه را بررسی کن.", noteEn:"Review the mission objective and map markers before moving on." },
  { id:"c1-m4", chapter:1, name:"Just a Scratch", fa:"فقط یک خراش", noteFa:"روی مسیر تعمیرگاه تمرکز کن و پس از پایان، مقصد بعدی را از نقشه دنبال کن.", noteEn:"Follow the route to the repair shop, then check the map for the next destination." },
  { id:"c1-m5", chapter:1, name:"Lab Fees", fa:"هزینه آزمایشگاه", noteFa:"به نشانه‌های محیط و ترتیب تعامل با اشیا دقت کن؛ هدف‌های فرعی را جداگانه بررسی کن.", noteEn:"Pay attention to environmental clues and interaction order; review optional objectives separately." },
  { id:"c1-m6", chapter:1, name:"Unwanted Attention", fa:"توجه ناخواسته", noteFa:"مسیر خروج و مقصد نهایی را روی نقشه دنبال کن و از میان‌بُرهای ناشناخته عجله‌ای استفاده نکن.", noteEn:"Keep the exit route and destination visible on the map; avoid rushing into unfamiliar shortcuts." },
  { id:"c1-m7", chapter:1, name:"Pipework", fa:"لوله‌کشی", noteFa:"این مرحله بر تعامل با محیط و انجام کارهای خانه تمرکز دارد؛ اتاق‌ها را کامل بررسی کن.", noteEn:"This mission focuses on environmental interaction and household tasks; check each room carefully." },
  { id:"c1-m8", chapter:1, name:"Hey Arnold!", fa:"هی آرنولد!", noteFa:"برای پیدا کردن مقصد، از نشانه‌های نقشه و پیام‌های داخل بازی استفاده کن.", noteEn:"Use map markers and in-game messages to locate the next destination." },
  { id:"c1-m9", chapter:1, name:"Island Dreams", fa:"رویاهای جزیره", noteFa:"به مسیر زیر آب و نقاط راهنمای محیط توجه کن؛ عجله نکن و مسیر را مرحله‌به‌مرحله دنبال کن.", noteEn:"Watch for underwater route cues and environmental markers; follow the route one step at a time." },
  { id:"c1-m10", chapter:1, name:"Feng Shui", fa:"فنگ‌شویی", noteFa:"چیدمان وسایل خانه را با نشانه‌های هدف تطبیق بده و بعد از هر تغییر، نتیجه را بررسی کن.", noteEn:"Match the household arrangement to the objective cues and check the result after each change." },
  { id:"c1-m11", chapter:1, name:"Coming Home", fa:"بازگشت به خانه", noteFa:"پس از پایان گفت‌وگوها، مقصد بعدی را از نقشه و اعلان‌های بازی دنبال کن.", noteEn:"After the conversations, follow the next destination using the map and in-game prompts." },
  { id:"c1-m12", chapter:1, name:"Buck Me", fa:"باک می", noteFa:"به اعلان‌های تلفن و هدف‌های مالی مرحله توجه کن.", noteEn:"Pay attention to phone notifications and the mission's financial objectives." },
  { id:"c1-m13", chapter:1, name:"Clean Up After Donnie", fa:"جمع‌وجور کردن بعد از دانی", noteFa:"هدف‌های نمایش‌داده‌شده را به ترتیب انجام بده و مقصد را روی نقشه بازبینی کن.", noteEn:"Complete the displayed objectives in order and re-check the destination on the map." },
  { id:"c1-m14", chapter:1, name:"Down to Earth", fa:"روی زمین", noteFa:"گفت‌وگوها و پیام‌های جدید می‌توانند سرنخ مرحله بعد باشند.", noteEn:"Conversations and new messages can provide clues for the next step." },
  { id:"c1-m15", chapter:1, name:"Deposit Cash Into BuckMe", fa:"واریز پول به باک‌می", noteFa:"از نشانگرهای رابط کاربری برای پیدا کردن مقصد استفاده کن.", noteEn:"Use the interface markers to find the required destination." },
  { id:"c1-m16", chapter:1, name:"Save for the Future", fa:"برای آینده پس‌انداز کن", noteFa:"پیشرفت هدف را در رابط بازی بررسی کن و در صورت نیاز فعالیت‌های در دسترس را کامل کن.", noteEn:"Check objective progress in the game interface and complete available activities if needed." },
  { id:"c1-m17", chapter:1, name:"Clear Skies", fa:"آسمان صاف", noteFa:"قبل از حرکت، مسیر و مقصد را روی نقشه مشخص کن.", noteEn:"Set the route and destination on the map before setting out." },
  { id:"c1-m18", chapter:1, name:"Building a Life", fa:"ساختن یک زندگی", noteFa:"به اعلان‌های شخصیت‌ها و فعالیت‌های تازه بازشده توجه کن.", noteEn:"Watch for character notifications and newly unlocked activities." },
  { id:"c1-m19", chapter:1, name:"Day Release", fa:"مرخصی روزانه", noteFa:"زمان و مقصد قرارها را از پیام‌ها و نشانگرهای نقشه دنبال کن.", noteEn:"Use messages and map markers to follow appointment times and destinations." },
  { id:"c1-m20", chapter:1, name:"Swamped", fa:"گرفتار در باتلاق", noteFa:"در محیط طبیعی با دقت مسیر را دنبال کن و از نشانگرهای راهنما کمک بگیر.", noteEn:"Navigate the natural environment carefully and use the route markers." },
  { id:"c1-m21", chapter:1, name:"Don Gone", fa:"دانی رفته", noteFa:"نقطه شروع و مقصد را در نقشه تطبیق بده.", noteEn:"Match the starting point and destination on the map." },
  { id:"c1-m22", chapter:1, name:"Donnie's Lost Drugs", fa:"—", noteFa:"برای حفظ تمرکز راهنما، جزئیات این مأموریت در این نسخه نمایش داده نمی‌شود.", noteEn:"Details for this mission are omitted from this guide edition." },
  { id:"c1-m23", chapter:1, name:"Recalibration", fa:"تنظیم دوباره", noteFa:"گفت‌وگوی شخصیت‌ها و پیام‌های جدید را بررسی کن.", noteEn:"Review character conversations and new messages." },
  { id:"c1-m24", chapter:1, name:"Tourist Trap", fa:"دام گردشگری", noteFa:"مسیر مقصد را روی نقشه دنبال کن و برای نقاط توقف وقت بگذار.", noteEn:"Follow the destination route and allow time for marked stops." },
  { id:"c1-m25", chapter:1, name:"Home Sweet Home", fa:"خانه شیرین خانه", noteFa:"پس از رسیدن به مقصد، اعلان‌های تکمیل هدف را بررسی کن.", noteEn:"Once you reach the destination, check the objective-completion prompts." },
  { id:"c1-m26", chapter:1, name:"Discharge Time", fa:"زمان ترخیص", noteFa:"پیش از ادامه داستان، پیشرفت فصل و مکان‌های ذخیره‌شده را مرور کن.", noteEn:"Before continuing, review chapter progress and your saved locations." },
];

const STORE = "gta6-story-progress-v1";
function readDone(): Set<string> {
  try { return new Set<string>(JSON.parse(localStorage.getItem(STORE) ?? "[]") as string[]); }
  catch { return new Set<string>(); }
}
export function initMissionGuide(): void {
  const root = qs<HTMLElement>("[data-mission-list]");
  if (!root) return;
  const search = qs<HTMLInputElement>("[data-mission-search]");
  const chapter = qs<HTMLSelectElement>("[data-mission-chapter]");
  const done = readDone();
  const isEnglish = (): boolean => document.documentElement.lang === "en";
  const chapters = [{id:1,fa:"فصل ۱ · Just Like Paradise",en:"Chapter 1 · Just Like Paradise"}];
  if (chapter) chapter.innerHTML += chapters.map(c => `<option value="${c.id}">${isEnglish()?c.en:c.fa}</option>`).join("");
  const render = (): void => {
    const q = (search?.value ?? "").trim().toLowerCase();
    const c = chapter?.value ?? "all";
    const visible = missions.filter(m => (c === "all" || String(m.chapter) === c) && (!q || `${m.name} ${m.fa} ${m.noteFa}`.toLowerCase().includes(q)));
    const title = isEnglish() ? "Chapter 1 · Just Like Paradise" : "فصل اول · Just Like Paradise";
    root.innerHTML = `<section class="mission-chapter"><header><div><span>CHAPTER 01</span><h3>${title}</h3></div><small>${visible.filter(m=>done.has(m.id)).length} / ${visible.length}</small></header><div class="mission-items">${visible.map(m => `<article class="mission-item ${done.has(m.id)?"is-done":""}"><label class="mission-check"><input type="checkbox" data-mission-id="${m.id}" ${done.has(m.id)?"checked":""}><span></span></label><div class="mission-item-copy"><div class="mission-item-title"><b>${m.name}</b><small>${m.fa}</small></div><p>${isEnglish()?m.noteEn:m.noteFa}</p></div><span class="mission-state">${done.has(m.id)?(isEnglish()?"DONE":"انجام شد"):(isEnglish()?"STORY":"داستان")}</span></article>`).join("") || `<p class="mission-empty">${isEnglish()?"No missions match this search.":"مأموریتی با این جست‌وجو پیدا نشد."}</p>`}</div></section>`;
    root.querySelectorAll<HTMLInputElement>("[data-mission-id]").forEach(input => input.addEventListener("change", () => {
      const id = input.dataset.missionId!;
      if (input.checked) done.add(id); else done.delete(id);
      localStorage.setItem(STORE, JSON.stringify([...done]));
      render();
      updateProgress();
    }));
  };
  const updateProgress = (): void => {
    const total = missions.length;
    const completed = missions.filter(m=>done.has(m.id)).length;
    const percent = Math.round(completed/total*100);
    const p = qs<HTMLElement>("[data-mission-progress]");
    const bar = qs<HTMLElement>("[data-mission-progress-bar]");
    const d = qs<HTMLElement>("[data-mission-done]");
    const t = qs<HTMLElement>("[data-mission-total]");
    if(p) p.textContent = `${percent}${isEnglish()?"%":"٪"}`;
    if(bar) bar.style.width = `${percent}%`;
    if(d) d.textContent = String(completed);
    if(t) t.textContent = String(total);
  };
  search?.addEventListener("input", render);
  chapter?.addEventListener("change", render);
  qs<HTMLButtonElement>("[data-mission-reset]")?.addEventListener("click", () => {
    if (!confirm(isEnglish()?"Reset all mission progress?":"همه پیشرفت مأموریت‌ها پاک شود؟")) return;
    done.clear(); localStorage.removeItem(STORE); render(); updateProgress();
  });
  window.addEventListener("gta-language-change", () => { if(chapter) chapter.options[0]!.text = isEnglish()?"All chapters":"همه فصل‌ها"; render(); updateProgress(); });
  render(); updateProgress();
}
