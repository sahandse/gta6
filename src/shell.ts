interface NavItem {
  id: string;
  href: string;
  label: string;
  en: string;
  thumb: string;
}

const navItems: NavItem[] = [
  { id: "home", href: "index.html", label: "خانه", en: "Home", thumb: "home" },
  { id: "map", href: "map.html", label: "نقشه لئونیدا", en: "Leonida Map", thumb: "map" },
  { id: "vehicles", href: "vehicles.html", label: "وسایل نقلیه", en: "Vehicles", thumb: "vehicles" },
  { id: "characters", href: "characters.html", label: "شخصیت‌ها", en: "Characters", thumb: "characters" },
  
  { id: "news", href: "news.html", label: "اخبار", en: "News", thumb: "news" },
  { id: "guides", href: "guides.html", label: "راهنمای مأموریت", en: "Mission Guide", thumb: "guides" },
  { id: "resources", href: "resources.html", label: "منابع", en: "Resources", thumb: "resources" },
];

const footerLinks: Record<string, NavItem[]> = {
  database: [
    navItems[2]!,
    navItems[3]!,
    navItems[1]!,
  ],
  guides: [navItems[5]!, navItems[6]!],
};

function thumb(item: NavItem): string {
  return `<span class="nav-thumb nav-thumb--${item.thumb}" aria-hidden="true"></span>`;
}

function navLink(item: NavItem, page: string): string {
  const active = item.id === page ? ' class="active" aria-current="page"' : "";
  return `<a href="${item.href}"${active}>${thumb(item)}<span data-fa="${item.label}" data-en="${item.en}">${item.label}</span></a>`;
}

export function header(page: string): string {
  return `<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="index.html" aria-label="GTA VI HUB"><span class="brand-mark">VI</span><span class="brand-word">GTA <b>VI</b> HUB</span></a>
    <nav class="nav-links" id="mainnav" aria-label="ناوبری اصلی">
      ${navItems.map((item) => navLink(item, page)).join("\n      ")}
    </nav>
    <div class="nav-tools">
      <label class="search-wrap" aria-label="جست‌وجو">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="جست‌وجو…" aria-label="جست‌وجو" data-global-search>
      </label>
      <button class="language-toggle" type="button" data-language-toggle aria-label="Switch language">EN</button>
      <button class="menu-toggle" type="button" aria-label="باز کردن منوی بازی" aria-expanded="false" aria-controls="mainnav"><span aria-hidden="true">☰</span><span data-fa="منوی بازی" data-en="GAME MENU">منوی بازی</span></button>
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
        <h5 data-fa="درباره" data-en="About">درباره</h5>
        <ul>
          <li><a href="https://github.com/sahandse/gta6" target="_blank" rel="noopener">مخزن GitHub</a></li>
          <li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener">سایت رسمی</a></li>
          <li><a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener">گالری رسمی</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> GTA VI HUB — ساخته‌شده با ❤️ برای جامعه‌ی GTA.</span>
      <span data-fa="پروژه‌ی هواداری مستقل؛ وابسته به Rockstar Games نیست." data-en="Independent fan project; not affiliated with Rockstar Games.">پروژه‌ی هواداری مستقل؛ وابسته به Rockstar Games نیست.</span>
    </div>
  </div>
</footer>`;
}
