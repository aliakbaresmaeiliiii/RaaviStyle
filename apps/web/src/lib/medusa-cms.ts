import { cache } from "react";

export type SitePage = {
  handle: string;
  title: string;
  body: string;
  image_url: string | null;
};

function backendUrl() {
  return (
    process.env.MEDUSA_BACKEND_URL ??
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
    "http://localhost:9000"
  );
}

function publishableKey() {
  return (
    process.env.MEDUSA_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  );
}

function absolutize(url: string | null) {
  if (!url) {
    return null;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const origin = backendUrl().replace(/\/$/, "");
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
}

async function readJson(response: Response) {
  return (await response.json()) as { page?: SitePage };
}

async function fetchSitePage(handle: string): Promise<SitePage | null> {
  const origin = backendUrl().replace(/\/$/, "");
  const paths = [
    `${origin}/cms/pages/${encodeURIComponent(handle)}`,
    `${origin}/store/cms/pages/${encodeURIComponent(handle)}`,
  ];

  for (const url of paths) {
    try {
      const headers: Record<string, string> = {};
      const key = publishableKey();
      if (url.includes("/store/") && key) {
        headers["x-publishable-api-key"] = key;
      }

      const response = await fetch(url, {
        cache: "no-store",
        headers,
      });

      if (!response.ok) {
        continue;
      }

      const page = (await readJson(response)).page;
      if (!page) {
        continue;
      }

      return {
        ...page,
        image_url: absolutize(page.image_url),
      };
    } catch {
      continue;
    }
  }

  return null;
}

export const loadSitePage = cache(fetchSitePage);
