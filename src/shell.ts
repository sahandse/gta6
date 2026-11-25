interface NavItem {
  id: string;
  href: string;
  label: string;
  en: string;
  thumb: string;
  description: string;
  enDescription: string;
}

interface NavGroup {
  id: string;
  label: string;
  en: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  { id: "world", label: "جهان لئونیدا", en: "LEONIDA WORLD", items: [
    { id: "map", href: "map.html", label: "نقشه تعاملی", en: "Interactive map", thumb: "map", description: "کاوش مناطق و مکان‌ها", enDescription: "Explore regions and mapped places" },
    { id: "database", href: "map.html#database", label: "بانک مکان‌ها", en: "Place database", thumb: "regions", description: "جست‌وجو در فهرست مکان‌ها", enDescription: "Search the place catalogue" },
    { id: "progress", href: "map.html#progress", label: "پیشرفت اکتشاف", en: "Exploration progress", thumb: "map", description: "بازدیدها و علاقه‌مندی‌ها", enDescription: "Visited places and saved favorites" },
  ]},
  { id: "story", label: "داستان و شخصیت‌ها", en: "STORY & PEOPLE", items: [
    { id: "guides", href: "guides.html", label: "راهنمای مأموریت", en: "Mission guide", thumb: "guides", description: "چک‌لیست و پیگیری داستان", enDescription: "Story checklist and progress" },
    { id: "characters", href: "characters.html", label: "شخصیت‌ها", en: "Characters", thumb: "characters", description: "پروفایل چهره‌های شناخته‌شده", enDescription: "Profiles of revealed characters" },
  ]},
  { id: "garage", label: "گاراژ و آرشیو", en: "GARAGE & ARCHIVE", items: [
    { id: "vehicles", href: "vehicles.html", label: "دیتابیس وسایل نقلیه", en: "Vehicle database", thumb: "vehicles", description: "فیلتر و مقایسه مشخصات ثبت‌شده", enDescription: "Browse and filter listed vehicles" },
    { id: "news", href: "news.html", label: "اخبار و یادداشت‌ها", en: "News & notes", thumb: "news", description: "مطالب و تحلیل‌های گردآوری‌شده", enDescription: "Collected articles and commentary" },
    { id: "resources", href: "resources.html", label: "منابع و مراجع", en: "Sources & resources", thumb: "resources", description: "لینک منابع و ابزارهای مرتبط", enDescription: "Reference links and related tools" },
  ]},
];

const allItems = navGroups.flatMap((group) => group.items);
const footerLinks: Record<string, NavItem[]> = {
  database: [allItems[5]!, allItems[1]!, allItems[0]!],
  guides: [allItems[3]!, allItems[4]!],
};

function thumb(item: NavItem): string {
  return `<span class="nav-thumb nav-thumb--${item.thumb}" aria-hidden="true"></span>`;
}

function navLink(item: NavItem, page: string): string {
  const active = item.id === page ? ' class="active" aria-current="page"' : "";
  return `<a href="${item.href}"${active}> ${thumb(item)}<span class="nav-link-copy"><b data-fa="${item.label}" data-en="${item.en}">${item.label}</b><small data-fa="${item.description}" data-en="${item.enDescription}">${item.description}</small></span></a>`;
}

export function header(page: string): string {
  return `<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="index.html" aria-label="GTA VI HUB"><span class="brand-mark">VI</span><span class="brand-word">GTA <b>VI</b> HUB</span></a>
    <nav class="nav-links" id="mainnav" aria-label="ناوبری اصلی">
      <div class="nav-menu-head"><span data-fa="منوی اصلی لئونیدا" data-en="LEONIDA MAIN MENU">منوی اصلی لئونیدا</span><small>GRAND THEFT AUTO VI / FAN REFERENCE</small></div>
      ${navGroups.map((group) => `<section class="nav-menu-group nav-menu-group--${group.id}"><h3><span data-fa="${group.label}" data-en="${group.en}">${group.label}</span><i>0${navGroups.indexOf(group)+1}</i></h3>${group.items.map((item) => navLink(item, page)).join("")}</section>`).join("")}
      <a class="nav-official-link" href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener"><span>↗</span><b data-fa="رسانه رسمی Rockstar" data-en="Official Rockstar media">رسانه رسمی Rockstar</b></a>
    </nav>
    <div class="nav-tools">
      <label class="search-wrap" aria-label="جست‌وجو">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="جست‌وجو…" aria-label="جست‌وجو" data-global-search>
      </label>
      <button class="language-toggle" type="button" data-language-toggle aria-label="Switch language">EN</button>
      <button class="menu-toggle" type="button" aria-label="باز کردن منوی اصلی" aria-expanded="false" aria-controls="mainnav"><span aria-hidden="true">☰</span><span data-fa="منوی اصلی" data-en="MAIN MENU">منوی اصلی</span></button>
    </div>
  </div>
</header>`;
}

function footerLink(item: NavItem): string {
  return `<li><a href="${item.href}">${thumb(item)}<span data-fa="${item.label}" data-en="${item.en}">${item.label}</span></a></li>`;
}

export function footer(): string {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html" aria-label="GTA VI HUB"><span class="brand-mark">VI</span><span class="brand-word">GTA <b>VI</b> HUB</span></a>
        <p class="footer-about" data-fa="یک پروژه‌ی هواداری مستقل برای مستندسازی دنیای Grand Theft Auto VI و ایالت لئونیدا." data-en="An independent fan-made reference hub for Grand Theft Auto VI and the state of Leonida.">یک پروژه‌ی هواداری مستقل برای مستندسازی دنیای Grand Theft Auto VI و ایالت لئونیدا.</p>
      </div>
      <div>
        <h5 data-fa="دیتابیس" data-en="Database">دیتابیس</h5>
        <ul>${footerLinks.database!.map(footerLink).join("")}</ul>
      </div>
      <div>
        <h5 data-fa="راهنماها" data-en="Guides">راهنماها</h5>
        <ul>${footerLinks.guides!.map(footerLink).join("")}</ul>
      </div>
      <div>
        <h5 data-fa="منابع رسمی" data-en="Official sources">منابع رسمی</h5>
        <ul>
          <li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener">Rockstar Games — GTA VI</a></li>
          <li><a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener">Official media</a></li>
          <li><a href="https://github.com/sahandse/gta6" target="_blank" rel="noopener">GitHub repository</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> GTA VI HUB — ساخته‌شده برای جامعه‌ی GTA.</span>
      <span data-fa="پروژه‌ی هواداری مستقل؛ وابسته به Rockstar Games نیست." data-en="Independent fan project; not affiliated with Rockstar Games.">پروژه‌ی هواداری مستقل؛ وابسته به Rockstar Games نیست.</span>
    </div>
  </div>
</footer>`;
}
