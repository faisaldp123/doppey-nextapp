"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, X, ChevronDown, Heart } from "lucide-react";
import styles from "../../styles/Header.module.css";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Mens", href: "/mens" },
    { name: "Womens", href: "/womens" },
    { name: "Kids", href: "/kids" },
    { name: "Contact", href: "/contact-us" },
  ];

  const megaMenuData = {
  Mens: {
    left: [
      "Mens Winter Collection",
      "Mens T-Shirts",
      "Mens Hoodies",
      "Mens Jackets",
      "Mens Accessories",
    ],
    right: [
      "/products/men1.jpg",
      "/products/men2.jpg",
      "/products/men3.jpg",
      "/products/men4.jpg",
    ],
  },
  Womens: {
    left: [
      "Womens Dresses",
      "Womens Tops",
      "Womens Winter Collection",
      "Womens Accessories",
    ],
    right: [
      "/products/women1.jpg",
      "/products/women2.jpg",
      "/products/women3.jpg",
      "/products/women4.jpg",
    ],
  },
  Kids: {
    left: [
      "Kids New Arrivals",
      "Kids T-Shirts",
      "Kids Shorts",
      "Kids Winter Collection",
    ],
    right: [
      "/products/kids1.jpg",
      "/products/kids2.jpg",
      "/products/kids3.jpg",
      "/products/kids4.jpg",
    ],
  },
};


  return (
    <>
      <header className={`navbar py-2 shadow-sm ${styles.header}`}>
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link href="/" className={`navbar-brand ${styles.logo}`}>
            Doppey<span className={styles.purple}>✿</span>
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex align-items-center position-relative">
            <ul
              className={`navbar-nav align-items-center ${styles.navList} flex-row`}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {navLinks.map((link) => (
                <li
                  key={link.name}
                  className={`nav-item ${styles.navItem}`}
                  onMouseEnter={() =>
                    megaMenuData[link.name] ? setActiveMenu(link.name) : setActiveMenu(null)
                  }
                >
                  <Link href={link.href} className={`${styles.navLink} d-flex align-items-center`}>
      {link.name}
      {megaMenuData[link.name] && ( // show arrow only if dropdown exists
        <ChevronDown size={16} className="ms-1" />
      )}
    </Link>

                  {/* Mega Menu */}
                  {activeMenu === link.name && megaMenuData[link.name] && (
  <div
    className={styles.megaMenu}
    onMouseEnter={() => setActiveMenu(link.name)}
    onMouseLeave={() => setActiveMenu(null)}
  >
    {/* Left Column */}
    <div className={styles.megaMenuLeft}>
      <ul>
        {megaMenuData[link.name].left.map((item, idx) => (
          <li key={idx}>
            <Link
              href={`/category/${item
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/’/g, "")}`}
              className={styles.megaLink}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* Right Column (optional) */}
    {/* <div className={styles.megaMenuRight}>
      {megaMenuData[link.name].right.map((img, idx) => (
        <div key={idx} className={styles.imageCard}>
          <Image
            src={img}
            alt={link.name}
            width={400}
            height={550}
            className={styles.menuImage}
          />
        </div>
      ))}
    </div> */}
  </div>
)}

                </li>
              ))}

              <li className="nav-item ms-3">
                <Search
                  className={styles.searchIcon}
                  onClick={() => setShowSearch(true)}
                />
              </li>
              <li className="nav-item ms-3">
                <Link href='/wishlist'>
                <Heart className={`${styles.wishlistIcon} ${pathname === '/wishlist' ? styles.active : ''}`} />
                </Link>
              </li>
              <li className="nav-item ms-3">
                <Link href='/cart'>
                <ShoppingBag className={styles.cartIcon} />
                </Link>
              </li>
              <li className="nav-item ms-3">
                <button
                  className={styles.sign_button}
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Icons */}
          <div className={`d-flex align-items-center d-lg-none ${styles.mobileIcons}`}>
            <Search
              className={`${styles.searchIcon} me-3`}
              onClick={() => setShowSearch(true)}
            />
            <Link href='/wishlist'>
                <Heart className={`${styles.wishlistIcon} ${pathname === '/wishlist' ? styles.active : ''}`} />
                </Link>
            <button
              className="navbar-toggler border-0"
              onClick={() => setMenuOpen(true)}
            ></button>
            <Link href='/cart'>
                <ShoppingBag className={styles.cartIcon} />
                </Link>
            <button
              className="navbar-toggler border-0"
              onClick={() => setMenuOpen(true)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.sideMenuHeader}>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <ul className={styles.sideMenuList}>
          {navLinks.map((link) => (
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
