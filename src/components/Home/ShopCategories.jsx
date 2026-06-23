import Image from "next/image";
import styles from "../../styles/ShopCategories.module.css";

export default function ShopCategories() {
const categories = [
{
title: "ALL",
image: "/products/product-one.jpg",
},
{
title: "MEN",
image: "/products/product-two.jpg",
},
{
title: "WOMEN",
image: "/products/product-three.jpg",
},
{
title: "KIDS",
image: "/products/product-four.jpg",
},
];

return ( <section className={styles.section}> <div className={styles.heading}> <h2>SHOP BY CATEGORY</h2> <p>Explore the latest collections</p> </div>


  <div className={styles.grid}>
    {categories.map((item, index) => (
      <div className={styles.card} key={index}>
        <Image
          src={item.image}
          alt={item.title}
          width={600}
          height={700}
          className={styles.image}
        />

        <div className={styles.overlay}>
          <h3>{item.title}</h3>
          <button>SHOP NOW</button>
        </div>
      </div>
    ))}
  </div>
</section>

);
}
