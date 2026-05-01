import Avvvatars from "avvvatars-react"
import removeIcon from "../assets/remove.svg"
import type { User } from "../../types/user"
import styles from "../styles/components/invitees-list.module.scss"

interface InvitesListProps {
  invitees: User[]
  onRemove: (email: string) => void
  bg?: string
}

export default function InvitesList({ invitees, onRemove, bg }: InvitesListProps) {
  return (
    <div className={`${styles.invitedList} ${bg ?? ""}`}>
      {invitees.map(({ name, email }) => (
        <div className={styles.item} key={email}>
          <Avvvatars value={name} displayValue={name.charAt(0)} />
          <div className={styles.info}>
            <span className={styles.email}>{email}</span>
            <span className={styles.name}>{name}</span>
          </div>
          <button
            className={styles.remove}
            aria-label={`Remove ${email}`}
            onClick={() => {
              onRemove(email)
            }}>
            <img src={removeIcon} alt="" />
          </button>
        </div>
      ))}
    </div>
  )
}
