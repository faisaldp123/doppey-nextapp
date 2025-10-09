"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, X } from "lucide-react";
import styles from "../../styles/Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className={`navbar py-2 shadow-sm ${styles.header}`}>
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link href="/" className={`navbar-brand ${styles.logo}`}>
            Doppey<span className={styles.purple}>✿</span>
          </Link>

          {/* Mobile Icons */}
          <div className={`d-flex align-items-center ${styles.mobileIcons}`}>
            <Search
              className={`${styles.searchIcon} me-3`}
              onClick={() => setShowSearch(true)}
            />
            <ShoppingBag className={`${styles.cartIcon} me-2`} />
            <button
              className="navbar-toggler border-0"
              type="button"
              onClick={() => setMenuOpen(true)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex align-items-center">
            <ul className={`navbar-nav align-items-lg-center ${styles.navList}`}>
              {[
                { name: "Home", href: "/", active: true },
                { name: "Mens", href: "/mens" },
                { name: "Womens", href: "/womens" },
                { name: "Kids", href: "/kids" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name} className="nav-item">
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${
                      link.active ? styles.active : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Side Drawer for mobile */}
      <div
        className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}
      >
        <div className={styles.sideMenuHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <ul className={styles.sideMenuList}>
          {[
            { name: "Home", href: "/" },
            { name: "Mens", href: "/mens" },
            { name: "Womens", href: "/womens" },
            { name: "Kids", href: "/kids" },
            { name: "Contact", href: "/contact" },
          ].map((link) => (
            <li key={link.name}>
              <Link href={link.href} onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Search products..." />
            <button onClick={() => setShowSearch(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showLogin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Sign In</h3>
            <form className={styles.loginForm}>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
              <p>
                Don’t have an account?{" "}
                <a href="#" className={styles.link}>
                  Sign Up
                </a>
              </p>
            </form>
            <button
              className={styles.closeBtn}
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
