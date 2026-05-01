import { test, expect } from "vitest"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/node"
import { userLoader } from "./user.loader"

test("userLoader returns user data", async () => {
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

  const user = await userLoader()

  expect(user).toEqual({
    name: "John Doe",
    email: "johndoe@example.com",
  })
})

test("userLoader returns null when not authenticated", async () => {
  const user = await userLoader()
  expect(user).toBeNull()
})
