"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  X,
  ChevronDown,
  Heart,
  User,
  Menu,
} from "lucide-react";
import styles from "../../styles/Header.module.css";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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
    },
    Womens: {
      left: [
        "Womens Dresses",
        "Womens Tops",
        "Womens Winter Collection",
        "Womens Accessories",
      ],
    },
    Kids: {
      left: [
        "Kids New Arrivals",
        "Kids T-Shirts",
        "Kids Shorts",
        "Kids Winter Collection",
      ],
    },
  };

  return (
    <>
      <header className={`navbar py-3 shadow-sm ${styles.header}`}>
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link href="/" className="d-inline-block" style={{ lineHeight: 0 }}>
            <Image
              alt="Doppey Logo"
              src="/logo-new.bmp"
              width={400}
              height={450}
              className={styles.logo}
            />
          </Link>

          {/* Desktop Navigation */}
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
                    megaMenuData[link.name]
                      ? setActiveMenu(link.name)
                      : setActiveMenu(null)
                  }
                >
                  <Link
                    href={link.href}
                    className={`${styles.navLink} d-flex align-items-center`}
                  >
                    {link.name}
                    {megaMenuData[link.name] && (
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
                    </div>
                  )}
                </li>
              ))}

              {/* Icons */}
              <li className="nav-item ms-2">
                <Search
                  className={styles.searchIcon}
                  onClick={() => setShowSearch(true)}
                />
              </li>

              <li className="nav-item ms-2">
                <Link href="/wishlist">
                  <Heart
                    className={`${styles.wishlistIcon} ${
                      pathname === "/wishlist" ? styles.active : ""
                    }`}
                  />
                </Link>
              </li>

              <li className="nav-item ms-2">
                <Link href="/cart">
                  <ShoppingBag className={styles.cartIcon} />
                </Link>
              </li>

              {/* Profile Dropdown */}
              <li
                className={`nav-item position-relative ${styles.profileWrapper}`}
              >
                <div
                  onMouseEnter={() => setActiveMenu("profile")}
                  onMouseLeave={() => setActiveMenu(null)}
                  className={styles.profileArea}
                >
                  <User className={styles.profileIcon} />

                  {activeMenu === "profile" && (
                    <div className={styles.profileDropdown}>
                      <ul>
                        <li>
                          <Link href="/profile">My Profile</Link>
                        </li>
                        <li>
                          <Link href="/orders">My Orders</Link>
                        </li>
                        <li>
                          <Link href="/wishlist">Wishlist</Link>
                        </li>
                        <li>
                          <Link href="/cart">Cart</Link>
                        </li>
                        <li>
                          <button
                            className={styles.logoutBtn}
                            onClick={() =>
                              alert("Logged out successfully!")
                            }
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Mobile View */}
          <div
            className={`d-flex align-items-center d-lg-none ${styles.mobileHeaderRight}`}
          >
            <Search
              className={`${styles.searchIcon} me-3`}
              onClick={() => setShowSearch(true)}
            />
            <Menu
              className={styles.hamburgerIcon}
              onClick={() => setMenuOpen(true)}
            />
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

      {/* Mobile Side Menu */}
      <div className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}>
        <div className={styles.sideMenuHeader}>
          <X size={28} onClick={() => setMenuOpen(false)} />
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
    </>
  );
}
