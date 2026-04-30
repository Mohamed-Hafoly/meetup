import { test, expect } from "vitest"
import { http, HttpResponse } from "msw"
import { server } from "../mocks/node"
import { homeLoader } from "./home.loader"

test("Returns true if user is currently hosting a meeting", async () => {
  server.use(
    http.get(
      `/api/meetings/current-host`,
      () => {
        return HttpResponse.json({
          currentHost: true,
        })
      },
    ),
  )

  const data = await homeLoader()

  expect(data).toEqual({ currentHost: true })
})

test("returns false if user isn't currently hosting a meeting", async () => {
  const data = await homeLoader()
  expect(data).toEqual({ currentHost: false })
})
