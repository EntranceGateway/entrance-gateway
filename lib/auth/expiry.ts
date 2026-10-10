export function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as { exp?: number }
    return typeof decoded.exp !== 'number' || decoded.exp <= Math.floor(Date.now() / 1000) + 30
  } catch {
    return true
  }
}
