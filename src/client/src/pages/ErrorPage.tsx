import { useRouteError, isRouteErrorResponse } from "react-router"
import { HttpError } from "../../types/api"
import styles from "../styles/pages/error-page.module.scss"

export default function ErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className={styles.errorPage}>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    )
  }

  if (error instanceof HttpError) {
    return (
      <div className={styles.errorPage}>
        <h1>{error.status}</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className={styles.errorPage}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  )
}
