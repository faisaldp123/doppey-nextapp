"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "../collection/ProductCard";
import API from "@/utils/api";
import { productsData } from "@/constant/productsData";
import {
  getProductId,
  productMatchesPage,
  sortNewestFirst,
} from "@/utils/productHelpers";
import { getWishlist } from "@/utils/shopState";
import styles from "../../styles/NewArrivals.module.css";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
        setProducts(productsData);
      }
    };

    setWishlist(getWishlist());
    loadProducts();
  }, []);

  const newArrivals = useMemo(() => {
    const filtered = products.filter((product) =>
      productMatchesPage(product, "new-arrivals")
    );
    const sorted = sortNewestFirst(filtered);

    const stockRank = (p) => (p.stock === 0 ? 1 : 0);
    sorted.sort((a, b) => stockRank(a) - stockRank(b));

    return sorted.slice(0, 10);
  }, [products]);

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div>
          <h2>NEW ARRIVALS</h2>
          <p>Latest Fashion Collection</p>
        </div>
      </div>

      {newArrivals.length ? (
        <>
          <div className={styles.grid}>
            {newArrivals.map((product) => (
              <ProductCard
                key={getProductId(product)}
                product={product}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            ))}
          </div>

          <div className={styles.viewAllWrap}>
            <Link href="/new-arrivals" className={styles.viewAllBtn}>
              View All New Arrivals
            </Link>
          </div>
        </>
      ) : (
        <p className={styles.emptyText}>New products are coming soon.</p>
      )}
    </section>
  );
}