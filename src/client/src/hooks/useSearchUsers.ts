import { useState, useRef, useEffect } from "react"
import type { User } from "../../types/user"

export function useUserSearch(existingEmails: string[], onSelect: (user: User) => void) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (query.length < 3) return

    debounceTimer.current = setTimeout(async () => {
      const res = await fetch(
        `/api/users/search-users?email=${encodeURIComponent(query)}`,
        { credentials: "include" },
      )
      const users = (await res.json()) as User[]

      setResults(users.filter(({ email }) => !existingEmails.includes(email)))
    }, 300)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [query, existingEmails])

   const handleSelect = (user: User) => {
     onSelect(user)
     setQuery("")
     setResults([])
   }

  const clearSearch = () => {
  if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setResults([])
  }

  return { query, setQuery, results, handleSelect, clearSearch }
}
