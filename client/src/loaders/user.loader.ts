import type { User } from "../../types/user"

export async function userLoader(): Promise<User | null> {

  const res = await fetch(
    `/api/auth/validate-session`,
    {
      credentials: "include",
    },
  )

  if (!res.ok) return null

  const data = (await res.json()) as { authenticated: boolean; user: User }
  return data.authenticated ? data.user : null
}