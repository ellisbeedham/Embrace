/**
 * Validates a post-login redirect path (relative app URL only).
 */
export function safeInternalRedirectPath(path: string | null | undefined): string | null {
  if (path == null || path === "") return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(path.trim());
  } catch {
    return null;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  if (decoded.includes("://")) return null;
  return decoded;
}

export const AUTH_NEXT_COOKIE = "embrace_auth_next";
