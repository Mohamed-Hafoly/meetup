// profileFormAction.test.ts
import { describe, it, expect, beforeEach } from "vitest"
import { profileFormAction } from "./profileForm.action"
import { server } from "../mocks/node"
import type { ActionFunctionArgs } from "react-router"

describe("profileFormAction", () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it("returns error when password is missing", async () => {
    const formData = new FormData()
    formData.append("name", "New Name")
    formData.append("email", "new@example.com")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Password is required to save changes" })
  })

  it("returns error when no fields to update", async () => {
    const formData = new FormData()
    formData.append("name", "")
    formData.append("email", "")
    formData.append("password", "password123")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "No fields to update" })
  })

  it("successfully updates profile and redirects", async () => {
    const formData = new FormData()
    formData.append("name", "New Name")
    formData.append("email", "new@example.com")
    formData.append("password", "password123")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(302)
    expect((result as Response).headers.get("Location")).toBe(".")
  })

  it("returns error when password is wrong (401)", async () => {
    const formData = new FormData()
    formData.append("name", "New Name")
    formData.append("email", "new@example.com")
    formData.append("password", "wrongpassword")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Incorrect password" })
  })

  it("returns error when email is taken (409)", async () => {
    const formData = new FormData()
    formData.append("name", "New Name")
    formData.append("email", "taken@example.com")
    formData.append("password", "password123")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Email already in use" })
  })

  it("returns error when email is invalid (400)", async () => {
    const formData = new FormData()
    formData.append("name", "New Name")
    formData.append("email", "invalid")
    formData.append("password", "password123")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Invalid email address" })
  })

  it("returns error when server error (500)", async () => {
    const formData = new FormData()
    formData.append("name", "server-error")
    formData.append("email", "new@example.com")
    formData.append("password", "password123")

    const request = {
      formData: () => Promise.resolve(formData),
    } as ActionFunctionArgs["request"]

    const result = await profileFormAction({ request } as ActionFunctionArgs)

    expect(result).toEqual({ error: "Failed to update profile" })
  })
})
