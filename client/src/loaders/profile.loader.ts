import { redirect } from "react-router"
import type { User } from "../../types/user"

export async function profileLoader(): Promise<{ user: User } | Response> {   const res = await fetch(
    `/api/auth/validate-session`,
    {
      credentials: "include",
    },
  )

  if (!res.ok) return redirect("/sign-in")

  const data = (await res.json()) as { authenticated: boolean; user: User }

  if (!data.authenticated) return redirect("/sign-in")

  return { user: data.user }
}
