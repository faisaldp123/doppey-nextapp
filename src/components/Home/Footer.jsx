import React from "react";
import styles from "../../styles/Footer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faFacebookF, faInstagram, faYoutube, faTelegram, faTwitter} from '@fortawesome/free-brands-svg-icons';
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Contact */}
        <div className={styles.footerColumn}>
          <h3>Doppey</h3>
          <p><strong>Address:</strong> North East Delhi, India 110090</p>
          <p><strong>Phone:</strong> (+91) 9643323051</p>
          {/* <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p> */}

          <div className={styles.social}>
  <h4>Follow us</h4>
  <div className="d-flex justify-content-around my-4">
            <a href="https://www.linkedin.com/in/doppey-com/" rel='noopener' target="_blank" className={styles.social_link}><FontAwesomeIcon className={styles.social_link_i} icon={faLinkedinIn}/></a>
        <a href="https://www.facebook.com/" target="_blank" rel='noopener' className={styles.social_link}><FontAwesomeIcon className={styles.social_link_i} icon={faFacebookF}/></a>
        <a href="https://www.instagram.com/doppyapparel/" target="_blank" rel='noopener' className={styles.social_link}><FontAwesomeIcon className={styles.social_link_i} icon={faInstagram}/></a>
        <a href="/" target="_blank" rel='noopener' className={styles.social_link}><FontAwesomeIcon className={styles.social_link_i} icon={faYoutube}/></a>
        <a href="https://twitter.com/" target="_blank" rel='noopener' className={styles.social_link}><FontAwesomeIcon className={styles.social_link_i} icon={faTwitter}/></a>
          </div>
</div>

        </div>

        {/* About */}
        <div className={styles.footerColumn}>
          <h4>About</h4>
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/delivery-info">Delivery Information</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-condition">Terms & Conditions</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
          </ul>
        </div>

        {/* My Account */}
        <div className={styles.footerColumn}>
          <h4>My Account</h4>
          <ul>
            <li><a href="/sign-in">Sign In</a></li>
            <li><a href="/cart">View Cart</a></li>
            <li><a href="/wishlist">My Wishlist</a></li>
            <li><a href="/track-order">Track My Order</a></li>
            <li><a href="/help">Help</a></li>
          </ul>
        </div>

        {/* Install App */}
        <div className={styles.footerColumn}>
          <h4>Install App</h4>
          <p>From App Store or Google Play</p>
          <div className={styles.appLinks}>
            <Link href="/"><Image className={styles.play} src="/footer/app-store.jpg" alt="App Store" width={130} height={40} /></Link>
            <Link href="/"><Image className={styles.play} src="/footer/google-play.jpg" alt="Google Play" width={120} height={40} /></Link>
          </div>
          {/* <p>Secured Payment Gateways</p>
          <div className={styles.paymentIcons}>
            <Image src="/footer/visa.png" alt="Visa" width={50} height={30} />
            <Image src="/footer/mastercard.png" alt="MasterCard" width={50} height={30} />
            <Image src="/footer/maestro.png" alt="Maestro" width={50} height={30} />
            <Image src="/footer/amex.png" alt="American Express" width={50} height={30} />
          </div> */}
        </div>
      </div>

      <div className={styles.footerBottom}>
        © 2025 Doppey, All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
