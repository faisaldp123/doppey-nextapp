"use client";
import styles from "../styles/Terms.module.css";

export default function TermsConditionsPage() {
  return (
    <section className={styles.terms}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Terms & Conditions</h1>
          <p>Read carefully to understand your rights and responsibilities when using Doppey.</p>
        </div>
      </div>

      {/* Terms Content */}
      <div className={styles.container}>
        <div className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Doppey website and services, you agree to comply with these terms and conditions.
            If you do not agree, please refrain from using our services.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Use of Website</h2>
          <p>
            You agree to use the Doppey website only for lawful purposes and in a manner that does not infringe the rights
            of others or restrict their use of the website.
          </p>
        </div>

        <div className={styles.section}>
          <h2>3. Product Information</h2>
          <p>
            We strive to provide accurate information about products, including pricing, colors, and availability.
            However, Doppey does not guarantee that all product details are free of errors.
          </p>
        </div>

        <div className={styles.section}>
          <h2>4. Orders & Payment</h2>
          <p>
            All orders are subject to acceptance and availability. Payment must be completed before order processing.
            Doppey reserves the right to cancel orders in case of payment issues or product unavailability.
          </p>
        </div>

        <div className={styles.section}>
          <h2>5. Shipping & Delivery</h2>
          <p>
            Delivery timelines are estimates and may vary. Doppey is not responsible for delays caused by courier services,
            customs, or unforeseen circumstances.
          </p>
        </div>

        <div className={styles.section}>
          <h2>6. Returns & Refunds</h2>
          <p>
            Please review our Delivery & Returns Policy for details. Returns are accepted within the specified period and
            conditions outlined on our website.
          </p>
        </div>

        <div className={styles.section}>
          <h2>7. Intellectual Property</h2>
          <p>
            All content, images, logos, and designs on the Doppey website are the property of Doppey. Unauthorized use is strictly prohibited.
          </p>
        </div>

        <div className={styles.section}>
          <h2>8. Limitation of Liability</h2>
          <p>
            Doppey is not liable for any indirect, incidental, or consequential damages arising from the use of our website or services.
          </p>
        </div>

        <div className={styles.section}>
          <h2>9. Modifications</h2>
          <p>
            Doppey reserves the right to modify these Terms & Conditions at any time. Users are encouraged to review this page regularly.
          </p>
        </div>

        <div className={styles.section}>
          <h2>10. Contact Us</h2>
          <p>
            For any questions regarding these Terms & Conditions, please contact us at <strong>support@doppey.com</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
