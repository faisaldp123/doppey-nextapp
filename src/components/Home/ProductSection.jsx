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
import styles from "../../styles/ProductSection.module.css";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch summer collection:", error);
        setProducts(productsData);
      }
    };

    setWishlist(getWishlist());
    loadProducts();
  }, []);

  const summerProducts = useMemo(
    () =>
      sortNewestFirst(
        products.filter((product) =>
          productMatchesPage(product, "summer-collection")
        )
      ).slice(0, 10),
    [products]
  );

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div>
          <h2>SUMMER COLLECTION</h2>
          <p>Lightweight styles for warm days</p>
        </div>
      </div>

      {summerProducts.length ? (
        <>
          <div className={styles.grid}>
            {summerProducts.map((product) => (
              <ProductCard
                key={getProductId(product)}
                product={product}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            ))}
          </div>

          <div className={styles.viewAllWrap}>
            <Link href="/summer-collection" className={styles.viewAllBtn}>
              View All Summer Collection
            </Link>
          </div>
        </>
      ) : (
        <p className={styles.emptyText}>Summer products are coming soon.</p>
      )}
    </section>
  );
}