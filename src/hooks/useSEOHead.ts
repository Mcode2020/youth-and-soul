import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string;
  type?: string;
  noIndex?: boolean;
  /** JSON-LD structured data object (or array of objects). Will be JSON.stringified. */
  jsonLd?: Record<string, any> | Record<string, any>[];
  /** For article-type pages */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SITE_URL = "https://www.youthnsoul.com";
const DEFAULT_OG_IMAGE = "https://www.youthnsoul.com/og-image.jpg";

export function useSEOHead({
  title,
  description,
  path = "",
  ogTitle,
  ogDescription,
  ogImage,
  keywords,
  type = "website",
  noIndex = false,
  jsonLd,
  article,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes("Youth & Soul") ? title : `${title} | Youth & Soul`;
    document.title = fullTitle;

    const url = `${SITE_URL}${path}`;
    const image = ogImage || DEFAULT_OG_IMAGE;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (el) el.setAttribute("content", content);
      else {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        el.setAttribute("content", content);
        document.head.appendChild(el);
      }
    };

    const removeMeta = (attr: string, key: string) => {
      const el = document.querySelector(`meta[${attr}="${key}"]`);
      if (el) el.remove();
    };

    // Core
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    setMeta(
      "name",
      "googlebot",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"
    );
    setMeta("name", "bingbot", noIndex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    setMeta("property", "og:title", ogTitle || fullTitle);
    setMeta("property", "og:description", ogDescription || description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", "Youth & Soul");
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", ogTitle || fullTitle);
    setMeta("property", "og:locale", "en_US");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", "@youthandsoul");
    setMeta("name", "twitter:title", ogTitle || fullTitle);
    setMeta("name", "twitter:description", ogDescription || description);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:image:alt", ogTitle || fullTitle);

    // Article meta
    if (type === "article" && article) {
      if (article.publishedTime) setMeta("property", "article:published_time", article.publishedTime);
      if (article.modifiedTime) setMeta("property", "article:modified_time", article.modifiedTime);
      if (article.author) setMeta("property", "article:author", article.author);
      if (article.section) setMeta("property", "article:section", article.section);
      if (article.tags) {
        // Single combined tag is fine for SPA
        setMeta("property", "article:tag", article.tags.join(", "));
      }
    } else {
      removeMeta("property", "article:published_time");
      removeMeta("property", "article:modified_time");
      removeMeta("property", "article:author");
      removeMeta("property", "article:section");
      removeMeta("property", "article:tag");
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // JSON-LD structured data (page-specific). Tag with data attribute for cleanup.
    const existing = document.querySelectorAll('script[data-seo-jsonld="page"]');
    existing.forEach((s) => s.remove());
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "page");
        script.text = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.title = "Youth & Soul";
      const stale = document.querySelectorAll('script[data-seo-jsonld="page"]');
      stale.forEach((s) => s.remove());
    };
  }, [
    title,
    description,
    path,
    ogTitle,
    ogDescription,
    ogImage,
    keywords,
    type,
    noIndex,
    JSON.stringify(jsonLd),
    JSON.stringify(article),
  ]);
}
