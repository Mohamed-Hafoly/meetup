import { useState, useEffect } from "react"
import { Form, useActionData, useNavigation } from "react-router"
import { sendInvitesAction } from "../actions/sendInvites.action"
import TrapFocus from "./TrapFocus"
import SearchUsers from "./SearchUsers"
import InvitesList from "./InviteesList"
import ThreeDotsLoader from "../assets/3-dots-fade-loader.svg?react"
import CloseIcon from "../assets/close-meeting-modal.svg?react"
import type { User } from "../../types/user"
import styles from "../styles/components/add-users-modal.module.scss"

interface SendInvitesModalProps {
  participants?: string[]
  onClose: () => void
}

export default function SendInvitesModal({ participants, onClose }: SendInvitesModalProps) {
  const [invitees, setInvitees] = useState<User[]>([])
  const [submitted, setSubmitted] = useState(false)

const actionData = useActionData<typeof sendInvitesAction>()

useEffect(() => {
  if (actionData && 'success' in actionData && actionData.success) {
    onClose()
  }
}, [actionData, onClose])
  const isSubmitting = useNavigation().state === "submitting"

  const handleAdd = (user: User) => {
    setInvitees((prev) => [...prev, user])
  }

  const handleRemove = (email: string) => {
    setInvitees((prev) => prev.filter((u) => u.email !== email))
  }

  return (
    <div className={styles.overlay}>
      <TrapFocus
        onDeactivate={onClose}
        activationDelay={100}
        initialFocus="input">
        <div className={styles.modal}>
          <Form
            method="post"
            className={styles.form}
            onSubmit={() => {
              setSubmitted(true)
            }}>
            <div className={styles.topSection}>
              <div className={styles.header}>
                <h2 className={styles.title}>Invite:</h2>
                <button
                  className={styles.close}
                  onClick={onClose}
                  aria-label="Close">
                  <CloseIcon fill="red" />
                </button>
              </div>
              <input
                type="hidden"
                name="invitees"
                value={JSON.stringify(invitees)}
              />

              <div className={styles.body}>
                <SearchUsers
                  existingEmails={[
                    ...invitees.map((u) => u.email),
                    ...(participants ?? []),
                  ]}
                  onSelect={handleAdd}
                />
                <InvitesList
                  invitees={invitees}
                  onRemove={handleRemove}
                  bg={styles.inviteesList}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <button
                type="submit"
                className={styles.btn}
                disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send"}
                {isSubmitting && <ThreeDotsLoader />}
              </button>
              {submitted && actionData && "error" in actionData && (
                <p className={styles.error}>{actionData.error}</p>
              )}
            </div>
          </Form>
        </div>
      </TrapFocus>
    </div>
  )
}
