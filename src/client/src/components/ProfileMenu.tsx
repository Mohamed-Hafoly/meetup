import { useState, useDebugValue } from "react"
import { useNavigate, NavLink, useRevalidator } from "react-router"
import Avvvatars from "avvvatars-react"
import TrapFocus from "./TrapFocus"
import profileIcon from "../assets/profile.svg"
import logOutIcon from "../assets/Log-out.svg"
import type { User } from "../../types/user"
import styles from "../styles/components/profile-menu.module.scss"

function useDebug() {
  const [profileOpen, setProfileOpen] = useState(false)

  useDebugValue({
    profile: profileOpen ? "open" : "closed",
  })

  return {
    profileOpen,
    setProfileOpen,
  }
}

interface ProfileMenuProps {
  user: User
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const { profileOpen, setProfileOpen } = useDebug()
  const navigate = useNavigate()
  const { revalidate } = useRevalidator()

  async function handleLogout() {
    try {
      await fetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
      void revalidate()
      void navigate("/sign-in")
    } catch (error: unknown) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <TrapFocus
      active={profileOpen}
      onDeactivate={() => {
        setProfileOpen(false)
      }}
      clickOutsideDeactivates={true}>
      <div className={styles.profilePopup}>
        <button
          type="button"
          className={styles.avatarBtn}
          onClick={() => {
            setProfileOpen((prev) => !prev)
          }}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          aria-controls="profile-menu"
          aria-label="Open profile menu">
          <Avvvatars value={user.name} displayValue={user.name.charAt(0)} />
        </button>
        <menu
          id="profile-menu"
          role="menu"
          className={`${styles.profileMenu} ${profileOpen ? styles.open : ""}`}
          inert={!profileOpen ? true : undefined}>
          <li role="none">
            <div className={styles.profileMenuHeader}>
              <p className={styles.name}>{user.name}</p>
              <p className={styles.email}>{user.email}</p>
            </div>
          </li>
          <li role="none">
            <NavLink
              className={({ isActive, isPending }) =>
                `${styles.profileMenuItem} ${isActive ? styles.active : isPending ? styles.loading : ""}`
              }
              to="/profile"
              role="menuitem"
              onClick={() => {
                setProfileOpen(false)
              }}>
              <img src={profileIcon} alt="" />
              Profile
            </NavLink>
          </li>

          <li role="none">
            <button
              className={styles.profileMenuItem}
              role="menuitem"
              tabIndex={profileOpen ? 0 : -1}
              onClick={() => {
                setProfileOpen(false)
                void handleLogout()
              }}>
              <img src={logOutIcon} alt="" />
              Log out
            </button>
          </li>
        </menu>
      </div>
    </TrapFocus>
  )
}
