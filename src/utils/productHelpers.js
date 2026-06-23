export const BASE_ASSET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://doppey-admin-backend.onrender.com";

export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const readName = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.title || value.slug || "";
};

export const getProductId = (product = {}) =>
  product._id || product.id || product.slug;

export const getProductSlug = (product = {}) =>
  product.slug || getProductId(product);

export const getCategorySlug = (product = {}) =>
  slugify(readName(product.subCategory) || product.subCategory);

export const getMainCategorySlug = (product = {}) =>
  slugify(
    readName(product.category) ||
    product.category
  );    

export const getImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/products/")) return url;
  if (url.startsWith("/")) return `${BASE_ASSET_URL}${url}`;
  return `${BASE_ASSET_URL}/${url}`;
};

export const getProductImages = (product = {}) => {
  const images = product.images?.length ? product.images : [product.image];
  return images.filter(Boolean);
};

export const getReviewCount = (product = {}) =>
  product.reviewCount ||
  product.reviewsCount ||
  product.reviews?.length ||
  product.totalReviews ||
  0;

export const getOldPrice = (product = {}) => {
  if (product.oldPrice || product.originalPrice) {
    return product.oldPrice || product.originalPrice;
  }

  const discount = Number(product.discount || 0);
  const price = Number(product.price || 0);

  if (!discount || !price) return null;

  return Math.round(price / (1 - discount / 100));
};

const keywordMatches = (product, keywords) => {
  const values = [
    product.name,
    product.brand,
    readName(product.mainCategory),
    readName(product.subCategory),
    product.season,
    product.collection,
    ...(product.tags || []),
    ...(product.categories || []),
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) => values.includes(keyword));
};

export const productMatchesPage = (product, pageType) => {
  if (!pageType) return true;

  const sub = getCategorySlug(product);
  const main = getMainCategorySlug(product);

  switch (pageType) {
    case "new-arrivals":
      return Boolean(product.isNewArrival || product.isNew || product.createdAt);
    case "summer-collection":
      return Boolean(
        product.isSummerCollection ||
          product.isSummer ||
          keywordMatches(product, ["summer"])
      );
    case "best-sellers":
      return Boolean(product.isBestSeller || product.bestSeller);
    case "clearance-sale":
      return Number(product.discount || 0) >= 20;
    case "pants-trousers":
      return keywordMatches(product, ["pant", "trouser", "cargo", "jogger"]);
    case "cord-sets":
      return keywordMatches(product, ["cord", "co-ord", "coord", "set"]);
    case "accessories":
      return sub.includes("accessor") || main.includes("accessor");
    default:
      return sub.includes(pageType) || main.includes(pageType);
  }
};

export const sortNewestFirst = (products = []) =>
  [...products].sort((a, b) => {
    const aDate = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const bDate = new Date(b.createdAt || b.updatedAt || 0).getTime();
    return bDate - aDate;
  });

export const getStoredReviews = () => {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem("productReviews") || "{}");
};

export const saveStoredReviews = (reviewsByProduct) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("productReviews", JSON.stringify(reviewsByProduct));
  window.dispatchEvent(new Event("product-reviews-updated"));
};
