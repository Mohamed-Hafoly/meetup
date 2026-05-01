import styles from "../styles/components/about-app.module.scss"

export default function AboutApp() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          What is <span className={styles.meet}>Meet</span>
          <span className={styles.up}>UP</span>?
        </h1>

        <div className={styles.body}>
          <div className={styles.description}>
            <div className={styles.meetupLabel}>
              <span className={styles.meet}>Meet</span>
              <span className={styles.up}>UP</span>
            </div>
            <p className={styles.text}>
              makes online meetings easy and secure. Each invite link is
              completely unique to the person it's sent to — only they can use
              it, no more unwelcome guests to your business meetings and
              lectures!
            </p>
            <p className={styles.note}>
              <span className={styles.asterisk} aria-label="Note">
                *
              </span>
              Invites are currently only sent out using email, and the person
              you're inviting has to have an account already created, changing
              soon!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
