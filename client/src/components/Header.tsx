import Nav from "./Nav"
import logo from "../assets/logo.svg"
import styles from "../styles/components/header.module.scss"

export default function Header() {
  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <Nav />
    </header>
  )
}
