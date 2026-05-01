import { redirect } from "react-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import type { ActionFunctionArgs } from "react-router"

export async function signInAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data" }
  }

  try {
    if (!email || !password) {
      return { error: "All fields are required" }
    }

    const { user } = await signInWithEmailAndPassword(auth, email, password)

    let idToken: string
    try {
      idToken = await user.getIdToken()
    } catch {
      return { error: "Something went wrong. Please try again." }
    }

    const res = await fetch(`/api/auth/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    })

    if (!res.ok) {
      return { error: "Something went wrong. Please try again." }
    }

    console.log("user signed IN!!!!")
    return redirect("/")
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err) {
      switch ((err as { code: string }).code) {
        case "auth/invalid-credential":
          return { error: "Invalid email or password." }
        case "auth/invalid-email":
          return { error: "Invalid email address." }
        case "auth/user-disabled":
          return { error: "This account is disabled." }
        default:
          return { error: "An unexpected error occurred. Please try again." }
      }
    }
    return { error: "An unexpected error occurred. Please try again." }
  }
}