import { useState, useDebugValue } from "react"
import { useLoaderData, NavLink } from "react-router"
import ProfileMenu from "./ProfileMenu"
import closeIcon from "../assets/close.svg"
import hamburgerIcon from "../assets/hamburger.svg"
import type { User } from "../../types/user"
import styles from "../styles/components/nav.module.scss"

function useDebug() {
  const user = useLoaderData<User | null>()
  const [menuOpen, setMenuOpen] = useState(false)

  useDebugValue({
    auth: user ? "logged in" : "logged out",
    menu: menuOpen ? "open" : "closed",
  })

  return {
    user,
    menuOpen,
    setMenuOpen,
  }
}

export default function Nav() {
  const { user, menuOpen, setMenuOpen } = useDebug()

  return (
    <div className={styles.navWrapper}>
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => {
            setMenuOpen(false)
          }}
          aria-label="Close menu">
          <img src={closeIcon} alt="" />
        </button>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.linkPrimary} ${isActive ? styles.active : ""}`
          }
          onClick={() => {
            setMenuOpen(false)
          }}>
          Home
        </NavLink>
        <div className={styles.divider} />

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${styles.linkSecondary} ${isActive ? styles.active : ""}`
          }
          onClick={() => {
            setMenuOpen(false)
          }}>
          About
        </NavLink>
        <div className={styles.divider} />
      </nav>

      {user ? (
        <ProfileMenu user={user} />
      ) : (
        <NavLink
          to="/sign-in"
          end
          className={({ isActive }) =>
            `${styles.linkPrimary} ${isActive ? styles.active : ""}`
          }>
          Sign-in
        </NavLink>
      )}
      <div className={styles.divider} />

      <button
        className={`${styles.hamburger} ${menuOpen ? styles.hide : ""}`}
        onClick={() => {
          setMenuOpen(true)
        }}
        aria-label="Open menu">
        <img src={hamburgerIcon} alt="" />
      </button>

      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => {
            setMenuOpen(false)
          }}
        />
      )}
    </div>
  )
}
