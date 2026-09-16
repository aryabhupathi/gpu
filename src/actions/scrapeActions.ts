"use server";

import * as cheerio from "cheerio";

export async function fetchLinkPreview(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || url;
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
    const image = $('meta[property="og:image"]').attr('content') || "";

    return { title, description, image, url };
  } catch {
    return null;
  }
}
