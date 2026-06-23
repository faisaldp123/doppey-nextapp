"use client";

import { useState } from "react";
import styles from "../../styles/FilterSidebar.module.css";

export default function FilterSidebar({
  filters,
  setFilters,
  brands = [],
  colors = [],
  productTypes = [],
  sizes = [],
  maxPrice = 10000,
}) {
  const [showMoreColors, setShowMoreColors] =
    useState(false);

  const visibleColors =
    showMoreColors
      ? colors
      : colors.slice(0, 8);

  const toggleArrayFilter = (
    key,
    value
  ) => {
    const current =
      filters[key] || [];

    const updated =
      current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value];

    setFilters({
      ...filters,
      [key]: updated,
    });
  };

  return (
    <aside className={styles.sidebar}>
      {/* AVAILABILITY */}

      <div className={styles.filterGroup}>
        <h3>Availability</h3>

        <label>
          <input
            type="checkbox"
            checked={
              filters.inStock || false
            }
            onChange={() =>
              setFilters({
                ...filters,
                inStock:
                  !filters.inStock,
              })
            }
          />

          In Stock
        </label>

        <label>
          <input
            type="checkbox"
            checked={
              filters.outOfStock ||
              false
            }
            onChange={() =>
              setFilters({
                ...filters,
                outOfStock:
                  !filters.outOfStock,
              })
            }
          />

          Out Of Stock
        </label>
      </div>

      {/* PRICE */}

      <div className={styles.filterGroup}>
        <h3>Price</h3>

        <input
          type="range"
          min="0"
          max={maxPrice}
          step="100"
          value={
            filters.maxPrice ||
            maxPrice
          }
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

        <p>
          ₹0 - ₹
          {(
            filters.maxPrice ||
            maxPrice
          ).toLocaleString()}
        </p>
      </div>

      {/* PRODUCT TYPE */}

      <div className={styles.filterGroup}>
        <h3>Product Type</h3>

        {productTypes.length ? productTypes.map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={
                filters.productTypes?.includes(
                  type
                ) || false
              }
              onChange={() =>
                toggleArrayFilter(
                  "productTypes",
                  type
                )
              }
            />

            {type}
          </label>
        )) : <p>No product types yet.</p>}
      </div>

      {/* SIZE */}

      <div className={styles.filterGroup}>
        <h3>Size</h3>

        <div className={styles.sizeGrid}>
          {sizes.length ? sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`${
                styles.sizeBtn
              } ${
                filters.sizes?.includes(
                  size
                )
                  ? styles.activeSize
                  : ""
              }`}
              onClick={() =>
                toggleArrayFilter(
                  "sizes",
                  size
                )
              }
            >
              {size}
            </button>
          )) : <p>No sizes yet.</p>}
        </div>
      </div>

      {/* COLORS */}

      <div className={styles.filterGroup}>
        <h3>Color</h3>

        {visibleColors.length ? visibleColors.map(
          (color) => (
            <label key={color}>
              <input
                type="checkbox"
                checked={
                  filters.colors?.includes(
                    color
                  ) || false
                }
                onChange={() =>
                  toggleArrayFilter(
                    "colors",
                    color
                  )
                }
              />

              {color}
            </label>
          )
        ) : <p>No colors yet.</p>}

        {colors.length > 8 && (
          <button
            type="button"
            className={
              styles.showMoreBtn
            }
            onClick={() =>
              setShowMoreColors(
                !showMoreColors
              )
            }
          >
            {showMoreColors
              ? "Show Less"
              : "Show More"}
          </button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <h3>Brand</h3>

        {brands.length ? brands.map((brand) => (
          <label key={brand}>
            <input
              type="checkbox"
              checked={
                filters.brands?.includes(
                  brand
                ) || false
              }
              onChange={() =>
                toggleArrayFilter(
                  "brands",
                  brand
                )
              }
            />

            {brand}
          </label>
        )) : <p>No brands yet.</p>}
      </div>

      {/* DISCOUNT */}

      <div className={styles.filterGroup}>
        <h3>Discount</h3>

        {[10, 20, 30, 40, 50].map(
          (discount) => (
            <label
              key={discount}
            >
              <input
                type="radio"
                name="discount"
                checked={
                  filters.discount ===
                  discount
                }
                onChange={() =>
                  setFilters({
                    ...filters,
                    discount,
                  })
                }
              />

              {discount}% & Above
            </label>
          )
        )}
      </div>

      {/* CLEAR */}

      <button
        className={
          styles.clearFiltersBtn
        }
        onClick={() =>
          setFilters({
            maxPrice,
            productTypes: [],
            sizes: [],
            colors: [],
            discount: null,
            inStock: false,
            outOfStock: false,
          })
        }
      >
        Clear All Filters
      </button>
    </aside>
  );
}
