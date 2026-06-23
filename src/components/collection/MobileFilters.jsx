"use client";

import { X } from "lucide-react";
import styles from "../../styles/MobileFilters.module.css";

export default function MobileFilters({
  isOpen,
  onClose,
  filters,
  setFilters,
  brands = [],
  productTypes = [],
  colors = [],
  sizes = [],
  maxPrice = 10000,
}) {
  if (!isOpen) return null;

  const toggleCheckbox = (
    key,
    value
  ) => {
    const current =
      filters[key] || [];

    if (current.includes(value)) {
      setFilters({
        ...filters,
        [key]: current.filter(
          (item) => item !== value
        ),
      });
    } else {
      setFilters({
        ...filters,
        [key]: [...current, value],
      });
    }
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
      />

      <div className={styles.drawer}>
        <div className={styles.header}>
          <h3>Filters</h3>

          <button
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X size={20} />
          </button>
        </div>

        {/* Availability */}

        <div className={styles.section}>
          <h4>Availability</h4>

          <label>
            <input
              type="checkbox"
              checked={
                filters.inStock
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  inStock:
                    e.target.checked,
                })
              }
            />

            In Stock
          </label>
        </div>

        {/* Price */}

        <div className={styles.section}>
          <h4>Price</h4>

          <input
            type="range"
            min="0"
            max={maxPrice}
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxPrice:
                  Number(
                    e.target.value
                  ),
              })
            }
          />

          <span>
            Up To ₹
            {filters.maxPrice}
          </span>
        </div>

        {/* Product Type */}

        <div className={styles.section}>
          <h4>Product Type</h4>

          {productTypes.map(
            (type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={
                    filters.productTypes?.includes(
                      type
                    )
                  }
                  onChange={() =>
                    toggleCheckbox(
                      "productTypes",
                      type
                    )
                  }
                />

                {type}
              </label>
            )
          )}
        </div>

        {/* Brand */}

        <div className={styles.section}>
          <h4>Brand</h4>

          {brands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={
                  filters.brands?.includes(
                    brand
                  )
                }
                onChange={() =>
                  toggleCheckbox(
                    "brands",
                    brand
                  )
                }
              />

              {brand}
            </label>
          ))}
        </div>

        {/* Sizes */}

        <div className={styles.section}>
          <h4>Sizes</h4>

          <div
            className={styles.sizeGrid}
          >
          {sizes.map((size) => (
              <button
                key={size}
                className={
                  filters.sizes?.includes(
                    size
                  )
                    ? styles.activeSize
                    : ""
                }
                onClick={() =>
                  toggleCheckbox(
                    "sizes",
                    size
                  )
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}

        <div className={styles.section}>
          <h4>Colors</h4>

          {colors.map((color) => (
            <label key={color}>
              <input
                type="checkbox"
                checked={
                  filters.colors?.includes(
                    color
                  )
                }
                onChange={() =>
                  toggleCheckbox(
                    "colors",
                    color
                  )
                }
              />

              {color}
            </label>
          ))}
        </div>

        <button
          className={styles.applyBtn}
          onClick={onClose}
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}
