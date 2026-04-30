import { describe, it, expect, beforeEach } from "vitest"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/node"
import { meetingLoader } from "./meeting.loader"
import type { LoaderFunctionArgs } from "react-router"
import type { MeetingData } from "../../types/api"

const makeRequest = (path = "/meeting") =>
  ({
    request: new Request(`http://localhost${path}`),
    params: {},
    context: {},
  }) as LoaderFunctionArgs

describe("meetingLoader", () => {
  beforeEach(() => {
    server.use(
      http.get(
        `/api/auth/validate-session`,
        () => {
          return HttpResponse.json({ authenticated: true })
        },
      ),
    )
  })
  it("redirects to /sign-in when not authenticated", async () => {
    server.use(
      http.get(
        `/api/auth/validate-session`,
        () => {
          return HttpResponse.json({ authenticated: false })
        },
      ),
    )

    const result = (await meetingLoader(makeRequest())) as Response
    expect(result.status).toBe(302)
  })

  it("returns participant data on valid code", async () => {
    const result = (await meetingLoader(
      makeRequest("/meeting?code=test-code"),
    )) as MeetingData & { role: number }

    expect(result.role).toBe(0)
    expect(result.sessionName).toBe("mock-session-123")
  })

  it("throws on invalid code", async () => {
    await expect(
      meetingLoader(makeRequest("/meeting?code=wrong-code")),
    ).rejects.toThrow("Invalid invitation code")
  })

  it("throws on participant-join server error", async () => {
    await expect(
      meetingLoader(makeRequest("/meeting?code=server-error")),
    ).rejects.toThrow("Server error")
  })

  it("returns host data when no code is provided", async () => {
    const result = (await meetingLoader(makeRequest())) as MeetingData & {
      role: number
    }

    expect(result.role).toBe(1)
    expect(result.sessionName).toBe("mock-session-123")
  })

  it("throws when no active meeting in session", async () => {
    server.use(
      http.get(`/api/meetings/host-join`, () => {
        return HttpResponse.json(
          { error: "No active meeting" },
          { status: 404 },
        )
      }),
    )

    await expect(meetingLoader(makeRequest())).rejects.toThrow(
      "Host join failed",
    )
  })
})
