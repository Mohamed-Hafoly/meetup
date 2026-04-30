import { redirect } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import { HttpError, type MeetingData } from "../../types/api"

export async function meetingLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  const res = await fetch(
    `/api/auth/validate-session`,
    {
      credentials: "include",
    },
  )

  const data = (await res.json()) as { authenticated: boolean }

  if (!data.authenticated) return redirect("/sign-in")

  if (code) {
    const response = await fetch(
      `/api/meetings/participant-join`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      },
    )
    if (!response.ok) {
      let errorMessage = "Invalid invitation code"
      try {
        const errorData = (await response.json()) as { message?: string }
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = response.statusText || errorMessage
      }

      throw new HttpError(response.status, errorMessage)
    }
    return { ...((await response.json()) as MeetingData), role: 0 }
  }

  const response = await fetch(
    `/api/meetings/host-join`,
    {
      method: "GET",
      credentials: "include",
    },
  )
  if (!response.ok) {
    let errorMessage = "Host join failed"
    try {
      const errorData = (await response.json()) as { message?: string }
      errorMessage = errorData.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    throw new HttpError(response.status, errorMessage)
  }
  return { ...((await response.json()) as MeetingData), role: 1 }
}
