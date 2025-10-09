import React from "react";
import styles from "../../styles/Footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Contact */}
        <div className={styles.footerColumn}>
          <h3>Doppey</h3>
          <p><strong>Address:</strong> 562 Wellington Road, Street 32, San Francisco</p>
          <p><strong>Phone:</strong> +01 2222 365 / (+91) 01 2345 6789</p>
          <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>

          <div className={styles.social}>
            <h4>Follow us</h4>
            <div className={styles.socialIcons}>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        {/* About */}
        <div className={styles.footerColumn}>
          <h4>About</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Delivery Information</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* My Account */}
        <div className={styles.footerColumn}>
          <h4>My Account</h4>
          <ul>
            <li><a href="#">Sign In</a></li>
            <li><a href="#">View Cart</a></li>
            <li><a href="#">My Wishlist</a></li>
            <li><a href="#">Track My Order</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>

        {/* Install App */}
        <div className={styles.footerColumn}>
          <h4>Install App</h4>
          <p>From App Store or Google Play</p>
          <div className={styles.appLinks}>
            <Image src="/footer/app-store.png" alt="App Store" width={120} height={40} />
            <Image src="/footer/google-play.png" alt="Google Play" width={120} height={40} />
          </div>
          <p>Secured Payment Gateways</p>
          <div className={styles.paymentIcons}>
            <Image src="/footer/visa.png" alt="Visa" width={50} height={30} />
            <Image src="/footer/mastercard.png" alt="MasterCard" width={50} height={30} />
            <Image src="/footer/maestro.png" alt="Maestro" width={50} height={30} />
            <Image src="/footer/amex.png" alt="American Express" width={50} height={30} />
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        © 2025 Doppey, All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
