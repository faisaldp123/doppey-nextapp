"use client";
import styles from "../../styles/NewsLetterSection.module.css";

export default function NewsletterSection() {
  return (
    <section className={styles.newsletter}>
      <div className={styles.text}>
        <h4>Sign Up For Newsletters</h4>
        <p>
          Get E-mail updates about our latest shop and <span>special offers.</span>
        </p>
      </div>

      <div className={styles.form}>
        <input type="text" placeholder="Your email address" />
        <button>Sign Up</button>
      </div>
    </section>
  );
}
