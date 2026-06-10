"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";

import { useRouter } from "next/navigation";

import styles from "../../styles/TrendingCategories.module.css";

export default function TrendingCategories() {
  const [active, setActive] = useState("ALL");
  const [wishlist, setWishlist] = useState([]);
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

  const products = [
    {
      id: 1,
      category: "CARGO",
      img1: "/products/product-one.jpg",
      img2: "/products/product-two.jpg",
      name: "Cargo Trouser",
      price: "₹1499",
      oldPrice: "₹2499",
    },
    {
      id: 2,
      category: "BOOTCUT",
      img1: "/products/product-three.jpg",
      img2: "/products/product-four.jpg",
      name: "Bootcut Denim",
      price: "₹1699",
      oldPrice: "₹2699",
    },
    {
      id: 3,
      category: "JOGGERS",
      img1: "/products/product-five.jpg",
      img2: "/products/product-six.jpg",
      name: "Urban Jogger",
      price: "₹1199",
      oldPrice: "₹1899",
    },
    {
      id: 4,
      category: "TOPS",
      img1: "/products/product-seven.jpg",
      img2: "/products/product-eight.jpg",
      name: "Graphic Top",
      price: "₹899",
      oldPrice: "₹1499",
    },
    {
      id: 5,
      category: "BAGGY FIT",
      img1: "/products/product-one.jpg",
      img2: "/products/product-two.jpg",
      name: "Baggy Denim",
      price: "₹1899",
      oldPrice: "₹2999",
    },
    {
      id: 6,
      category: "STRAIGHT FIT",
      img1: "/products/product-three.jpg",
      img2: "/products/product-four.jpg",
      name: "Straight Fit Jeans",
      price: "₹1599",
      oldPrice: "₹2399",
    },
    {
      id: 7,
      category: "PANTS",
      img1: "/products/product-five.jpg",
      img2: "/products/product-six.jpg",
      name: "Premium Pants",
      price: "₹1399",
      oldPrice: "₹2199",
    },
    {
      id: 8,
      category: "TOPS",
      img1: "/products/product-seven.jpg",
      img2: "/products/product-eight.jpg",
      name: "Summer Top",
      price: "₹999",
      oldPrice: "₹1499",
    },
  ];

  useEffect(() => {
  const wishlistItems =
    JSON.parse(
      localStorage.getItem("wishlist")
    ) || [];

  setWishlist(
    wishlistItems.map(
      (item) => item.id
    )
  );
}, []);

  const filtered =
    active === "ALL"
      ? products
      : products.filter(
          (item) => item.category === active
        );

  const toggleWishlist = (product) => {
  const existingWishlist =
    JSON.parse(
      localStorage.getItem("wishlist")
    ) || [];

  const alreadyExists =
    existingWishlist.find(
      (item) => item.id === product.id
    );

  let updatedWishlist;

  if (alreadyExists) {
    updatedWishlist =
      existingWishlist.filter(
        (item) =>
          item.id !== product.id
      );
  } else {
    updatedWishlist = [
      ...existingWishlist,
      product,
    ];
  }

  localStorage.setItem(
    "wishlist",
    JSON.stringify(updatedWishlist)
  );

  setWishlist(
    updatedWishlist.map(
      (item) => item.id
    )
  );

  window.dispatchEvent(
    new Event("storage")
  );
};

  return (
    <section className={styles.section}>
      <h2>TRENDING CATEGORIES</h2>

      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={
              active === cat
                ? styles.active
                : ""
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </div>

      <div className={styles.viewAllWrapper}>
        <button className={styles.viewAllBtn}>
          VIEW ALL →
        </button>
      </div>
    </section>
  );
}

function ProductCard({
  item,
  wishlist,
  toggleWishlist,
}) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

useEffect(() => {
  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const exists = cart.find(
    (product) =>
      product.id === item.id
  );

  setAdded(!!exists);
}, [item.id]);

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const alreadyExists = existingCart.find(
      (product) => product.id === item.id
    );

    if (alreadyExists) {
      alert("This product is already in your cart.");
      setAdded(true);
      return;
    }

    const updatedCart = [...existingCart, item];

    localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
);

// Update header cart count instantly
window.dispatchEvent(
  new Event("storage")
);

setAdded(true);

alert(
  `${item.name} has been added to your cart successfully!`
);
  };

  return (
    <div
  className={styles.card}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={() => {
    if (window.innerWidth <= 768) {
      router.push(`/product/${item.id}`);
    }
  }}
>
      <div className={styles.imageWrap}>
        <Image
          src={hover ? item.img2 : item.img1}
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
            fill={
              wishlist.includes(item.id)
                ? "black"
                : "none"
            }
          />
        </button>

        <button
  className={styles.quickBtn}
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/product/${item.id}`);
  }}
>
  QUICK VIEW
</button>
      </div>

      <div className={styles.content}>
        <h5>{item.name}</h5>

        <div className={styles.price}>
          <span>{item.price}</span>
          <del>{item.oldPrice}</del>
        </div>

        <button
          className={`${styles.cartBtn} ${
            added ? styles.addedBtn : ""
          }`}
          onClick={(e) => {
  e.stopPropagation();
  handleAddToCart();
}}
          disabled={added}
        >
          <ShoppingBag size={16} />
          {added
            ? "Added To Cart ✓"
            : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}