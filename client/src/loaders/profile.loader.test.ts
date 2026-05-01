import { test, expect } from "vitest"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/node"
import { profileLoader } from "./profile.loader"
import type { User } from "../../types/user"

test("profileLoader returns user profile data", async () => {
  server.use(
    http.get(
      `/api/auth/validate-session`,
      () => {
        return HttpResponse.json({
          authenticated: true,
          user: { name: "John Doe", email: "johndoe@example.com" },
        })
      },
    ),
  )

  const result = (await profileLoader()) as { user: User }

  expect(result.user).toEqual({
    name: "John Doe",
    email: "johndoe@example.com",
  })
})

test("profileLoader redirects to /sign-in when not authenticated", async () => {
  const result = (await profileLoader()) as Response

  expect(result.status).toBe(302)
})
