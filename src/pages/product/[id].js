"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { productsData } from "../../constant/productsData";
import styles from "../../styles/ProductDetail.module.css";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [mainImg, setMainImg] = useState(null);

  const product = productsData.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (product) setMainImg(product.image);
  }, [product]);

  if (!product) return <p>Product not found</p>;

  const related = productsData.filter(
    (p) =>
      p.mainCategory === product.mainCategory &&
      p.subCategory === product.subCategory &&
      p.id !== product.id
  );

  const thumbnails = [
    "/products/product-two.jpg",
    "/products/product-three.jpg",
    "/products/product-four.jpg",
    "/products/product-one.jpg",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.productSection}>
        {/* ==== LEFT: IMAGES ==== */}
        <div className={styles.imageContainer}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={mainImg}
              alt={product.name}
              width={500}
              height={500}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.thumbnailRow}>
            {thumbnails.map((img, i) => (
              <div key={i} className={styles.thumbnailWrapper}>
                <Image
                  src={img}
                  alt={`Thumbnail ${i}`}
                  width={100}
                  height={100}
                  onClick={() => setMainImg(img)}
                  className={`${styles.thumbnail} ${
                    mainImg === img ? styles.activeThumb : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ==== RIGHT: DETAILS ==== */}
        <div className={styles.details}>
          {/* Name and Price in one line */}
            <h2>{product.name}</h2>
            <h3>${product.price}</h3>

          <h4>Product Details</h4>
          <p>
            Elevate your style with the {product.name}. Designed by {product.brand} 
            for comfort and a modern look. Perfect for casual outings, gym wear, 
            or everyday fashion. Crafted with premium fabric and a cosmic design 
            that makes you stand out.
          </p>

          {/* Size + Button in one line */}
          <div className={styles.actionRow}>
            <select className={styles.sizeSelect}>
              <option>Select Size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>XL</option>
              <option>XXL</option>
            </select>
            <button className={styles.addBtn}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* ==== RELATED PRODUCTS ==== */}
      <div className={styles.relatedSection}>
        <h2>Related Products</h2>
        <p>Similar items you may like</p>

        <div className={styles.relatedGrid}>
          {related.length > 0 ? (
            related.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id}>
                <div className={styles.relatedItem}>
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={250}
                    height={250}
                    className={styles.relatedImg}
                  />
                  <h5>{p.name}</h5>
                  <div className={styles.star}>{"★".repeat(p.rating)}</div>
                  <h4>${p.price}</h4>
                </div>
              </Link>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
