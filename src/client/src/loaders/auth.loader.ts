import { redirect } from "react-router"

export async function authLoader() {
  const res = await fetch(
    `/api/auth/validate-session`,
    {
      credentials: "include",
    },
  )

  const data = (await res.json()) as { authenticated: boolean }

  if (data.authenticated) return redirect("/")
  
  return null
}