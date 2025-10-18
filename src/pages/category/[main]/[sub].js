"use client";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "../../../styles/NewArrivals.module.css";
import { productsData } from "../../../constant/productsData";

export default function CategorySubPage() {
  const router = useRouter();
  const { main, sub } = router.query;

  const filteredProducts = productsData.filter(
    (p) =>
      p.mainCategory === main?.toLowerCase() &&
      p.subCategory === sub?.toLowerCase()
  );

  const title = `${main?.charAt(0).toUpperCase() + main?.slice(1)} - ${sub
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())}`;

  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <p>New Modern Collection</p>

      <div className={`${styles.proContainer} mt-5`}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <Link href={`/product/${p.id}`} key={p.id}>
              <div className={styles.pro}>
                <Image
                  src={p.image}
                  alt={p.name}
                  width={280}
                  height={260}
                  className={styles.proImg}
                />
                <div className={styles.des}>
                  <span>{p.brand}</span>
                  <h5><strong>{p.name}</strong></h5>
                  <div className={styles.star}>{"★".repeat(p.rating)}</div>
                  <h4>${p.price}</h4>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </section>
  );
}
