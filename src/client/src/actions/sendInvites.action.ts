import type { ActionFunctionArgs } from "react-router"
import type { User } from "../../types/user"

export async function sendInvitesAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const inviteesRaw = formData.get("invitees")

  const invitees = inviteesRaw
    ? (JSON.parse(inviteesRaw as string) as User[])
    : []

  const response = await fetch(`/api/meetings/send-invites`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ invitees }),
  })


  if (!response.ok) {
    const data = (await response.json()) as { message: string }
    return { error: data.message }
  }

  return await response.json() as { success: boolean }
}