import instagramIcon from "../assets/instagram.svg"
import linkedinIcon from "../assets/linkedin.svg"
import githubIcon from "../assets/github.svg"
import emailIcon from "../assets/mail.svg"
import styles from "../styles/components/footer.module.scss"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2026 Mohamed Hafoly</p>
      <div className={styles.socials}>
        <a
          href="https://www.instagram.com/mhmd_amer10"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram">
          <img src={instagramIcon} alt="" />
        </a>
        <a
          href="https://www.linkedin.com/in/mohamed-hafoly-ba5b4930a"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn">
          <img src={linkedinIcon} alt="" />
        </a>
        <a
          href="https://github.com/Mohamed-Hafoly"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub">
          <img src={githubIcon} alt="" />
        </a>
        <a href="mailto:mohamedhafoly@gmail.com" aria-label="Email">
          <img src={emailIcon} alt="" />
        </a>
      </div>
    </footer>
  )
}
