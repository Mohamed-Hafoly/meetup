import { http, HttpResponse } from "msw"
import type { User } from "../../types/user"


export const handlers = [
  
  // -------- GETS ----------------------------------------------

  // session validation
  http.get(`/api/auth/validate-session`, () => {
    return HttpResponse.json({
      authenticated: false,
      user: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
    })
  }),

  http.get(`/api/meetings/current-host`, () => {
    return HttpResponse.json({
      currentHost: false,
    })
  }),

  //host join
  http.get(`/api/meetings/host-join`, () => {
    return HttpResponse.json({
      name: "Test Host",
      title: "Test Meeting",
      sessionName: "mock-session-123",
      signature: "mock-signature",
      participants: ["user1@test.com"],
    })
  }),

  // -------- POSTS ----------------------------------------------

  // profile update
  http.post(
    `/api/auth/update-profile`,
    async ({ request }) => {
      const body = (await request.json()) as {
        name?: string
        email?: string
        password: string
      }

      if (body.password === "wrongpassword") {
        return HttpResponse.json(
          { error: "Incorrect password" },
          { status: 401 },
        )
      }

      if (body.email === "taken@example.com") {
        return HttpResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        )
      }

      if (body.email === "invalid") {
        return HttpResponse.json(
          { error: "Invalid email address" },
          { status: 400 },
        )
      }

      if (body.name === "server-error") {
        return HttpResponse.json(
          { error: "Failed to update profile" },
          { status: 500 },
        )
      }

      return HttpResponse.json(
        {
          user: {
            name: body.name || "Existing Name",
            email: body.email || "existing@example.com",
            updatedAt: new Date().toISOString(),
          },
        },
        { status: 200 },
      )
    },
  ),

  //create-meeting
  http.post(
    `/api/meetings/create-meeting`,
    async ({ request }) => {
      const body = (await request.json()) as { title: string; invitees: User[] }

      if (!body.title || body.title.trim() === "") {
        return HttpResponse.json(
          { message: "Meeting title is required" },
          { status: 400 },
        )
      }

      if (body.title === "Invitation Failed") {
        return HttpResponse.json(
          { message: "Failed to send invitations" },
          { status: 500 },
        )
      }

      return HttpResponse.json(
        { id: `meeting-${Date.now().toString()}` },
        { status: 200 },
      )
    },
  ),

  http.post(
    `/api/meetings/send-invites`,
    async ({ request }) => {
      const body = (await request.json()) as { invitees: User[] }

      if (body.invitees[0]?.email === "error@error.com") {
        return HttpResponse.json(
          { message: "Failed to send invitations" },
          { status: 500 },
        )
      }

      return HttpResponse.json({ success: true }, { status: 200 })
    },
  ),
  // participant join
  http.post(
    `/api/meetings/participant-join`,
    async ({ request }) => {
      const body = (await request.json()) as { code: string }

      if (!body.code || body.code === "wrong-code") {
        return HttpResponse.json(
          { message: "Invalid invitation code" },
          { status: 400 },
        )
      }

      if (body.code === "server-error") {
        return HttpResponse.json({ message: "Server error" }, { status: 500 })
      }
      return HttpResponse.json({
        title: "Test Meeting",
        sessionName: "mock-session-123",
        signature: "mock-signature",
        name: "Test User",
      })
    },
  ),
]
