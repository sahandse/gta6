import { news } from "../data/site";
import { emptyState, norm, qs, qsa } from "../lib/dom";
import { newsArticleRow, newsFeature, newsItemRow } from "./news-cards";

export function initNewsPreview(): void {
  const wrap = qs<HTMLElement>("[data-news]");
  if (!wrap) return;

  const [first, ...rest] = news;
  if (!first) return;

  const feature = wrap.querySelector<HTMLElement>(".news-feature");
  const list = wrap.querySelector<HTMLElement>(".news-list");

  if (feature) {
    feature.outerHTML = newsFeature(first);
  }
  if (list) {
    list.innerHTML = rest.slice(0, 4).map(newsItemRow).join("");
  }
}

export function initNewsPage(): void {
  const container = qs<HTMLElement>("[data-news-full]");
  if (!container) return;

  const search = qs<HTMLInputElement>("[data-news-search]");
  const pills = qsa<HTMLButtonElement>("[data-news-cat]");
  let category = "همه";

  const render = (): void => {
    const query = norm(search?.value ?? "");
    const list = news.filter((item) => {
      const matchesCategory = category === "همه" || item.cat === category;
      const matchesQuery =
        !query || norm(`${item.title} ${item.excerpt} ${item.cat}`).includes(query);
      return matchesCategory && matchesQuery;
    });

    if (list.length) {
      container.innerHTML = list.map(newsArticleRow).join("");
    } else {
      container.innerHTML = "";
      container.appendChild(emptyState("فیلتر یا جست‌وجو را تغییر دهید.", "خبری پیدا نشد"));
    }
  };

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((other) => other.classList.remove("active"));
      pill.classList.add("active");
      category = pill.dataset.newsCat ?? "همه";
      render();
    });
  });

  search?.addEventListener("input", render);
  render();
}
