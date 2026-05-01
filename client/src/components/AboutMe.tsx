import aboutImg from "../assets/about-image.png"
import styles from "../styles/components/about-me.module.scss"

export default function AboutMe() {
  return (
    <section className={styles.about}>
      <h2 className={styles.title}>
        About <span>me</span>
      </h2>
      <div className={styles.image}>
        <img src={aboutImg} alt="Me" />
      </div>

      <div className={styles.text}>
        <h3 className={styles.name}>
          Hi there! I'm <span> Mohamed</span>
        </h3>

        <p className={styles.bio}>
          I love building web apps, specifically making intuitive, easy to use,
          UI. I probably care <span> WAY</span> too much about small details
          that no one else would even notice, but i truly believe it's the
          little things that make a difference! I built this app as my
          university graduation project and I graduated! So, success? have a try
          and{" "}
          <a
            href="https://www.instagram.com/mhmd_amer10"
            className={styles.link}>
            let me know!
          </a>
        </p>
      </div>
    </section>
  )
}
