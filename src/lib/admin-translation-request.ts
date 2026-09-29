export function isAdminTranslationRequest(req: Request): boolean {
  const requestUrl = new URL(req.url);
  const host = req.headers.get("host") || requestUrl.host;
  const hostname = host.split(":")[0].toLowerCase();
  if (!hostname.startsWith("admin.")) return false;

  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
