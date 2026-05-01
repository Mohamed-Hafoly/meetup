import { useState } from "react"
import { useNavigate, useLoaderData, useRouteLoaderData } from "react-router"
import CreateMeetingModal from "./CreateMeetingModal"
import deviceImg from "../assets/device-image.png"
import videoIcon from "../assets/video.svg"
import deviceFrameTitleBar from "../assets/device-frame-title-bar.png"
import styles from "../styles/components/home-hero.module.scss"
import type { User } from "../../types/user"

export default function HomeHero() {
  const navigate = useNavigate()
  const user = useRouteLoaderData("root") as User | null
  console.log("HomeHero user:", user)

  const { currentHost } = useLoaderData<{currentHost: boolean}>()
  console.log("HomeHero currentHost:", currentHost)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleStartMeetingBtn = () => {
    if (user) {
      setIsModalOpen(true)
    } else {
      void navigate("/sign-in")
    }
  }

  return (
    <section className={styles.homeHero} aria-label="Hero">
      <div className={styles.content}>
        <header className={styles.heroHeader}>
          <h1 className={styles.heading}>
            Meet <span>Better</span>
            <br />
            Meet <span>Safer</span>
          </h1>

          <p className={styles.subheading}>
            Connect with confidence — secure meet<strong>ups</strong> for you
            and your team
          </p>
        </header>
        <div className={styles.ctaContainer}>
          <button
            className={styles.cta}
            onClick={() => { handleStartMeetingBtn(); }}
            type="button"
            disabled={currentHost}>
            <img src={videoIcon} alt="" />
            Start a meeting
          </button>
          {currentHost && (
            <button
              className={`${styles.cta} ${styles.secondaryCta}`}
              onClick={() => void navigate("/meeting")}
              type="button">
              Rejoin your meeting!
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <CreateMeetingModal
          onClose={() => {
            setIsModalOpen(false)
          }}
        />
      )}

      <div className={styles.frame}>
        <img
          className={styles.frameTitleBar}
          src={deviceFrameTitleBar}
          alt=""
        />
        <img
          className={styles.frameImg}
          src={deviceImg}
          alt="image of an online meeting"
        />
      </div>
    </section>
  )
}
