export function requireEnv(key: string): string {
  const env = import.meta.env as Record<string, string | undefined>
  const value = env[key]
  if (!value) throw new Error(`Missing env var: ${key}`)
  return value
}
