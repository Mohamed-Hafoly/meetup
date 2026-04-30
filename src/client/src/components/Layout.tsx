import { Outlet } from "react-router"
import Header from "./Header"
import Footer from "./Footer"
import styles from "../styles/components/layout.module.scss"

export default function Layout() {
  return (
    <div className={styles.appLayout}>
      <Header />
      <main className={styles.pageContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
