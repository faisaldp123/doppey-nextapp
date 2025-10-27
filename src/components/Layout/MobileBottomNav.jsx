import React from "react";
import styles from "@/styles/components/MobileBottomNav.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faHeart,
  faCartShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const MobileBottomNav = () => {
  return (
    <div className={styles.bottom_nav}>
      <Link href="/" className="text-brand d-flex flex-column align-items-center">
        <FontAwesomeIcon icon={faHouse} />
        <small>Home</small>
      </Link>

      <Link href="/search" className="text-brand d-flex flex-column align-items-center">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <small>Search</small>
      </Link>

      <Link href="/wishlist" className="text-brand d-flex flex-column align-items-center position-relative">
        <FontAwesomeIcon icon={faHeart} />
        <small>Wishlist</small>
      </Link>

      <Link href="/cart" className="text-brand d-flex flex-column align-items-center position-relative">
        <FontAwesomeIcon icon={faCartShopping} />
        <small>Cart</small>
        {/* Example cart count badge */}
        <span className={styles.cart_count}>2</span>
      </Link>

      <Link href="/profile" className="text-brand d-flex flex-column align-items-center">
        <FontAwesomeIcon icon={faUser} />
        <small>Profile</small>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
