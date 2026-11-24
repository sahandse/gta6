interface NavItem {
  id: string;
  href: string;
  label: string;
  thumb: string;
}

const navItems: NavItem[] = [
  { id: "home", href: "index.html", label: "خانه", thumb: "home" },
  { id: "map", href: "map.html", label: "نقشه لئونیدا", thumb: "map" },
  { id: "vehicles", href: "vehicles.html", label: "وسایل نقلیه", thumb: "vehicles" },
  { id: "characters", href: "characters.html", label: "شخصیت‌ها", thumb: "characters" },
  { id: "weapons", href: "weapons.html", label: "سلاح‌ها", thumb: "weapons" },
  { id: "news", href: "news.html", label: "اخبار", thumb: "news" },
  { id: "cheats", href: "cheats.html", label: "چیت‌ها", thumb: "cheats" },
  { id: "resources", href: "resources.html", label: "منابع", thumb: "resources" },
];

const footerLinks: Record<string, NavItem[]> = {
  database: [
    navItems[2]!,
    navItems[3]!,
    navItems[4]!,
    navItems[1]!,
  ],
  guides: [navItems[5]!, navItems[6]!, navItems[7]!],
};

function thumb(item: NavItem): string {
  return `<span class="nav-thumb nav-thumb--${item.thumb}" aria-hidden="true"></span>`;
}

function navLink(item: NavItem, page: string): string {
  const active = item.id === page ? ' class="active" aria-current="page"' : "";
  return `<a href="${item.href}"${active}>${thumb(item)}<span>${item.label}</span></a>`;
}

export function header(page: string): string {
  return `<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="index.html" aria-label="GTA VI HUB">GTA <b>VI</b> HUB</a>
    <nav class="nav-links" id="mainnav" aria-label="ناوبری اصلی">
      ${navItems.map((item) => navLink(item, page)).join("\n      ")}
    </nav>
    <div class="nav-tools">
      <label class="search-wrap" aria-label="جست‌وجو">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="جست‌وجو…" aria-label="جست‌وجو" data-global-search>
      </label>
      <button class="menu-toggle" type="button" aria-label="باز کردن منو" aria-expanded="false" aria-controls="mainnav">☰</button>
    </div>
  </div>
</header>`;
}

function footerLink(item: NavItem): string {
  return `<li><a href="${item.href}">${thumb(item)}<span>${item.label}</span></a></li>`;
}

export function footer(): string {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html" aria-label="GTA VI HUB">GTA <b>VI</b> HUB</a>
        <p class="footer-about">یک پروژه‌ی هواداری مستقل برای مستندسازی دنیای Grand Theft Auto VI و ایالت لئونیدا.</p>
      </div>
      <div>
        <h5>دیتابیس</h5>
        <ul>${footerLinks.database!.map(footerLink).join("")}</ul>
      </div>
      <div>
        <h5>راهنما</h5>
        <ul>${footerLinks.guides!.map(footerLink).join("")}</ul>
      </div>
      <div>
        <h5>درباره</h5>
        <ul>
          <li><a href="https://github.com/sahandse/gta6" target="_blank" rel="noopener">مخزن GitHub</a></li>
          <li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener">سایت رسمی</a></li>
          <li><a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener">گالری رسمی</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> GTA VI HUB — ساخته‌شده با ❤️ برای جامعه‌ی GTA.</span>
      <span>پروژه‌ی هواداری؛ تصاویر و علائم تجاری متعلق به Rockstar Games است.</span>
    </div>
  </div>
</footer>`;
}
