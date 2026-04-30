import { redirect } from "react-router"
import type { ActionFunctionArgs } from "react-router"
import type { User } from "../../types/user"

export async function createMeetingAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const title = formData.get("title")
  const inviteesRaw = formData.get("invitees")

  if (!title || typeof title !== "string" || title.trim() === "") {
    return { error: "Meeting title is required" }
  }

  const invitees = inviteesRaw
    ? (JSON.parse(inviteesRaw as string) as User[])
    : []

  const response = await fetch(
    `/api/meetings/create-meeting`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, invitees }),
    },
  )

  if (!response.ok) {
    const data = (await response.json()) as { message: string }
    return { error: data.message }
  }

  const data = (await response.json()) as { id: string }
  console.log("Meeting created with id:", data.id)
  return redirect("/meeting")
}
