const AUTH_EXPIRED_PATTERNS = [
  /jwt/i,
  /token/i,
  /session/i,
  /expired/i,
  /invalid/i,
] as const;

export function isAuthExpiredErrorMessage(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  const normalized = message.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const hasAuthKeyword = AUTH_EXPIRED_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );

  if (!hasAuthKeyword) {
    return false;
  }

  return (
    normalized.includes("jwt") ||
    normalized.includes("token") ||
    normalized.includes("session")
  );
}
