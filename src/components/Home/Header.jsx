"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import styles from "../../styles/Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className={`navbar navbar-expand-lg py-2 shadow-sm ${styles.header}`}>
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link href="/" className={`navbar-brand ${styles.logo}`}>
            Doppey<span className={styles.purple}>✿</span>
          </Link>

          {/* Right icons (Visible on mobile) */}
          <div className={`d-flex align-items-center ${styles.mobileIcons}`}>
            <Search
              className={`${styles.searchIcon} me-3`}
              onClick={() => setShowSearch(true)}
            />
            <ShoppingBag className={`${styles.cartIcon} me-2`} />
            <button
              className="navbar-toggler border-0"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-controls="navbarNav"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Menu */}
          <div
            className={`collapse navbar-collapse justify-content-end ${
              menuOpen ? "show" : ""
            }`}
            id="navbarNav"
          >
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

              {/* Search Icon (hidden on small screens) */}
              <li className={`nav-item ms-lg-3 d-none d-lg-block`}>
                <Search
                  className={styles.searchIcon}
                  onClick={() => setShowSearch(true)}
                />
              </li>

              {/* Cart (hidden on small screens) */}
              <li className={`nav-item ms-lg-3 d-none d-lg-block`}>
                <ShoppingBag className={styles.cartIcon} />
              </li>

              {/* Sign In */}
              <li className="nav-item ms-lg-3">
                <button
                  className={styles.sign_button}
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

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
