const R2_PROXY_PATH = "/api/r2";

export function r2ImageUrl(key: string, publicUrl = process.env.R2_PUBLIC_URL): string {
  const base = publicUrl?.trim().replace(/\/+$/, "") || R2_PROXY_PATH;
  return `${base}/${key.replace(/^\/+/, "")}`;
}

export function resolveR2ImageUrl(url: string, publicUrl = process.env.R2_PUBLIC_URL): string {
  if (!url) return url;

  let path = url;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/r2\//i.test(url)) {
    path = new URL(url).pathname;
  }

  if (path.startsWith(`${R2_PROXY_PATH}/`)) {
    return r2ImageUrl(path.slice(R2_PROXY_PATH.length + 1), publicUrl);
  }

  return url;
}

// Browser fallback for public R2 URLs blocked or throttled in a visitor's region.
export function r2ProxyFallbackUrl(url: string): string | null {
  if (!url || url.startsWith(`${R2_PROXY_PATH}/`)) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!/^\/(products|cms|brands)\//.test(parsed.pathname)) return null;
    return `${R2_PROXY_PATH}${parsed.pathname}`;
  } catch {
    return null;
  }
}
