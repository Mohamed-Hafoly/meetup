import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import styles from "../styles/components/profile-form.module.scss"

export default function ProfileFormSkeleton() {
  return (
    <SkeletonTheme
      baseColor="var(--color-primary)"
      highlightColor="var(--color-secondary)">
      <div className={styles.profileContainer}>
        <header>
          <Skeleton circle width={120} height={120} />
          <Skeleton width={200} height={50} />
        </header>

        <div className={styles.profileForm}>
          <div className={styles.inputGroup}>
            <Skeleton width={60} height={24} />
            <Skeleton height={42} />
          </div>

          <div className={styles.inputGroup}>
            <Skeleton width={60} height={24} />
            <Skeleton height={42} />
          </div>

          <div className={styles.inputGroup}>
            <Skeleton width={80} height={24} />
            <Skeleton height={42} />
          </div>

          <div className={styles.btnGroup}>
            <Skeleton width={120} height={48} borderRadius={50} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}
