"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Searchbar from "./Searchbar";
import LoginModal from "./LoginModal";
import AccountModal from "./AccountModal";

import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import styles from "../../styles/Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [user, setUser] = useState(null);

  const userBtnRef = useRef(null);

  const mainLinks = [
    { name: "NEW ARRIVALS", href: "/new-arrivals" },
    { name: "BEST SELLERS", href: "/best-sellers" },
    { name: "CLEARANCE SALE", href: "/clearance-sale" },
    { name: "DENIMS", href: "/denims" },
    { name: "TOPS", href: "/tops" },
    { name: "PANTS & TROUSERS", href: "/pants-trousers" },
    { name: "SKIRTS", href: "/skirts" },
    { name: "CORD SETS", href: "/cord-sets" },
    { name: "ACCESSORIES", href: "/accessories" },
  ];

  const megaMenus = {
    MEN: {
      categories: [
        "Oversized T-Shirts",
        "Graphic Tees",
        "Shirts",
        "Denims",
        "Cargo Pants",
        "Joggers",
        "Hoodies",
        "Accessories",
      ],
      products: [
        { image: "/products/product-one.jpg", title: "Oversized Tee", price: "₹999", oldPrice: "₹1499" },
        { image: "/products/product-two.jpg", title: "Cargo Pant", price: "₹1499", oldPrice: "₹2499" },
        { image: "/products/product-three.jpg", title: "Premium Hoodie", price: "₹1999", oldPrice: "₹2999" },
      ],
    },
    WOMEN: {
      categories: [
        "Tops",
        "Oversized",
        "Co-Ord Sets",
        "Skirts",
        "Denims",
        "Cargo",
        "Dresses",
        "Accessories",
      ],
      products: [
        { image: "/products/product-four.jpg", title: "Oversized Top", price: "₹899", oldPrice: "₹1499" },
        { image: "/products/product-five.jpg", title: "Skirt", price: "₹1299", oldPrice: "₹1999" },
        { image: "/products/product-six.jpg", title: "Co-Ord Set", price: "₹1999", oldPrice: "₹2999" },
      ],
    },
    KIDS: {
      categories: [
        "New Arrivals",
        "T-Shirts",
        "Shorts",
        "Denims",
        "Joggers",
        "Winter Wear",
      ],
      products: [
        { image: "/products/product-seven.jpg", title: "Kids Tee", price: "₹699", oldPrice: "₹999" },
        { image: "/products/product-eight.jpg", title: "Kids Jogger", price: "₹899", oldPrice: "₹1299" },
      ],
    },
  };

  // Sync user from localStorage
  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    updateUser();
    window.addEventListener("user-login", updateUser);
    return () => window.removeEventListener("user-login", updateUser);
  }, []);

  // Sync cart + wishlist counts
  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
      setWishlistCount(wishlist.length);
    };
    updateCounts();
    window.addEventListener("storage", updateCounts);
    return () => window.removeEventListener("storage", updateCounts);
  }, []);

  // Close account panel on outside click
  useEffect(() => {
    if (!showAccount) return;
    const handler = (e) => {
      if (userBtnRef.current && !userBtnRef.current.contains(e.target)) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAccount]);

  return (
    <>
      {/* Announcement Bar */}
      <div className={styles.topBar}>
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      {/* Main Header */}
      <header className={styles.header}>
        <div className="container-fluid">

          {/* ROW 1 */}
          <div className={styles.headerTop}>

            {/* Mobile Menu */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className={styles.logoWrap}>
              <Image
                src="/logo-new.webp"
                alt="Doppey"
                width={180}
                height={60}
                className={styles.logo}
              />
            </Link>

            {/* Main Navigation */}
            <nav className={styles.mainNav}>
              {mainLinks.map((item) => (
                <Link key={item.name} href={item.href} className={styles.navLink}>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className={styles.headerIcons}>

              <button
                className={styles.iconBtn}
                onClick={() => setShowSearch(true)}
              >
                <Search size={20} />
              </button>

              <Link href="/wishlist" className={styles.iconBtn}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className={styles.wishlistCount}>{wishlistCount}</span>
                )}
              </Link>

              {/* User icon + account dropdown anchored together */}
              <div style={{ position: "relative" }} ref={userBtnRef}>
                <button
                  className={styles.iconBtn}
                  onClick={() => {
                    if (user) {
                      setShowAccount((prev) => !prev);
                    } else {
                      setShowLogin(true);
                    }
                  }}
                >
                  <User size={20} />
                </button>

                <AccountModal
                  open={showAccount}
                  onClose={() => setShowAccount(false)}
                  user={user}
                />
              </div>

              <Link href="/cart" className={styles.iconBtn}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className={styles.cartCount}>{cartCount}</span>
                )}
              </Link>

            </div>
          </div>

          {/* ROW 2 — Gender mega menu */}
          <div className={styles.genderNav}>
            {["MEN", "WOMEN", "KIDS"].map((item) => (
              <div
                key={item}
                className={styles.genderItem}
                onMouseEnter={() => setActiveMegaMenu(item)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className={styles.genderBtn}>
                  {item}
                  <ChevronDown size={15} />
                </button>

                {activeMegaMenu === item && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaLeft}>
                      <h4>SHOP {item}</h4>
                      <ul>
                        {megaMenus[item].categories.map((category, index) => (
                          <li key={index}>
                            <Link href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}>
                              {category}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.megaRight}>
                      {megaMenus[item].products.map((product, index) => (
                        <div key={index} className={styles.productCard}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={300}
                            height={380}
                            className={styles.productImage}
                          />
                          <h5>{product.title}</h5>
                          <div className={styles.productPrice}>
                            <span>{product.price}</span>
                            <del>{product.oldPrice}</del>
                          </div>
                          <Link href="/shop" className={styles.shopNowBtn}>
                            SHOP NOW
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </header>

      {/* Searchbar */}
      <Searchbar open={showSearch} onClose={() => setShowSearch(false)} />

      {/* Login Modal */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <Image
            src="/logo-new.webp"
            alt="Doppey"
            width={180}
            height={60}
            className={styles.logo}
          />
          <button onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.drawerLinks}>
          {mainLinks.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.name}
            </Link>
          ))}

          <hr />

          <Link href="/men">MEN</Link>
          <Link href="/women">WOMEN</Link>
          <Link href="/kids">KIDS</Link>

          <hr />

          {user ? (
            <button
              className={styles.mobileLogin}
              onClick={() => {
                setMenuOpen(false);
                setShowAccount(true);
              }}
            >
              MY ACCOUNT
            </button>
          ) : (
            <button
              className={styles.mobileLogin}
              onClick={() => {
                setMenuOpen(false);
                setShowLogin(true);
              }}
            >
              LOGIN / SIGNUP
            </button>
          )}
        </div>
      </div>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}