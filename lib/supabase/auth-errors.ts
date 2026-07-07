export function isStaleRefreshTokenError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "refresh_token_not_found" ||
    error?.message?.includes("Refresh Token Not Found") === true
  );
}
