"use client";
import styles from "../styles/Privacy.module.css";

export default function PrivacyPolicyPage() {
  return (
    <section className={styles.privacy}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to Doppey. We’re committed to protecting your personal information.</p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Information We Collect</h2>
          <p>
            When you shop with Doppey, we may collect information including your name, email address, shipping and billing addresses, and payment information. This helps us process orders and provide a seamless experience.
          </p>
        </div>

        <div className={styles.section}>
          <h2>How We Use Your Information</h2>
          <p>
            We use your information to process orders, communicate updates, improve our services, and send personalized promotions. Your data is never sold to third parties.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Cookies & Tracking</h2>
          <p>
            Doppey uses cookies and similar technologies to enhance your shopping experience, remember preferences, and analyze website traffic. You can manage your cookie preferences through your browser settings.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Data Security</h2>
          <p>
            We implement strict security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Our website is regularly monitored and maintained to ensure your information is safe.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Third-Party Services</h2>
          <p>
            Doppey may use trusted third-party services for payment processing, shipping, and analytics. These third parties have access to your data only to perform their designated tasks and are required to maintain confidentiality.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Contact Us</h2>
          <p>
            If you have any questions or concerns about your privacy, feel free to contact our support team at <strong>support@doppey.com</strong>. We’re here to help.
          </p>
        </div>
      </div>
    </section>
  );
}
