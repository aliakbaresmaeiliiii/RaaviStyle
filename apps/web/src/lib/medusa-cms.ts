import { cache } from "react";

export type SitePage = {
  handle: string;
  title: string;
  body: string;
  image_url: string | null;
};

function backendUrl() {
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
}

function publishableKey() {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
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

async function fetchSitePage(handle: string): Promise<SitePage | null> {
  const key = publishableKey();
  if (!key) {
    return null;
  }

  try {
    const response = await fetch(
      `${backendUrl()}/store/cms/pages/${handle}`,
      {
        cache: "no-store",
        headers: {
          "x-publishable-api-key": key,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as { page?: SitePage };
    const page = json.page;
    if (!page) {
      return null;
    }

    return {
      ...page,
      image_url: absolutize(page.image_url),
    };
  } catch {
    return null;
  }
}

export const loadSitePage = cache(fetchSitePage);
