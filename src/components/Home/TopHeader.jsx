"use client";
import styles from "../../styles/TopHeader.module.css";
import { Mail } from "lucide-react"; // import Mail icon

export default function TopHeader() {
  return (
    <div className={styles.topHeader}>
      <div className={styles.scrollText}>
        <p>
          Welcome to Doppey! Check out our latest collection and exciting offers!
        </p>
      </div>
      <div className={styles.staticEmail}>
        <Mail size={16} style={{ marginRight: "5px" }} />
        <a href="mailto:support@doppey.com">ContactUs@doppey.com</a>
      </div>
    </div>
  );
}
