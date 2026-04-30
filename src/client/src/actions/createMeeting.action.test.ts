import { describe, it, expect, beforeEach } from "vitest"
import { createMeetingAction } from "./createMeeting.action"
import { server } from "../mocks/node"
import type { ActionFunctionArgs } from "react-router"

describe("createMeetingAction", () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it("returns error when title is missing", async () => {
    const formData = new FormData()
    formData.append("invitees", JSON.stringify([]))

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await createMeetingAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Meeting title is required" })
  })

  it("returns error when title is empty", async () => {
    const formData = new FormData()
    formData.append("title", "")
    formData.append("invitees", JSON.stringify([]))

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await createMeetingAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Meeting title is required" })
  })

  it("successfully creates meeting and redirects", async () => {
    const formData = new FormData()
    formData.append("title", "Team Sync")
    formData.append(
      "invitees",
      JSON.stringify([{ username: "John Doe", email: "john@example.com" }]),
    )

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await createMeetingAction({ request } as ActionFunctionArgs)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
    expect((result as Response).headers.get("Location")).toBe("/meeting")
  })

  it("returns error when invitations fail", async () => {
    const formData = new FormData()
    formData.append("title", "Invitation Failed")
    formData.append(
      "invitees",
      JSON.stringify([{ username: "John Doe", email: "john@example.com" }]),
    )

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await createMeetingAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Failed to send invitations" })
  })

  it("handles missing invitees (defaults to empty array)", async () => {
    const formData = new FormData()
    formData.append("title", "Valid Title")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await createMeetingAction({ request } as ActionFunctionArgs)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
  })
})
