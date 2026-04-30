import { useUserSearch } from "../hooks/useSearchUsers"
import Avvvatars from "avvvatars-react"
import searchIcon from "../assets/search.svg"
import removeIcon from "../assets/remove.svg"
import type { User } from "../../types/user"
import styles from "../styles/components/search-users.module.scss"

interface SearchUsersProps {
  existingEmails: string[]
  onSelect: (user: User) => void
}

export default function SearchUsers({
  existingEmails,
  onSelect,
}: SearchUsersProps) {
    const { query, setQuery, results, handleSelect, clearSearch } =
      useUserSearch(existingEmails, onSelect)


  return (
    <div className={styles.searchField}>
      <div className={styles.inputWrap}>
        <span className={styles.searchIcon}>
          <img src={searchIcon} alt="" />
        </span>
        <input
          className={styles.input}
          type="search"
          aria-label="Search for people to invite"
          placeholder="Search by email…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.length < 3) clearSearch()
          }}
        />
        {query && (
          <button
            className={styles.clear}
            aria-label="Clear search"
            onClick={() => {
              setQuery("")
              clearSearch()
            }}>
            <img src={removeIcon} alt="" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map(({ name, email }) => (
            <div
              key={email}
              className={styles.option}
              onClick={() => {
                handleSelect({ name, email })
              }}>
              <Avvvatars value={name} displayValue={name.charAt(0)} />
              <div className={styles.optionInfo}>
                <span className={styles.optionEmail}>{email}</span>
                <span className={styles.optionName}>{name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
