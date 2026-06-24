"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";
import { addToCart as addProductToCart, toggleWishlist as toggleProductWishlist } from "@/utils/shopState";
import styles from "../../styles/TrendingCategories.module.css";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3C/svg%3E";

export default function TrendingCategories() {
  const [active, setActive] = useState("ALL");
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const categories = [
    "ALL",
    "BOOTCUT",
    "CARGO",
    "STRAIGHT FIT",
    "BAGGY FIT",
    "PANTS",
    "JOGGERS",
    "TOPS",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products/public");
        console.log("ALL PRODUCTS:", res.data);
        res.data.forEach((p) => {
          console.log(p.name, p.images);
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateWishlistState = () => {
      const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(wishlistItems.map((item) => item._id));
    };
    updateWishlistState();
    window.addEventListener("wishlistUpdated", updateWishlistState);
    return () => window.removeEventListener("wishlistUpdated", updateWishlistState);
  }, []);

  const filtered =
    active === "ALL"
      ? products
      : products.filter(
          (item) =>
            item.subCategory?.name?.toUpperCase() === active ||
            item.category?.name?.toUpperCase() === active
        );

  const toggleWishlist = (product) => {
    toggleProductWishlist(product);
  };

  const SkeletonCard = () => (
    <div className={styles.card}>
      <div
        style={{
          width: "100%",
          aspectRatio: "6/7",
          background: "#f0f0f0",
          borderRadius: "8px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ height: "14px", width: "70%", background: "#f0f0f0", borderRadius: "4px" }} />
        <div style={{ height: "14px", width: "40%", background: "#f0f0f0", borderRadius: "4px" }} />
        <div style={{ height: "36px", width: "100%", background: "#f0f0f0", borderRadius: "6px" }} />
      </div>
    </div>
  );

  return (
    <section className={styles.section}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <h2>TRENDING CATEGORIES</h2>

      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={active === cat ? styles.active : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {loading ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#888", padding: "40px 0" }}>
            No products found in this category.
          </p>
        ) : (
          filtered.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))
        )}
      </div>

      <div className={styles.viewAllWrapper}>
        <button
          className={styles.viewAllBtn}
          onClick={() => router.push("/shop")}
        >
          VIEW ALL →
        </button>
      </div>
    </section>
  );
}

function ProductCard({ item, wishlist, toggleWishlist }) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateAddedState = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.some((product) => product._id === item._id);
      setAdded(exists);
    };
    updateAddedState();
    window.addEventListener("cartUpdated", updateAddedState);
    return () => window.removeEventListener("cartUpdated", updateAddedState);
  }, [item._id]);

  const discountedPrice = item.discount
    ? Math.round(item.price - (item.price * item.discount) / 100)
    : item.price;

  const handleAddToCart = () => {
    addProductToCart(item, 1);
  };

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "https://doppey-admin-backend.onrender.com";

  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER;
    if (url.startsWith("http")) return url;
    return `${BASE_URL}/${url}`;
  };

  const img1 = getImageUrl(item.images?.[0]);
  const img2 = getImageUrl(item.images?.[1]) || img1;

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (window.innerWidth <= 768) {
          router.push(`/product/${item.slug}`);
        }
      }}
    >
      <div className={styles.imageWrap}>
        <Image
          src={hover ? img2 : img1}
          alt={item.name}
          width={600}
          height={700}
          className={styles.image}
        />

        <button
          className={styles.wishlist}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}
        >
          <Heart
            size={18}
            fill={wishlist.includes(item._id) ? "black" : "none"}
          />
        </button>

        <button
          className={styles.quickBtn}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/product/${item.slug}`);
          }}
        >
          QUICK VIEW
        </button>
      </div>

      <div className={styles.content}>
        <h5>{item.name}</h5>

        <div className={styles.price}>
          <span>₹{discountedPrice}</span>
          {item.discount > 0 && <del>₹{item.price}</del>}
          {item.discount > 0 && (
            <span style={{ color: "green", fontSize: "12px", fontWeight: 600 }}>
              {item.discount}% off
            </span>
          )}
        </div>

        <button
          className={`${styles.cartBtn} ${added ? styles.addedBtn : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={added}
        >
          <ShoppingBag size={16} />
          {added ? "Added To Cart ✓" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}