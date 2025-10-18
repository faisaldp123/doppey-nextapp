"use client";

import styles from "../styles/Help.module.css";

export default function HelpPage() {
  return (
    <div className={styles.helpPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1>Need Help?</h1>
          <p>We are here to assist you 24/7. Explore FAQs or contact support.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqCards}>
          <div className={styles.card}>
            <h3>How can I track my order?</h3>
            <p>Go to the "Track My Order" page and enter your order ID to see the status.</p>
          </div>
          <div className={styles.card}>
            <h3>How to change my account details?</h3>
            <p>Visit your profile settings to update your personal information.</p>
          </div>
          <div className={styles.card}>
            <h3>What payment methods are accepted?</h3>
            <p>We accept all major credit/debit cards, UPI, and net banking.</p>
          </div>
        </div>
      </section>

      {/* Contact Support Form */}
      <section className={styles.contactSection}>
        <h2>Contact Support</h2>
        <form className={styles.contactForm}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Describe your issue" rows="5" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}
