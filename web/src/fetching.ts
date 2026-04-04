export const NHENTAI_ORIGIN = "https://nhentai.net";

export enum SortType {
  DATE = "date",
  POPULAR = "popular",
  POPULAR_TODAY = "popular-today",
  POPULAR_WEEK = "popular-week",
  POPULAR_MONTH = "popular-month",
}

export interface GalleryItem {
  id: number;
  media_id: string;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
  english_title: string;
  japanese_title?: string; // Optional
  num_pages: number;
  tag_ids: number[];
}

export interface GalleryResponse {
  result: GalleryItem[];
  num_pages: number;
  per_page: number;
  total: number;
}

export function thumbnailUrl(item: GalleryItem) {
  const url = new URL(item.thumbnail, NHENTAI_ORIGIN);
  url.host = "t1." + url.host;
  return url.toString();
}

export function bookUrl(item: GalleryItem) {
  return new URL(`/g/${item.id}`, NHENTAI_ORIGIN).toString();
}

export async function searchNhentai(
  query: string | string[],
  sort?: SortType,
  page?: number,
): Promise<GalleryResponse | null> {
  if (query instanceof Array) query = query.join(" ");

  const url = new URL("/api/nhentai/search", window.location.origin);
  const params: Record<string, string> = { query: query };

  if (sort) params["sort"] = sort;
  if (page) params["page"] = page.toString();

  url.search = new URLSearchParams(params).toString();

  const resp = await fetch(url);

  if (resp.status != 200) {
    return null;
  }

  return await resp.json();
}

export async function randomNhentai(
  query: string | string[],
  sort?: SortType,
): Promise<GalleryItem | null> {
  if (query instanceof Array) query = query.join(" ");

  const url = new URL("/api/nhentai/random", window.location.origin);
  const params: Record<string, string> = { query: query };

  if (sort) params["sort"] = sort;

  url.search = new URLSearchParams(params).toString();

  const resp = await fetch(url);

  if (resp.status != 200) {
    return null;
  }

  return await resp.json();
}
