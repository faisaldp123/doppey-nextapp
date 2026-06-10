"use client";

import styles from "../../styles/SortBar.module.css";

export default function SortBar({
  totalProducts,
  sortBy,
  setSortBy,
}) {
  return (
    <div className={styles.sortBar}>
      <div className={styles.left}>
        <h4>
          {totalProducts} Products
        </h4>
      </div>

      <div className={styles.right}>
        <span>Sort By :</span>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="featured">
            Featured
          </option>

          <option value="newest">
            Newest First
          </option>

          <option value="price-low">
            Price: Low To High
          </option>

          <option value="price-high">
            Price: High To Low
          </option>

          <option value="rating">
            Customer Rating
          </option>

          <option value="discount">
            Discount
          </option>

          <option value="best-selling">
            Best Selling
          </option>
        </select>
      </div>
    </div>
  );
}