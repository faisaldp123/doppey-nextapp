"use client";

import { useState, useEffect, useMemo } from "react";
import {
  SlidersHorizontal
} from "lucide-react";

import FilterSidebar from "./collection/FilterSidebar";
import MobileFilters from "./collection/MobileFilters";
import ProductCard from "./collection/ProductCard";
import QuickViewModal from "./collection/QuickViewModal";
import SortBar from "./collection/SortBar";

import { productsData } from "../constant/productsData";

import styles from "../styles/ProductListingPage.module.css";

export default function ProductListingPage({
  pageType,
}) {
  const [wishlist, setWishlist] =
    useState([]);

  const [filters, setFilters] =
    useState({
      maxPrice: 10000,
      productTypes: [],
      sizes: [],
      colors: [],
      brands: [],
      discount: null,
      inStock: false,
      outOfStock: false,
    });

  const [sortBy, setSortBy] =
    useState("featured");

  const [showMobileFilters,
    setShowMobileFilters] =
    useState(false);

  const [quickViewProduct,
    setQuickViewProduct] =
    useState(null);

  useEffect(() => {
    const storedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlist(storedWishlist);
  }, []);

  const pageProducts =
    useMemo(() => {
      let data = [...productsData];

      switch (pageType) {
        case "new-arrivals":
          data = data.filter(
            (p) => p.isNewArrival
          );
          break;

        case "best-sellers":
          data = data.filter(
            (p) => p.isBestSeller
          );
          break;

        case "clearance-sale":
          data = data.filter(
            (p) => p.discount >= 20
          );
          break;

        case "denims":
          data = data.filter(
            (p) =>
              p.subCategory
                ?.toLowerCase()
                .includes("denim")
          );
          break;

        case "tops":
          data = data.filter(
            (p) =>
              p.subCategory
                ?.toLowerCase()
                .includes("top")
          );
          break;

        default:
          break;
      }

      return data;
    }, [pageType]);

  const filteredProducts =
    useMemo(() => {
      let data = [...pageProducts];

      /* PRICE */

      data = data.filter(
        (product) =>
          product.price <=
          filters.maxPrice
      );

      /* STOCK */

      if (filters.inStock) {
        data = data.filter(
          (p) => p.stock > 0
        );
      }

      if (filters.outOfStock) {
        data = data.filter(
          (p) => p.stock === 0
        );
      }

      /* PRODUCT TYPE */

      if (
        filters.productTypes?.length
      ) {
        data = data.filter((p) =>
          filters.productTypes.some(
            (type) =>
              p.subCategory
                ?.toLowerCase()
                .includes(
                  type.toLowerCase()
                )
          )
        );
      }

      /* SIZES */

      if (filters.sizes?.length) {
        data = data.filter((p) =>
          p.sizes?.some((size) =>
            filters.sizes.includes(size)
          )
        );
      }

      /* COLORS */

      if (filters.colors?.length) {
        data = data.filter((p) =>
          p.colors?.some((color) =>
            filters.colors.includes(color)
          )
        );
      }

      /* BRANDS */

      if (filters.brands?.length) {
        data = data.filter((p) =>
          filters.brands.includes(
            p.brand
          )
        );
      }

      /* DISCOUNT */

      if (filters.discount) {
        data = data.filter(
          (p) =>
            p.discount >=
            filters.discount
        );
      }

      switch (sortBy) {
        case "price-low":
          data.sort(
            (a, b) =>
              a.price - b.price
          );
          break;

        case "price-high":
          data.sort(
            (a, b) =>
              b.price - a.price
          );
          break;

        case "rating":
          data.sort(
            (a, b) =>
              b.rating - a.rating
          );
          break;

        case "discount":
          data.sort(
            (a, b) =>
              b.discount -
              a.discount
          );
          break;

        case "best-selling":
          data.sort(
            (a, b) =>
              Number(
                b.isBestSeller
              ) -
              Number(
                a.isBestSeller
              )
          );
          break;

        default:
          break;
      }

      return data;
    }, [
      pageProducts,
      filters,
      sortBy,
    ]);

  const brands = [
    ...new Set(
      productsData.map(
        (p) => p.brand
      )
    ),
  ];

  const colors = [
    ...new Set(
      productsData.flatMap(
        (p) => p.colors || []
      )
    ),
  ];

  const productTypes = [
    ...new Set(
      productsData.map(
        (p) => p.subCategory
      )
    ),
  ];

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
        />

        <div className={styles.content}>

          {/* <div className={styles.desktopSortBar}>
  <SortBar
    totalProducts={filteredProducts.length}
    sortBy={sortBy}
    setSortBy={setSortBy}
  />
</div> */}

<div className={styles.mobileToolbar}>
  <button
    className={styles.mobileFilterBtn}
    onClick={() =>
      setShowMobileFilters(true)
    }
  >
    <SlidersHorizontal size={18} />
    Filters
  </button>

  <span className={styles.mobileCount}>
    {filteredProducts.length} Products
  </span>
</div>

          <div className={styles.grid}>
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlist={wishlist}
                  setWishlist={
                    setWishlist
                  }
                  onQuickView={
                    setQuickViewProduct
                  }
                />
              )
            )}
          </div>

        </div>
      </div>

      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() =>
          setShowMobileFilters(
            false
          )
        }
        filters={filters}
        setFilters={setFilters}
        brands={brands}
        colors={colors}
        productTypes={productTypes}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() =>
          setQuickViewProduct(null)
        }
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
    </section>
  );
}