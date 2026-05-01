import { redirect } from "react-router"
import type { ActionFunctionArgs } from "react-router"
import type { User } from "../../types/user"

export async function profileFormAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")

  if (!password) return { error: "Password is required to save changes" }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Invalid form data" }
  }

  if (!name && !email) return { error: "No fields to update" }

  try {
    const res = await fetch(
      `/api/auth/update-profile`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      },
    )

    const data = (await res.json()) as { error?: string; user?: User }
    if (!res.ok) return { error: data.error || "Failed to update profile" }

    return redirect(".")
  } catch {
    return { error: "Something went wrong. Please try again." }
  }
}
