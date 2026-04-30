import { Form, Link, useNavigation, useActionData } from "react-router"
import { signInAction } from "../actions/signIn.action"
import ThreeDotsLoader from "../assets/3-dots-fade-loader.svg?react"
import styles from "../styles/components/auth.module.scss"

export default function SignInForm() {
  const isSubmitting = useNavigation().state === "submitting"
  const actionData = useActionData<typeof signInAction>()

  return (
    <div className={styles.authContainer}>
      <h1>
        Sign <span>In</span>
      </h1>

      {actionData && <p className={styles.authError}>{actionData.error}</p>}

      <Form method="post" className={styles.authForm} aria-label="Sign in form">
        <fieldset disabled={isSubmitting}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="johnDoe@example.com"
              maxLength={254}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="****"
              maxLength={72}
              minLength={8}
            />
          </div>
          <button type="submit" className={styles.btnSubmit}>
            {isSubmitting ? "Signing In..." : "Sign In"}
            {isSubmitting && <ThreeDotsLoader />}
          </button>
        </fieldset>
      </Form>
      <p className={styles.authRedirect}>
        Don't have an account? <Link to="/sign-up">Sign up here</Link>
      </p>
    </div>
  )
}
