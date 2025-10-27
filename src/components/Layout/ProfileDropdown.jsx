import React from "react";
import styles from "@/styles/components/ProfileDropdown.module.css";
import Link from "next/link";

const ProfileDropdown = () => {
  return (
    <div className={styles.dropdown_box}>
      <div className={styles.header}>
        <h5>Welcome</h5>
        <p>To access account and manage orders</p>
        <Link href="/login" className={styles.login_btn}>
          LOGIN / SIGNUP
        </Link>
      </div>

      <ul className={styles.menu}>
        <li><Link href="/orders">Orders</Link></li>
        <li><Link href="/wishlist">Wishlist</Link></li>
        <li><Link href="/gift-cards">Gift Cards</Link></li>
        <li><Link href="/contact">Contact Us</Link></li>
        <li>
          <Link href="/insider">
            Myntra Insider <span className={styles.new_tag}>New</span>
          </Link>
        </li>
        <hr />
        <li><Link href="/credit">Myntra Credit</Link></li>
        <li><Link href="/coupons">Coupons</Link></li>
        <li><Link href="/cards">Saved Cards</Link></li>
        <li><Link href="/vpa">Saved VPA</Link></li>
        <li><Link href="/addresses">Saved Addresses</Link></li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
