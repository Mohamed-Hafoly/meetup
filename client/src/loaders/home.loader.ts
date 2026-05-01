export async function homeLoader() {
  const res = await fetch(
    `/api/meetings/current-host`,
    {
      credentials: "include",
    },
  )

  const data = (await res.json()) as { currentHost: boolean }
  return data
}
