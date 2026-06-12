import Head from "next/head";
import styles from "../styles/returns.module.css";

export default function ReturnsPage() {
const faqs = [
{
q: "How many days do I have to return a product?",
a: "You can request a return within 7 days of delivery.",
},
{
q: "When will I get my refund?",
a: "Refunds are processed within 5-7 business days after quality inspection.",
},
{
q: "Can I exchange sizes?",
a: "Yes, exchanges are available subject to stock availability.",
},
{
q: "Do I have to pay for return shipping?",
a: "No, return pickup is free for eligible orders.",
},
];

return (
<> <Head> <title>Returns & Exchanges | Doppey</title> <meta
       name="description"
       content="Easy returns and exchanges for Doppey orders."
     /> </Head>

  <div className={styles.page}>
    <section className={styles.hero}>
      <span className={styles.tag}>
        RETURNS & EXCHANGES
      </span>

      <h1>
        Hassle Free <span>Returns</span>
      </h1>

      <p>
        Your satisfaction matters. If something
        isn't right, we'll help you return or
        exchange it quickly.
      </p>
    </section>

    <section className={styles.features}>
      <div className={styles.feature}>
        <h3>7 Day Returns</h3>
        <p>Return within 7 days of delivery.</p>
      </div>

      <div className={styles.feature}>
        <h3>Easy Pickup</h3>
        <p>Doorstep pickup available.</p>
      </div>

      <div className={styles.feature}>
        <h3>Fast Refunds</h3>
        <p>Processed after quality check.</p>
      </div>
    </section>

    <section className={styles.steps}>
      <h2>How Returns Work</h2>

      <div className={styles.stepGrid}>
        <div>
          <span>01</span>
          <h3>Raise Request</h3>
          <p>Submit your return request.</p>
        </div>

        <div>
          <span>02</span>
          <h3>Pickup</h3>
          <p>Courier partner collects product.</p>
        </div>

        <div>
          <span>03</span>
          <h3>Refund</h3>
          <p>Money refunded to original source.</p>
        </div>
      </div>
    </section>

    <section className={styles.rules}>
      <div className={styles.card}>
        <h2>Eligible Returns</h2>

        <ul>
          <li>Unused products</li>
          <li>Original tags attached</li>
          <li>Original packaging intact</li>
          <li>Requested within 7 days</li>
        </ul>
      </div>

      <div className={styles.card}>
        <h2>Non-Returnable</h2>

        <ul>
          <li>Used products</li>
          <li>Washed garments</li>
          <li>Damaged after delivery</li>
          <li>Products without tags</li>
        </ul>
      </div>
    </section>

    <section className={styles.faq}>
      <h2>Frequently Asked Questions</h2>

      {faqs.map((item, index) => (
        <details key={index}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </section>

    <section className={styles.support}>
      <h2>Need Help?</h2>

      <p>
        Contact our support team for returns,
        exchanges, and refund assistance.
      </p>

      <button>Contact Support</button>
    </section>
  </div>
</>

);
}
