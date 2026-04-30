import { describe, it, expect } from "vitest"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/node"
import { authLoader } from "./auth.loader"

describe("authLoader", () => {
  it("redirects to / when authenticated", async () => {
    server.use(
      http.get(
        `/api/auth/validate-session`,
        () => {
          return HttpResponse.json({ authenticated: true })
        },
      ),
    )

    const response = await authLoader()
    expect((response as Response).status).toBe(302)
  })

  it("returns null when not authenticated", async () => {
    const response = await authLoader()
    expect(response).toBeNull()
  })
})
