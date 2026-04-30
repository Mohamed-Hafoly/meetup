import { redirect } from "react-router"
import { auth } from "../lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import type { ActionFunctionArgs } from "react-router"

export async function signUpAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Invalid form data" }
  }

  try {
    if (!name || !email || !password) {
      return { error: "All fields are required" }
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })

    let idToken: string
    try {
      idToken = await user.getIdToken()
    } catch {
      await user.delete()
      return { error: "Something went wrong. Please try again." }
    }

    const res = await fetch(`/api/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name }),
    })

    if (!res.ok) {
      await user.delete()
      return { error: "Something went wrong. Please try again." }
    }

    return redirect("/")
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err) {
      switch ((err as { code: string }).code) {
        case "auth/email-already-in-use":
          return { error: "This email is already registered." }
        case "auth/invalid-email":
          return { error: "Invalid email address." }
        case "auth/password-does-not-meet-requirements":
          return { error: "Password does not meet requirments" }
      }
    }
    return { error: "Error occurred. Please try again." }
  }
}
