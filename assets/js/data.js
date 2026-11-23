/* ============================================================
   GTA VI HUB — dataset (fan-made, edit freely)
   ============================================================ */

const GTA6 = {
  meta: {
    game: "Grand Theft Auto VI",
    state: "State of Leonida",
    city: "Vice City",
    release: "May 26, 2026",
    platforms: ["PS5", "Xbox Series X|S"],
    studio: "Rockstar Games",
  },

  vehicles: [
    { name: "Vapid Dominator GTT", cls: "Muscle", maker: "Vapid", speed: 88, handling: 71, price: "$1,240,000", tags: ["نسل جدید", "قابل شخصی‌سازی"], color: ["#ff2d95", "#8a5cff"] },
    { name: "Grotti Turismo Omaggio", cls: "Super", maker: "Grotti", speed: 96, handling: 89, price: "$2,980,000", tags: ["کلاس S", "درفت"], color: ["#ff8a00", "#ff2d95"] },
    { name: "Pfister 811 Leonida", cls: "Super", maker: "Pfister", speed: 98, handling: 84, price: "$3,450,000", tags: ["سریع‌ترین", "برقی"], color: ["#22e0ff", "#8a5cff"] },
    { name: "Bravado Banshee V6", cls: "Sports", maker: "Bravado", speed: 84, handling: 80, price: "$980,000", tags: ["متعادل", "شهری"], color: ["#37f5a1", "#22e0ff"] },
    { name: "Pegassi Zentorno X", cls: "Super", maker: "Pegassi", speed: 95, handling: 92, price: "$3,100,000", tags: ["هندلینگ بالا"], color: ["#ffd166", "#ff8a00"] },
    { name: "Declasse Sabre Turbo", cls: "Muscle", maker: "Declasse", speed: 82, handling: 68, price: "$640,000", tags: ["کلاسیک", "درگ"], color: ["#ff2d95", "#ff8a00"] },
    { name: "Karin Sultan RS", cls: "Sports", maker: "Karin", speed: 87, handling: 86, price: "$1,420,000", tags: ["رالی", "AWD"], color: ["#22e0ff", "#37f5a1"] },
    { name: "Obey Tailgater S", cls: "Sedan", maker: "Obey", speed: 74, handling: 78, price: "$520,000", tags: ["لوکس", "چهار درب"], color: ["#8a5cff", "#ff2d95"] },
    { name: "Vapid Sandking XL", cls: "SUV", maker: "Vapid", speed: 66, handling: 60, price: "$890,000", tags: ["آفرود", "ساحلی"], color: ["#ff8a00", "#ffd166"] },
    { name: "Nagasaki Blazer Aqua", cls: "Off-road", maker: "Nagasaki", speed: 72, handling: 65, price: "$740,000", tags: ["آبی-خاکی", "اورجینال"], color: ["#37f5a1", "#22e0ff"] },
    { name: "Shitzu Jetmax", cls: "Boat", maker: "Shitzu", speed: 79, handling: 70, price: "$690,000", tags: ["قایق", "مسابقه آبی"], color: ["#22e0ff", "#ff8a00"] },
    { name: "Maverick Delta", cls: "Helicopter", maker: "Maverick", speed: 76, handling: 74, price: "$1,780,000", tags: ["هلیکوپتر", "گشت"], color: ["#8a5cff", "#22e0ff"] },
    { name: "Dinka Double-T Leonida", cls: "Motorcycle", maker: "Dinka", speed: 91, handling: 77, price: "$430,000", tags: ["موتور", "خیابانی"], color: ["#ff2d95", "#ffd166"] },
    { name: "MTL Brickade 6x6", cls: "Commercial", maker: "MTL", speed: 55, handling: 48, price: "$2,150,000", tags: ["زره‌پوش", "کاروان"], color: ["#ff8a00", "#ff2d95"] },
  ],

  characters: [
    { name: "Lucia Caminos", role: "قهرمان اصلی", bio: "زنی جسور از محله‌های حاشیه‌ای Vice City که برای آزادی و ساختن یک زندگی تازه، دست به هر کاری می‌زند.", initials: "LC", color: ["#ff2d95", "#ff8a00"], stats: { "جرأت": 92, "رانندگی": 78, "تیراندازی": 84 } },
    { name: "Jason Duval", role: "قهرمان اصلی", bio: "یک ماجراجوی آرام‌طبع که به همراه Lucia وارد مسیر خطرناکی می‌شود؛ متخصص رانندگی و کارهای میدانی.", initials: "JD", color: ["#22e0ff", "#8a5cff"], stats: { "جرأت": 84, "رانندگی": 90, "تیراندازی": 80 } },
    { name: "Boobie", role: "شخصیت مکمل", bio: "چهره‌ی آشنا و خوش‌مشرب محله؛ رابط بین خیابان و بازارهای سیاه Leonida.", initials: "BB", color: ["#ffd166", "#ff8a00"], stats: { "جرأت": 60, "رانندگی": 55, "تیراندازی": 48 } },
    { name: "Dre'Quan Priest", role: "شخصیت مکمل", bio: "یکی از اعضای قدیمی گروه‌های خیابانی که برای کنترل بازار جدید تحت فشار است.", initials: "DP", color: ["#8a5cff", "#ff2d95"], stats: { "جرأت": 75, "رانندگی": 62, "تیراندازی": 70 } },
    { name: "Cal Hampton", role: "همکار", bio: "متخصص فناوری و اطلاعات؛ تماس‌های خرابکارانه و مسیرهای پنهان شهر را می‌شناسد.", initials: "CH", color: ["#37f5a1", "#22e0ff"], stats: { "جرأت": 45, "رانندگی": 58, "تیراندازی": 40 } },
    { name: "Raul Bautista", role: "کارفرما", bio: "مردی با ارتباطات گسترده در دنیای پول و قدرت Vice City که برای افرادش مأموریت تعریف می‌کند.", initials: "RB", color: ["#ff8a00", "#ffd166"], stats: { "جرأت": 68, "رانندگی": 60, "تیراندازی": 65 } },
  ],

  locations: [
    { name: "Vice City Beach", region: "Vice City", x: 66, y: 62, icon: "🏖️", desc: "خط ساحلی نمادین با هتل‌های هنر دکو، توریست‌ها و مسیرهای مسابقه‌ی شبانه." },
    { name: "Downtown Vice", region: "Vice City", x: 58, y: 44, icon: "🏙️", desc: "قلب تجاری شهر؛ آسمان‌خراش‌ها، پارکینگ‌های چندطبقه و فرصت‌های بزرگ." },
    { name: "Little Havana", region: "Vice City", x: 46, y: 55, icon: "🌴", desc: "محله‌ی گرم و پرجنب‌وجوش با کافه‌های کوبایی و بازارهای محلی." },
    { name: "Port Gellhorn", region: "Leonida", x: 30, y: 36, icon: "⚓", desc: "بندر صنعتی و مسیرهای قاچاق؛ بهترین جا برای کارهای شبانه." },
    { name: "Leonida Keys", region: "Leonida", x: 76, y: 84, icon: "🏝️", desc: "زنجیره‌ای از جزایر مرجانی، پل‌های طولانی و آب‌های فیروزه‌ای." },
    { name: "Grassrivers", region: "Leonida", x: 40, y: 20, icon: "🐊", desc: "تالاب‌های وحشی با حیات‌وحش خطرناک و شکارهای غیرقانونی." },
    { name: "Mount Kalaga", region: "Leonida", x: 18, y: 62, icon: "⛰️", desc: "ارتفاعات شمالی، جاده‌های پیچ‌درپیچ و مناظر خیره‌کننده برای آفرود." },
    { name: "Ambrosia", region: "Leonida", x: 52, y: 76, icon: "🏭", desc: "شهرک صنعتی کوچک با کارخانه‌های متروکه و داستان‌های فراموش‌شده." },
    { name: "Watson Bay", region: "Leonida", x: 84, y: 44, icon: "🚤", desc: "خلیج آرام برای قایق‌سواری، ماهیگیری و مسابقات آبی." },
  ],

  weapons: [
    { name: "Pistol Mk II", cat: "Handgun", dmg: 35, rate: 55, range: 40, desc: "کلاسیک و قابل‌اعتماد؛ انتخاب اول برای هر مأموریت." },
    { name: "Micro SMG", cat: "SMG", dmg: 28, rate: 88, range: 32, desc: "سرعت شلیک بالا، مناسب درگیری‌های نزدیک." },
    { name: "Assault Rifle", cat: "Rifle", dmg: 62, rate: 70, range: 74, desc: "تعادل کامل بین دقت و قدرت؛ همه‌کاره." },
    { name: "Sniper Rifle", cat: "Sniper", dmg: 96, rate: 18, range: 98, desc: "برای فاصله‌های بلند و شلیک‌های تک‌ضربه." },
    { name: "Combat Shotgun", cat: "Shotgun", dmg: 84, rate: 40, range: 22, desc: "قدرت تخریب بالا در فضای بسته." },
    { name: "Grenade Launcher", cat: "Heavy", dmg: 98, rate: 20, range: 55, desc: "برای باز کردن راه‌های بسته و خرابکاری حساب‌شده." },
    { name: "Stun Gun", cat: "Utility", dmg: 8, rate: 45, range: 18, desc: "غیرکشنده؛ برای مأموریت‌های مخفیانه." },
    { name: "Molotov Cocktail", cat: "Thrown", dmg: 70, rate: 25, range: 26, desc: "ارزان، سریع و همیشه در دسترس." },
  ],

  news: [
    { title: "نقشه‌ی تعاملی Leonida منتشر شد: همه‌ی مناطق قابل کشف", cat: "GTA 6", date: "۲ روز پیش", read: "۴ دقیقه", glyph: "MAP", color: ["#22e0ff", "#8a5cff"], excerpt: "نسخه‌ی جدید نقشه با جزئیات کامل سواحل، جاده‌ها و نقاط مخفی؛ همراه با فیلتر دسته‌بندی." },
    { title: "بررسی کامل سیستم رانندگی: فیزیک جدید و حس وزن", cat: "تحلیل", date: "۴ روز پیش", read: "۷ دقیقه", glyph: "DRV", color: ["#ff2d95", "#ff8a00"], excerpt: "Rockstar از فیزیک ارتقایافته‌ی وسایل نقلیه پرده برداشت؛ آنچه در ۳۰ ساعت بازی دیدیم." },
    { title: "همه‌چیز درباره‌ی حالت Co-op و مأموریت‌های دو نفره", cat: "راهنما", date: "۱ هفته پیش", read: "۵ دقیقه", glyph: "CO-OP", color: ["#37f5a1", "#22e0ff"], excerpt: "چطور با دوستتان داستان را جلو ببرید و کدام مأموریت‌ها واقعاً دونفره طراحی شده‌اند." },
    { title: "لیست کامل وسایل نقلیه‌ی تأییدشده تا امروز", cat: "دیتابیس", date: "۱ هفته پیش", read: "۹ دقیقه", glyph: "CAR", color: ["#ff8a00", "#ffd166"], excerpt: "از سوپر اسپرت‌های برقی تا قایق‌های مسابقه‌ای؛ با مشخصات و قیمت تقریبی." },
    { title: "راهنمای ۱۰۰٪ تکمیل: چک‌لیست مأموریت‌های فرعی", cat: "راهنما", date: "۲ هفته پیش", read: "۱۲ دقیقه", glyph: "100", color: ["#8a5cff", "#ff2d95"], excerpt: "تمام کارهای جانبی، حیوانات کمیاب و رویدادهای تصادفی که برای ۱۰۰٪ لازم است." },
    { title: "تنظیمات گرافیکی پیشنهادی برای PS5 و Xbox", cat: "فنی", date: "۲ هفته پیش", read: "۶ دقیقه", glyph: "4K", color: ["#22e0ff", "#37f5a1"], excerpt: "حالت Performance یا Quality؟ مقایسه‌ی نرخ فریم و کیفیت تصویر در هر دو کنسول." },
  ],

  cheats: [
    { code: "TURTLE", platform: "PS5", effect: "بازی را ۲۵٪ آهسته می‌کند" },
    { code: "SKYFALL", platform: "PS5", effect: "آسمان را تغییر می‌دهد" },
    { code: "VICECITY", platform: "Xbox", effect: "حالت آب‌وهوای بارانی" },
    { code: "LEONIDA", platform: "Xbox", effect: "همه‌ی مکان‌ها را باز می‌کند" },
    { code: "FULLCLIP", platform: "هر دو", effect: "مهمات بی‌نهایت" },
    { code: "WANTED", platform: "هر دو", effect: "سطح تعقیب را صفر می‌کند" },
  ],
};
