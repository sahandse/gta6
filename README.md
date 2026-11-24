# GTA VI HUB 🎮🌴

یک وب‌سایت هواداری کامل و **کاملاً رسپانسیو** برای دنیای *Grand Theft Auto VI* — با تم نئونی Vice City (صورتی/نارنجی/فیروزه‌ای)، رابط راست‌به‌چپ فارسی و تصاویر رسمی بهینه‌شده.

A fully responsive GTA 6 fan hub built with **TypeScript + Vite**: interactive Leonida map, vehicle database, character profiles, weapon stats, news, cheats and a designer resource library.

## ✨ امکانات

| بخش | توضیح |
| --- | --- |
| **خانه** | هیرو تصویری، شمارنده‌های متحرک، جست‌وجوی بخش‌ها، آخرین اخبار، خودروهای شاخص، چیت‌های پرکاربرد |
| **وسایل نقلیه** | دیتابیس ۱۴ خودرو با جست‌وجوی زنده، فیلتر کلاس، مرتب‌سازی بر اساس سرعت/هندلینگ/نام و نوار آمار |
| **نقشه تعاملی** | بیش از ۱۰۰۰ مکان نام‌گذاری‌شده از Open GTA 6 Map، کاشی‌های روز و شب، فیلتر دسته و ناحیه، مرز ناحیه‌ها، خوشه‌بندی نشانگرها، علاقه‌مندی، بازدیدشده‌ها، مسیر مستقیم تقریبی، حالت روشن/تیره و پشتیبان‌گیری JSON |
| **شخصیت‌ها** | پروفایل Lucia، Jason و دیگر چهره‌های داستان با زندگینامه و آمار |
| **سلاح‌ها** | مقایسه‌ی قدرت، سرعت شلیک و برد هر سلاح |
| **اخبار** | فهرست اخبار با فیلتر دسته‌بندی و جست‌وجو |
| **چیت‌ها** | کدهای PS5/Xbox با دکمه‌ی کپی یک‌کلیکی |
| **منابع** | ۲۱ ابزار منتخب طراحی (Motion، Anime.js، shadcn/ui، Magic UI، Mobbin، Spline و…) با فیلتر، جست‌وجو و لایسنس |

## 🧱 تکنولوژی

- **TypeScript** با تنظیمات strict — بدون فریم‌ورک UI
- **Vite 7** به‌صورت Multi-Page App با ۸ ورودی HTML و `base: "./"` (سازگار با GitHub Pages)
- **Leaflet + Leaflet.markercluster** برای نقشه‌ی تعاملی
- هدر و فوتر مشترک در زمان build با یک پلاگین `transformIndexHtml` تزریق می‌شوند
- تصاویر رسمی Rockstar به‌صورت محلی با `sharp` به WebP بهینه می‌شوند و هرگز از CDN میزبان اصلی hotlink نمی‌شوند
- طراحی **RTL** با فونت‌های Vazirmatn و Chakra Petch

## 📁 ساختار

```
.
├── index.html … resources.html   # ۸ صفحه‌ی ورودی (فقط محتوای main + توکن‌های shell)
├── vite.config.ts                # ورودی‌های MPA + پلاگین تزریق هدر/فوتر
├── src/
│   ├── main.ts                   # نقطه‌ی ورود؛ راه‌اندازی ماژول‌ها
│   ├── shell.ts                  # هدر، فوتر و لینک‌های ناوبری
│   ├── types.ts                  # تایپ‌های مشترک داده‌ها
│   ├── data/
│   │   ├── site.ts               # خودروها، شخصیت‌ها، سلاح‌ها، اخبار، چیت‌ها
│   │   └── resources.ts          # فهرست ابزارها و منابع
│   ├── features/                 # رندر و تعامل هر بخش (vehicles، map، news، …)
│   ├── lib/
│   │   ├── dom.ts                # کمک‌تابع‌های DOM و قالب‌بندی
│   │   └── media.ts              # رجیستری تصاویر با import.meta.glob
│   ├── styles/                   # CSS لایه‌بندی‌شده (site.css ترتیب @import)
│   └── assets/images/            # تصاویر WebP تولیدشده (نباید دستی ویرایش شود)
├── public/
│   └── assets/data/              # places.json، districts.json و منابع نقشه
└── scripts/build-images.mjs      # دانلود رسانه‌ی رسمی + تولید WebP و بندانگشتی ناوبری
```

## 🚀 اجرا

```bash
npm install
npm run dev        # سرور توسعه
npm run build      # typecheck + build در dist/
npm run preview    # پیش‌نمایش خروجی build
npm run typecheck  # فقط بررسی تایپ‌ها
npm run images     # بازتولید تصاویر WebP از رسانه‌ی رسمی Rockstar
```

> `npm run images` به اینترنت نیاز دارد و فقط زمانی اجرا می‌شود که بخواهید تصاویر را از نو بسازید. فایل‌های تولیدشده در `src/assets/images` کامیت می‌شوند.

## 🌐 انتشار روی GitHub Pages

انتشار به‌صورت خودکار با GitHub Actions انجام می‌شود:

1. در تنظیمات مخزن → **Pages**، گزینه‌ی Source را روی **GitHub Actions** بگذارید.
2. هر push روی `main` وارد `.github/workflows/deploy.yml` می‌شود: `npm ci` → `npm run build` → آپلود `dist` → انتشار.
3. سایت روی `https://sahandse.github.io/gta6/` در دسترس خواهد بود.

`ci.yml` نیز روی pull requestها و برنچ‌های غیر `main` فقط typecheck و build را اجرا می‌کند.

## ✏️ ویرایش داده‌ها

محتوای سایت در `src/data/` تایپ‌شده است. برای افزودن خودرو به `src/data/site.ts`:

```ts
{
  name: "اسم ماشین",
  cls: "Super",
  maker: "برند",
  speed: 95,
  handling: 88,
  price: "$2,000,000",
  tags: ["تگ"],
  color: ["#ff2d95", "#ff8a00"],
  image: "vehicles/example",
}
```

مقدار `image` به کلید فایل در `src/assets/images` اشاره می‌کند (بدون عرض و پسوند)؛ عرض‌های موجود به‌صورت خودکار با `srcset` انتخاب می‌شوند. برای افزودن منبع جدید به صفحه‌ی منابع، یک آیتم به دسته‌ی مناسب در `src/data/resources.ts` اضافه کنید:

```ts
{
  name: "Tool",
  fa: "نام فارسی",
  desc: "توضیح کوتاه",
  url: "https://example.com",
  license: "MIT · رایگان",
  tag: "free", // یا "freemium"
}
```

## ⚠️ سلب مسئولیت

این پروژه یک **پروژه‌ی هواداری مستقل** است و هیچ وابستگی به Rockstar Games یا Take-Two Interactive ندارد. تمام علائم تجاری و دارایی‌های بازی متعلق به صاحبان اصلی آن‌هاست. محتوای این سایت نمونه/نمایشی است.

### نقشه تعاملی و دیتابیس مکان‌ها

- دیتابیس مکان‌ها: `public/assets/data/places.json` — ۱٬۰۱۱ رکورد نام‌گذاری‌شده از Open GTA 6 Map.
- مرزهای ناحیه: `public/assets/data/districts.json` — مرزهای جامعه‌محور و تقریبی.
- داده و کاشی‌های نقشه با مجوز **CC BY 4.0** از [Open GTA 6 Map](https://github.com/fbritoferreira/gta6) استفاده شده‌اند. اعتباردهی در خود نقشه و فایل `public/assets/data/SOURCES.md` درج شده است.
- مختصات و مرزها جامعه‌محور و تقریبی هستند؛ نام ۶ منطقه اصلی جداگانه از منبع رسمی Rockstar ارجاع داده شده است. این مختصات GPS یا مسیر واقعی بازی نیستند.
- کاشی‌های روز/شب از میزبان GitHub Pages منبع دریافت می‌شوند؛ بنابراین نمایش نقشه برای بارگذاری به اینترنت نیاز دارد.
- علاقه‌مندی‌ها، بازدیدها، تم و مکان‌های اضافه‌شده فقط در `localStorage` همان مرورگر ذخیره می‌شوند. GitHub Pages بک‌اند یا احراز هویت مدیریتی ندارد؛ ابزار مدیریت داخل صفحه فقط برای ویرایش محلی است.
