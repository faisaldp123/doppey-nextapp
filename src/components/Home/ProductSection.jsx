"use client";
import Image from "next/image";
import styles from "../../styles/ProductSection.module.css";

export default function ProductSection() {
  const products = [
    { img: "/products/product-one.jpg", name: "Cartoon Astronaut T-Shirt", price: "$78" },
    { img: "/products/product-two.jpg", name: "Space Graphic Tee", price: "$85" },
    { img: "/products/product-three.jpg", name: "Galaxy Printed Hoodie", price: "$95" },
    { img: "/products/product-four.jpg", name: "Cosmic Oversized Tee", price: "$70" },
    { img: "/products/product-five.jpg", name: "Astronaut Crewneck", price: "$90" },
    { img: "/products/product-six.jpg", name: "Nebula Sweatshirt", price: "$75" },
    { img: "/products/product-seven.jpg", name: "Planet Design Shirt", price: "$80" },
    { img: "/products/product-eight.jpg", name: "Moonwalk Cotton Tee", price: "$88" },
  ];

  return (
    <section id="product1" className={styles.section}>
      <h2>Featured Products</h2>
      <p>Winter Collection New Modern Design</p>

      <div className={styles.proContainer}>
        {products.map((p, i) => (
          <div className={styles.pro} key={i}>
            <Image
              src={p.img}
              alt={p.name}
              width={280}
              height={260}
              className={styles.proImg}
            />
            <div className={styles.des}>
              <span>adidas</span>
              <h5><strong>{p.name}</strong></h5>
              <div className={styles.star}>★★★★★</div>
              <h4>{p.price}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
