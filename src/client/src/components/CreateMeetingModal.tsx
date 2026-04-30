import { useState } from "react"
import { Form, useActionData, useNavigation } from "react-router"
import { createMeetingAction } from "../actions/createMeeting.action"
import TrapFocus from "./TrapFocus"
import SearchUsers from "./SearchUsers"
import InvitesList from "./InviteesList"
import ThreeDotsLoader from "../assets/3-dots-fade-loader.svg?react"
import closeIcon from "../assets/close-meeting-modal.svg"
import clearIcon from "../assets/clear.svg"
import type { User } from "../../types/user"
import styles from "../styles/components/create-meeting-modal.module.scss"

interface CreateMeetingModalProps {
  onClose: () => void
}

export default function CreateMeetingModal({ onClose }: CreateMeetingModalProps) {
  const [invitees, setInvitees] = useState<User[]>([])
  const [submitted, setSubmitted] = useState(false)

  const actionData = useActionData<typeof createMeetingAction>()
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
          <div className={styles.header}>
            <h2 className={styles.title}>Meeting Info</h2>
            <button
              className={styles.close}
              onClick={onClose}
              aria-label="Close">
              <img src={closeIcon} alt="" />
            </button>
          </div>
          <Form
            method="post"
            className={styles.form}
            onSubmit={() => {
              setSubmitted(true)
            }}>
            <input
              type="hidden"
              name="invitees"
              value={JSON.stringify(invitees)}
            />

            <div className={styles.body}>
              <div className={styles.titleField}>
                <label className={styles.label} htmlFor="meeting-title">
                  Meeting Title:
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="meeting-title"
                    name="title"
                    className={styles.input}
                    type="text"
                    placeholder="team meeting"
                    maxLength={120}
                  />
                  <button className={styles.clear} aria-label="Clear title">
                    <img src={clearIcon} alt="" />
                  </button>
                </div>
                <span className={styles.hint}>max 120 characters long</span>
              </div>

              <div className={styles.inviteSection}>
                <h3 className={styles.inviteLabel}>Invite</h3>
                <SearchUsers
                  existingEmails={invitees.map((u) => u.email)}
                  onSelect={handleAdd}
                />
                <InvitesList invitees={invitees} onRemove={handleRemove} />
              </div>
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                className={`${styles.btn} ${styles.cancel}`}
                disabled={isSubmitting}
                onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles.start}`}
                disabled={isSubmitting}>
                {isSubmitting ? "Starting..." : "Start"}
                {isSubmitting && <ThreeDotsLoader />}
              </button>
              {submitted && actionData?.error && (
                <p className={styles.error}>{actionData.error}</p>
              )}
            </div>
          </Form>
        </div>
      </TrapFocus>
    </div>
  )
}
