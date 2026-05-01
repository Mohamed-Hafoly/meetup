import { describe, it, expect, beforeEach } from "vitest"
import { sendInvitesAction } from "./sendInvites.action"
import { server } from "../mocks/node"
import type { ActionFunctionArgs } from "react-router"

describe("sendInvitesAction", () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it("successfully sends invites", async () => {
    const formData = new FormData()
    formData.append(
      "invitees",
      JSON.stringify([{ id: "1", email: "john@example.com" }]),
    )

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await sendInvitesAction({ request } as ActionFunctionArgs)

    expect((result as { success: boolean }).success).toBe(true)
  })

  it("returns error when invitations fail", async () => {
    const formData = new FormData()
    formData.append(
      "invitees",
      JSON.stringify([{ id: "1", email: "error@error.com" }]),
    )

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await sendInvitesAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Failed to send invitations" })
  })

  it("handles missing invitees (defaults to empty array)", async () => {
    const formData = new FormData()

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await sendInvitesAction({ request } as ActionFunctionArgs)

    expect((result as { success: boolean }).success).toBe(true)
  })
})
