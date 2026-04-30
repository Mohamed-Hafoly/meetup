import { useState, useEffect, useRef } from "react"
import { Form, useNavigation, useActionData } from "react-router"
import { profileFormAction } from "../actions/profileForm.action"
import Avvvatars from "avvvatars-react"
import ThreeDotsLoader from "../assets/3-dots-fade-loader.svg?react"
import type { User } from "../../types/user"
import styles from "../styles/components/profile-form.module.scss"

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState("")

  const hasChanges = name !== user.name || email !== user.email
  const canSave =
    hasChanges &&
    password.length >= 8 &&
    name.trim().length >= 2 &&
    email.trim() !== ""

  const [isEditing, setIsEditing] = useState(false)

  const isSubmitting = useNavigation().state === "submitting"
  const actionData = useActionData<typeof profileFormAction>()

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isSubmitting && !actionData) {
      if (passwordRef.current) passwordRef.current.value = ""
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsEditing(false)
    }
  }, [isSubmitting, actionData])

  return (
    <div className={styles.profileContainer}>
      <header>
        <Avvvatars value={name} displayValue={name.charAt(0)} />
        {isEditing ? (
          <input
            form="profile-form"
            name="name"
            aria-label="Name"
            required
            minLength={2}
            maxLength={50}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        ) : (
          <h1 title={name}>{name}</h1>
        )}
        {!isEditing && (
          <input form="profile-form" name="name" type="hidden" value={name} />
        )}
      </header>

      {actionData && <p className={styles.authError}>{actionData.error}</p>}

      <Form
        id="profile-form"
        method="post"
        className={styles.profileForm}
        aria-label="Profile form">
        <fieldset disabled={!isEditing || isSubmitting}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              placeholder="JohnDoe@example.com"
              maxLength={254}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              placeholder="****"
              maxLength={72}
              minLength={8}
            />
          </div>
        </fieldset>
      </Form>

      <fieldset disabled={isSubmitting} className={styles.btnGroup}>
        {isEditing ? (
          <>
            <button
              type="button"
              className={`${styles.btn} ${styles.cancel}`}
              onClick={() => {
                setName(user.name)
                setEmail(user.email)
                setIsEditing(false)
              }}>
              Cancel
            </button>
            <button
              type="submit"
              form="profile-form"
              className={`${styles.btn} ${styles.action}`}
              disabled={!canSave}>
              {isSubmitting ? "saving" : "save"}
              {isSubmitting && <ThreeDotsLoader />}
            </button>
          </>
        ) : (
          <button
            type="button"
            className={`${styles.btn} ${styles.action}`}
            onClick={() => {
              setIsEditing(true)
            }}>
            Edit
          </button>
        )}
      </fieldset>
    </div>
  )
}
