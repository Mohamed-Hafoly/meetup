import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { useLoaderData, useNavigate } from "react-router"
import SendInvitesModal from "../components/SendInvitesModal"
import uitoolkit from "@zoom/videosdk-ui-toolkit"
import addUserIcon from "../assets/add-user.svg"
import type { MeetingData } from "../../types/api"
import styles from "../styles/pages/meeting.module.scss"

export default function Meeting() {
  const { sessionName, signature, name, title, role, participants } =
    useLoaderData<MeetingData>()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const sessionContainerRef = useRef<HTMLDivElement>(null)
  const endedForAllRef = useRef(false)

  const navigate = useNavigate()
  const [joined, setJoined] = useState(false)

  // stylesheet effect
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = new URL(
      "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css",
      import.meta.url,
    ).href
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // meeting join effect
  useEffect(() => {
    if (!sessionContainerRef.current) return
    const container = sessionContainerRef.current
    const featureOptions = {
      videoSDKJWT: signature,
      sessionName,
      userName: name,
      featuresOptions: {
        preview: { enable: false },
        feedback: { enable: false },
        header: { enable: false },
        footer: { enable: true },
        video: { enable: true },
        audio: { enable: true },
        share: { enable: true },
        chat: { enable: true, enableEmoji: true },
        users: { enable: true },
        settings: { enable: true },
      },
    }

    const join = async () => {
      await uitoolkit.joinSession(container, featureOptions)
      setJoined(true)
      uitoolkit.onSessionJoined(() => {
        console.log("Session joined!")
      })

      uitoolkit.onSessionClosed(() => {
        void (async () => {
          console.log("Session closed!")
          setJoined(false)
          if (role === 1 && endedForAllRef.current) {
            await fetch(
              `/api/meetings/${sessionName}`,
              {
                method: "DELETE",
                credentials: "include",
              },
            )
          }
          void navigate("/")
        })()
      })

      uitoolkit.onSessionDestroyed(() => {
        void uitoolkit.destroy()
        console.log("Session destroyed!")
      })
    }
    void join()
    return () => {
      void uitoolkit.destroy()
    }
  }, [name, sessionName, signature, navigate, role])

  // end for all button listener effect
  useEffect(() => {
    if (!joined) return

    const observer = new MutationObserver(() => {
      const endForAllButton = document.getElementById("end-for-all-button")
      if (endForAllButton && !endForAllButton.dataset.listenerAttached) {
        endForAllButton.dataset.listenerAttached = "true"
        endForAllButton.addEventListener("click", () => {
          endedForAllRef.current = true
        })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
    }
  }, [joined])

  // beforeunload listener effect
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionContainerRef.current) {
        uitoolkit.closeSession(sessionContainerRef.current)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <div className={styles.meetingContainer}>
      {joined && (
        <header className={styles.meetingHeader}>
          <div className={styles.spacer} />
          <h1 className={styles.meetingTitle}>{title}</h1>

          <button
            type="button"
            className={clsx(styles.addUserButton, {
              [styles.hidden]: role !== 1,
            })}
            aria-label="Invite users"
            onClick={() => {
              if (role !== 1) return
              setIsModalOpen(true)
            }}>
            <img src={addUserIcon} alt="Invite users" />
          </button>
        </header>
      )}
      {isModalOpen && (
        <SendInvitesModal
          participants={participants}
          onClose={() => {
            setIsModalOpen(false)
          }}
        />
      )}
      <div
        id="sessionContainer"
        ref={sessionContainerRef}
        className={styles.meetingSession}
      />
    </div>
  )
}
