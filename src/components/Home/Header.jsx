"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Searchbar from "./Searchbar";
import LoginModal from "./LoginModal";
import AccountModal from "./AccountModal";
import API from "@/utils/api";
import { productsData } from "@/constant/productsData";
import { loadUserDataFromBackend } from "@/utils/shopState";
import {
  getImageUrl,
  getProductSlug,
  readName,
  slugify,
} from "@/utils/productHelpers";

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

const getDiscountedPrice = (product) => {
  const base = Number(product.price) || 0;
  return product.discount
    ? Math.round(base - (base * product.discount) / 100)
    : base;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  const userBtnRef = useRef(null);

  const mainLinks = [
    { name: "NEW ARRIVALS",      href: "/new-arrivals" },
    { name: "SUMMER COLLECTION", href: "/summer-collection" },
    { name: "BEST SELLERS",      href: "/best-sellers" },
    { name: "CLEARANCE SALE",    href: "/clearance-sale" },
    { name: "ACCESSORIES",       href: "/accessories" },
  ];

  const fallbackMegaMenus = {
    MEN:   { categories: ["Oversized T-Shirts", "Graphic Tees", "Shirts", "Denims", "Cargo Pants", "Joggers", "Hoodies", "Accessories"], products: [] },
    WOMEN: { categories: ["Tops", "Oversized", "Co-Ord Sets", "Skirts", "Denims", "Cargo", "Dresses", "Accessories"], products: [] },
    KIDS:  { categories: ["New Arrivals", "T-Shirts", "Shorts", "Denims", "Joggers", "Winter Wear"], products: [] },
  };

  const genderConfig = { MEN: "mens", WOMEN: "womens", KIDS: "kids" };

  const genderMenus = [
    { label: "MEN",   slug: "mens"   },
    { label: "WOMEN", slug: "womens" },
    { label: "KIDS",  slug: "kids"   },
  ];

  const megaMenus = useMemo(() => {
    return Object.entries(genderConfig).reduce((menus, [gender, categorySlug]) => {
      const genderProducts = products.filter((product) => {
        const cat = product.category;
        const catSlug = typeof cat === "object"
          ? (cat.slug || slugify(cat.name || ""))
          : slugify(cat || "");
        return catSlug === categorySlug;
      });

      const categories = [
        ...new Set(genderProducts.map((p) => readName(p.subCategory)).filter(Boolean)),
      ];

      const newestProducts = [...genderProducts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      menus[gender] = {
        categories: categories.length ? categories : fallbackMegaMenus[gender].categories,
        products: newestProducts,
      };

      return menus;
    }, {});
  }, [products]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch header products:", error);
        setProducts(productsData);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
      if (stored) {
        await loadUserDataFromBackend();
      }
    };

    updateUser();
    window.addEventListener("user-login", updateUser);

    const openLogin = () => setShowLogin(true);
    window.addEventListener("open-login-modal", openLogin);

    const seen     = localStorage.getItem("doppeyLoginPromptSeen");
    const loggedIn = localStorage.getItem("user");
    if (!seen && !loggedIn) {
      localStorage.setItem("doppeyLoginPromptSeen", "1");
      setShowLogin(true);
    }

    return () => {
      window.removeEventListener("user-login", updateUser);
      window.removeEventListener("open-login-modal", openLogin);
    };
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      const cart     = JSON.parse(localStorage.getItem("cart"))     || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
      setWishlistCount(wishlist.length);
    };

    updateCounts();
    window.addEventListener("storage",         updateCounts);
    window.addEventListener("cartUpdated",     updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);

    return () => {
      window.removeEventListener("storage",         updateCounts);
      window.removeEventListener("cartUpdated",     updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

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
      <div className={styles.topBar}>
        FREE SHIPPING ON ORDERS ABOVE ₹1999
      </div>

      <header className={styles.header}>
        <div className="container-fluid">

          <div className={styles.headerTop}>

            <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>

            <Link href="/" className={styles.logoWrap}>
              <Image src="/logo-new.webp" alt="Doppey" width={180} height={60} className={styles.logo} />
            </Link>

            <nav className={styles.mainNav}>
              {mainLinks.map((item) => (
                <Link key={item.name} href={item.href} className={styles.navLink}>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className={styles.headerIcons}>

              <button className={styles.iconBtn} onClick={() => setShowSearch(true)}>
                <Search size={20} />
              </button>

              <Link href="/wishlist" className={styles.iconBtn}>
                <Heart size={20} />
                {wishlistCount > 0 && <span className={styles.wishlistCount}>{wishlistCount}</span>}
              </Link>

              <Link href="/cart" className={styles.iconBtn}>
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
              </Link>

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
                <AccountModal open={showAccount} onClose={() => setShowAccount(false)} user={user} />
              </div>

            </div>
          </div>

          <div className={styles.genderNav}>
            {genderMenus.map((item) => (
              <div
                key={item.label}
                className={styles.genderItem}
                onMouseEnter={() => setActiveMegaMenu(item.label)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className={styles.genderBtn}>
                  {item.label}
                  <ChevronDown size={15} />
                </button>

                {activeMegaMenu === item.label && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaLeft}>
                      <h4>SHOP {item.label}</h4>
                      <ul>
                        {megaMenus[item.label]?.categories.map((category, index) => (
                          <li key={index}>
                            <Link href={`/category/${item.slug}/${slugify(category)}`}>
                              {category}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.megaRight}>
                      {megaMenus[item.label]?.products?.length ? (
                        megaMenus[item.label].products.map((product) => (
                          <div key={getProductSlug(product)} className={styles.productCard}>
                            <Image
                              src={getImageUrl(product.images?.[0])}
                              alt={product.name}
                              width={300}
                              height={380}
                              className={styles.productImage}
                            />
                            <h5>{product.name}</h5>

                            {/* ← Fixed price display with discount */}
                            <div className={styles.productPrice}>
                              <span>
                                ₹{getDiscountedPrice(product).toLocaleString("en-IN")}
                              </span>
                              {product.discount > 0 && (
                                <del>
                                  ₹{Number(product.price).toLocaleString("en-IN")}
                                </del>
                              )}
                            </div>

                            <Link href={`/product/${getProductSlug(product)}`} className={styles.shopNowBtn}>
                              SHOP NOW
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className={styles.productCard}>
                          <h5>Products coming soon</h5>
                          <p style={{ fontSize: "13px", color: "#888" }}>New styles are being added.</p>
                          <Link href={`/${item.slug}`} className={styles.shopNowBtn}>VIEW SECTION</Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </header>

      <Searchbar open={showSearch} onClose={() => setShowSearch(false)} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />

      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <Image src="/logo-new.webp" alt="Doppey" width={180} height={60} className={styles.logo} />
          <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
        </div>

        <div className={styles.drawerLinks}>
          {mainLinks.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.name}
            </Link>
          ))}

          <hr />

          <Link href="/category/mens">MEN</Link>
          <Link href="/category/womens">WOMEN</Link>
          <Link href="/category/kids">KIDS</Link>

          <hr />

          {user ? (
            <button className={styles.mobileLogin} onClick={() => { setMenuOpen(false); setShowAccount(true); }}>
              MY ACCOUNT
            </button>
          ) : (
            <button className={styles.mobileLogin} onClick={() => { setMenuOpen(false); setShowLogin(true); }}>
              LOGIN / SIGNUP
            </button>
          )}
        </div>
      </div>

      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
    </>
  );
}