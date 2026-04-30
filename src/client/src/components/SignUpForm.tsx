import { Form, Link, useNavigation, useActionData } from "react-router"
import { signUpAction } from "../actions/signUp.action"
import ThreeDotsLoader from "../assets/3-dots-fade-loader.svg?react"
import styles from "../styles/components/auth.module.scss"

export default function SignUpForm() {
  const isSubmitting = useNavigation().state === "submitting"
  const actionData = useActionData<typeof signUpAction>()

  return (
    <div className={styles.authContainer}>
      <h1>
        Sign <span>UP</span>
      </h1>

      {actionData && <p className={styles.authError}>{actionData.error}</p>}

      <Form method="post" className={styles.authForm} aria-label="Sign up form">
        <fieldset disabled={isSubmitting}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              aria-describedby="name-hint"
              required
              autoComplete="name"
              placeholder="John Doe"
              maxLength={50}
              minLength={2}
            />
            <small id="name-hint">2-50 characters</small>
          </div>

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
              pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}"
              aria-describedby="password-hint"
              required
              autoComplete="current-password"
              placeholder="****"
              maxLength={72}
              minLength={8}
            />
            <small id="password-hint">at least 8 characters, one uppercase, one number, and one special character</small>
          </div>

          <button type="submit" className={styles.btnSubmit}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
            {isSubmitting && <ThreeDotsLoader />}
          </button>
        </fieldset>
      </Form>
      <p className={styles.authRedirect}>
        Already have an account? <Link to="/sign-in">Sign in here</Link>
      </p>
    </div>
  )
}
