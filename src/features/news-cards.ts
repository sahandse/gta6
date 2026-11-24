import type { NewsItem } from "../types";
import { escapeHTML } from "../lib/dom";
import { imageTag } from "../lib/media";

export function newsFeature(item: NewsItem): string {
  return `<a class="news-feature" href="news.html">
    ${imageTag(item.image, item.title, { widths: [640, 1280], sizes: "(max-width: 1040px) 92vw, 60vw" })}
    <span class="feature-inner">
      <span class="chip hot">${escapeHTML(item.cat)}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <p class="feature-excerpt">${escapeHTML(item.excerpt)}</p>
      <span class="meta">${escapeHTML(item.date)} · ${escapeHTML(item.read)} مطالعه</span>
    </span>
  </a>`;
}

export function newsItemRow(item: NewsItem): string {
  return `<a class="news-item" href="news.html">
    <span class="news-thumb">${imageTag(item.image, item.title, { widths: [640, 1280], sizes: "120px" })}</span>
    <span class="news-text">
      <span class="news-cat">${escapeHTML(item.cat)} · ${escapeHTML(item.date)}</span>
      <h4>${escapeHTML(item.title)}</h4>
    </span>
  </a>`;
}

export function newsArticleRow(item: NewsItem): string {
  return `<a class="article-row" href="news.html">
    <span class="thumb">${imageTag(item.image, item.title, { widths: [640, 1280], sizes: "180px" })}</span>
    <span>
      <span class="meta">${escapeHTML(item.cat)} · ${escapeHTML(item.date)} · ${escapeHTML(item.read)} مطالعه</span>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.excerpt)}</p>
    </span>
  </a>`;
}
