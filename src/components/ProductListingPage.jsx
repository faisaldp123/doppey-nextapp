"use client";

import { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

import FilterSidebar from "./collection/FilterSidebar";
import MobileFilters from "./collection/MobileFilters";
import ProductCard from "./collection/ProductCard";
import QuickViewModal from "./collection/QuickViewModal";

import API from "@/utils/api";
import { productsData } from "@/constant/productsData";
import {
  readName,
  slugify,
  getProductId,
  productMatchesPage,
  sortNewestFirst,
} from "@/utils/productHelpers";

import styles from "../styles/ProductListingPage.module.css";

// Get exact category slug from product
const getCatSlug = (product) => {
  const cat = product.category;
  if (!cat) return "";
  if (typeof cat === "object") return cat.slug || slugify(cat.name || "");
  return slugify(cat);
};

// Get exact subcategory slug from product
const getSubCatSlug = (product) => {
  const sub = product.subCategory;
  if (!sub) return "";
  if (typeof sub === "object") return sub.slug || slugify(sub.name || "");
  return slugify(sub);
};

export default function ProductListingPage({
  pageType,
  mainCategory,
  subCategory,
  title,
}) {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    maxPrice: 10000,
    productTypes: [],
    sizes: [],
    colors: [],
    brands: [],
    discount: null,
    inStock: false,
    outOfStock: false,
  });

  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts(productsData);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const pageProducts = useMemo(() => {
    let data = [...products];

    // Filter by main category — matches DB slug exactly e.g. "mens", "womens", "kids"
    if (mainCategory) {
      data = data.filter((p) => getCatSlug(p) === mainCategory);
    }

    // Filter by subcategory — matches DB slug exactly e.g. "summer-collection"
    if (subCategory) {
      data = data.filter((p) => getSubCatSlug(p) === subCategory);
    }

    // Filter by page type
    if (pageType) {
      data = data.filter((p) => productMatchesPage(p, pageType));
    }

    if (pageType === "new-arrivals") {
      data = sortNewestFirst(data);
    }

    return data;
  }, [pageType, products, mainCategory, subCategory]);

  const filteredProducts = useMemo(() => {
    let data = [...pageProducts];

    data = data.filter((p) => p.price <= filters.maxPrice);

    if (filters.inStock)    data = data.filter((p) => p.stock > 0);
    if (filters.outOfStock) data = data.filter((p) => p.stock === 0);

    if (filters.productTypes?.length) {
      data = data.filter((p) =>
        filters.productTypes.some((type) =>
          getSubCatSlug(p).includes(type.toLowerCase())
        )
      );
    }

    if (filters.sizes?.length) {
      data = data.filter((p) => p.sizes?.some((s) => filters.sizes.includes(s)));
    }

    if (filters.colors?.length) {
      data = data.filter((p) => p.colors?.some((c) => filters.colors.includes(c)));
    }

    if (filters.brands?.length) {
      data = data.filter((p) => filters.brands.includes(p.brand));
    }

    if (filters.discount) {
      data = data.filter((p) => p.discount >= filters.discount);
    }

    switch (sortBy) {
      case "price-low":  data.sort((a, b) => a.price - b.price); break;
      case "price-high": data.sort((a, b) => b.price - a.price); break;
      case "rating":     data.sort((a, b) => b.rating - a.rating); break;
      case "discount":   data.sort((a, b) => b.discount - a.discount); break;
      case "best-selling": data.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller)); break;
      default: break;
    }

    return data;
  }, [pageProducts, filters, sortBy]);

  const brands       = [...new Set(pageProducts.map((p) => p.brand).filter(Boolean))];
  const colors       = [...new Set(pageProducts.flatMap((p) => p.colors || []))];
  const productTypes = [...new Set(pageProducts.map((p) => readName(p.subCategory)).filter(Boolean))];
  const sizes        = [...new Set(pageProducts.flatMap((p) => p.sizes || []))];
  const maxPrice     = Math.max(10000, ...pageProducts.map((p) => Number(p.price) || 0));

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        Loading Products...
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{title || "Shop Collection"}</h1>
          <p>{filteredProducts.length} products available</p>
        </div>
      </div>

      <div className={styles.layout}>

        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          brands={brands}
          colors={colors}
          productTypes={productTypes}
          sizes={sizes}
          maxPrice={maxPrice}
        />

        <div className={styles.content}>

          <div className={styles.mobileToolbar}>
            <button
              className={styles.mobileFilterBtn}
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
            <span className={styles.mobileCount}>
              {filteredProducts.length} Products
            </span>
          </div>

          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={getProductId(product)}
                product={product}
                wishlist={wishlist}
                setWishlist={setWishlist}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          {!filteredProducts.length && (
            <div className={styles.emptyProducts}>
              <h2>Products coming soon</h2>
              <p>We are adding products for this collection. Please check back soon.</p>
            </div>
          )}

        </div>
      </div>

      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        setFilters={setFilters}
        brands={brands}
        colors={colors}
        productTypes={productTypes}
        sizes={sizes}
        maxPrice={maxPrice}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
    </section>
  );
}